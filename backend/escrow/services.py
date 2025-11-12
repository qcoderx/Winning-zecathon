import uuid
from decimal import Decimal
from django.utils import timezone
from django.db import transaction as db_transaction
from .models import EscrowAccount, Transaction, Disbursement, RepaymentSchedule
from django.conf import settings
import requests
import json
import logging

# Set up logging for service errors
logger = logging.getLogger(__name__)

# --- Helper Functions ---

def generate_reference(prefix='REF'):
    """Generate unique reference for transactions with a given prefix."""
    return f"{prefix}_{uuid.uuid4().hex[:8].upper()}"

# --- Mock/Generic Gateway Services ---

class PaymentGatewayService:
    """Service for handling generic payment gateway integrations (mocks for demo)."""
    
    @staticmethod
    def process_payment(amount, payment_method, metadata):
        """Process payment through payment gateway"""
        # For demo purposes, return mock success response
        return {
            'success': True,
            'transaction_reference': generate_reference('REPAY'),
            'gateway_response': {'status': 'success', 'message': 'Payment processed successfully'}
        }
    
    @staticmethod
    def process_disbursement(bank_details, amount):
        """Process disbursement to bank account (Mock)"""
        return {
            'success': True,
            'disbursement_reference': generate_reference('DISB'),
            'gateway_response': {'status': 'success', 'message': 'Disbursement processed successfully'}
        }

# --- Paystack Service (Using Direct Requests) ---

class PaystackService:
    """Service for handling Paystack API integration via requests, avoiding wrapper issues."""

    def __init__(self):
        self.secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', 'sk_test_...')
        self.base_url = "https://api.paystack.co"
        self.headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json"
        }
        
    def _make_api_call(self, method, endpoint, data=None):
        """Internal method to handle Paystack API calls."""
        url = f"{self.base_url}/{endpoint}"
        try:
            if method == 'POST':
                response = requests.post(url, headers=self.headers, json=data, timeout=10)
            elif method == 'GET':
                response = requests.get(url, headers=self.headers, timeout=10)
            else:
                return {'status': False, 'message': 'Unsupported HTTP method'}

            response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
            return response.json()
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Paystack API call failed ({method} {endpoint}): {e}")
            return {"status": False, "message": f"API request error: {e}"}
        except json.JSONDecodeError:
            logger.error(f"Paystack API returned invalid JSON: {response.text}")
            return {"status": False, "message": "API returned invalid response"}

    # --- Paystack API Methods ---
    
    def _is_mock_mode(self):
        """Checks if the service should return mock data (e.g., in a test environment)."""
        return self.secret_key == 'sk_test_...'
    
    def create_subaccount(self, business_name, account_number, bank_code, percentage_charge=0.5):
        """Create a subaccount (Mocked for simplicity/testing)."""
        # For testing, we return a mock success
        return {
            'success': True,
            'subaccount_code': f'SUB_{generate_reference()}',
            'account_number': account_number,
            'bank_name': 'Test Bank'
        }
    
    def initialize_transaction(self, email, amount, reference, subaccount=None):
        """Initialize a transaction for escrow funding."""
        
        # Mock success for testing environment
        if self._is_mock_mode():
            return {
                'success': True,
                'authorization_url': 'https://checkout.paystack.com/test_mock_123',
                'reference': reference
            }

        endpoint = "transaction/initialize"
        amount_in_kobo = int(amount * 100)
        
        payload = {
            'email': email,
            'amount': amount_in_kobo,
            'reference': reference,
            'currency': 'NGN',
            'callback_url': getattr(settings, 'PAYSTACK_CALLBACK_URL', 'http://example.com/callback')
        }
        
        if subaccount:
            payload['subaccount'] = subaccount
            payload['bearer'] = 'subaccount'
        
        response = self._make_api_call('POST', endpoint, payload)
        
        if response.get('status'):
            return {
                'success': True,
                'authorization_url': response['data']['authorization_url'],
                'reference': response['data']['reference']
            }
        else:
            return {'success': False, 'message': response.get('message', 'Initialization failed')}

    def verify_transaction(self, reference):
        """Verify a transaction."""
        
        # Mock success for testing environment
        if self._is_mock_mode():
            return {
                'success': True,
                'amount': Decimal('100000.00'),
                'currency': 'NGN',
                'gateway_response': {'status': 'success'}
            }

        endpoint = f"transaction/verify/{reference}"
        response = self._make_api_call('GET', endpoint)
        
        if response.get('status') and response['data']['status'] == 'success':
            return {
                'success': True,
                'amount': Decimal(response['data']['amount']) / 100,
                'currency': response['data']['currency'],
                'gateway_response': response['data']
            }
        else:
            return {'success': False, 'message': response.get('message', 'Transaction failed or pending')}

    def transfer_to_subaccount(self, amount, recipient, reason):
        """Initiate a transfer (disbursement)."""
        
        # Mock success for testing environment
        if self._is_mock_mode():
            return {
                'success': True,
                'transfer_code': 'TRF_mock_123',
                'reference': generate_reference('TRF')
            }
            
        endpoint = "transfer"
        payload = {
            'source': 'balance',
            'amount': int(amount * 100),
            'recipient': recipient,
            'reason': reason
        }

        response = self._make_api_call('POST', endpoint, payload)
        
        if response.get('status'):
            return {
                'success': True,
                'transfer_code': response['data']['transfer_code'],
                'reference': response['data']['reference']
            }
        else:
            return {'success': False, 'message': response.get('message', 'Transfer failed')}
    
    def create_transfer_recipient(self, name, account_number, bank_code):
        """Create a transfer recipient for disbursement."""

        # Mock success for testing environment
        if self._is_mock_mode():
            return {
                'success': True,
                'recipient_code': 'RCP_mock_123'
            }

        endpoint = "transferrecipient"
        payload = {
            'type': 'nuban',
            'name': name,
            'account_number': account_number,
            'bank_code': bank_code,
            'currency': 'NGN'
        }

        response = self._make_api_call('POST', endpoint, payload)

        if response.get('status'):
            return {
                'success': True,
                'recipient_code': response['data']['recipient_code']
            }
        else:
            return {'success': False, 'message': response.get('message', 'Recipient creation failed')}


# --- Escrow Service ---

class EscrowService:
    """Service class for handling escrow operations and linking Paystack."""
    
    def __init__(self):
        self.paystack = PaystackService()
    
    def create_escrow_account(self, loan_application):
        """Create an escrow account for a loan application"""
        escrow_id = f"ESC{str(uuid.uuid4())[:8].upper()}"
        
        escrow_account = EscrowAccount.objects.create(
            loan_application=loan_application,
            escrow_id=escrow_id,
            amount_held=Decimal('0.00'),
            status='pending'
        )
        
        return escrow_account
    
    def initialize_escrow_funding(self, loan_application, amount, lender_email):
        """Initialize escrow funding process"""
        reference = generate_reference('ESCROW')
        
        # Check if escrow account exists (it should, from a previous step)
        try:
            escrow_account = loan_application.escrow_account
        except EscrowAccount.DoesNotExist:
            escrow_account = self.create_escrow_account(loan_application)

        # Initialize Paystack transaction
        result = self.paystack.initialize_transaction(
            email=lender_email,
            amount=amount,
            reference=reference
        )
        
        if result['success']:
            # Create pending transaction record
            transaction = Transaction.objects.create(
                loan_application=loan_application,
                escrow_account=escrow_account,
                transaction_id=reference,
                transaction_type='fund_escrow',
                amount=amount,
                status='pending',
                description=f"Escrow funding initialization for loan #{loan_application.id}",
                payment_reference=reference
            )
            
            return {
                'success': True,
                'authorization_url': result['authorization_url'],
                'reference': reference,
                'transaction_id': transaction.id
            }
        else:
            return {'success': False, 'message': result['message']}
    
    def verify_escrow_funding(self, reference):
        """Verify escrow funding transaction"""
        # Verify payment with Paystack
        verification = self.paystack.verify_transaction(reference)
        
        if verification['success']:
            try:
                # Use select_for_update to lock the row during transaction
                with db_transaction.atomic():
                    transaction = Transaction.objects.select_for_update().get(transaction_id=reference)
                    
                    # Check if already completed to avoid duplicate processing
                    if transaction.status == 'completed':
                        return {'success': True, 'transaction': transaction}
                    
                    loan_application = transaction.loan_application
                    escrow_account = loan_application.escrow_account
                    
                    # Update transaction
                    transaction.status = 'completed'
                    transaction.completed_at = timezone.now()
                    transaction.gateway_response = verification['gateway_response']
                    transaction.save()
                    
                    # Update escrow account
                    escrow_account.amount_held = verification['amount']
                    escrow_account.status = 'active'
                    escrow_account.save()
                    
                return {'success': True, 'transaction': transaction}
                
            except Transaction.DoesNotExist:
                return {'success': False, 'message': 'Transaction not found'}
        else:
            return {'success': False, 'message': verification['message']}
    
    def initiate_disbursement(self, loan_application):
        """Initiate disbursement to SME using Paystack transfer"""
        with db_transaction.atomic():
            escrow_account = loan_application.escrow_account
            
            # Check for sufficient funds
            if escrow_account.amount_held < loan_application.loan_amount:
                # In a real system, you might only disburse the amount held.
                # Here, we prevent disbursement if the full amount isn't ready.
                return {'success': False, 'message': 'Insufficient funds in escrow account to cover the loan amount.'}
            
            # Get SME bank details
            sme_business = loan_application.sme_business
            
            # Create transfer recipient
            recipient_result = self.paystack.create_transfer_recipient(
                name=sme_business.bank_account_name,
                account_number=sme_business.bank_account_number,
                bank_code=self._get_bank_code(sme_business.bank_name)
            )
            
            if not recipient_result['success']:
                return {'success': False, 'message': recipient_result['message']}
            
            disbursement_amount = loan_application.loan_amount # Disburse the original loan amount

            # Create disbursement record
            disbursement = Disbursement.objects.create(
                loan_application=loan_application,
                escrow_account=escrow_account,
                amount=disbursement_amount,
                beneficiary_account_number=sme_business.bank_account_number,
                beneficiary_account_name=sme_business.bank_account_name,
                beneficiary_bank=sme_business.bank_name,
                status='processing'
            )
            
            # Initiate transfer
            transfer_result = self.paystack.transfer_to_subaccount(
                amount=disbursement_amount,
                recipient=recipient_result['recipient_code'],
                reason=f"Loan disbursement to {sme_business.business_name} for loan #{loan_application.id}"
            )
            
            if transfer_result['success']:
                # Create disbursement transaction
                Transaction.objects.create(
                    loan_application=loan_application,
                    escrow_account=escrow_account,
                    transaction_id=transfer_result['reference'],
                    transaction_type='disburse',
                    amount=disbursement_amount,
                    status='completed',
                    description=f"Disbursement to {sme_business.business_name}",
                    payment_reference=transfer_result['reference'],
                    completed_at=timezone.now()
                )
                
                # Update disbursement
                disbursement.status = 'completed'
                disbursement.completed_at = timezone.now()
                disbursement.save()
                
                # Update escrow account (subtract disbursed amount)
                escrow_account.amount_held -= disbursement_amount
                escrow_account.status = 'released' if escrow_account.amount_held <= 0 else 'active'
                escrow_account.released_at = timezone.now() if escrow_account.amount_held <= 0 else None
                escrow_account.save()
                
                # Update loan application
                loan_application.status = 'active'
                loan_application.disbursement_date = timezone.now()
                loan_application.save()
                
                # Generate repayment schedule
                self.generate_repayment_schedule(loan_application)
                
                return {'success': True, 'disbursement': disbursement}
            else:
                disbursement.status = 'failed'
                disbursement.save()
                return {'success': False, 'message': transfer_result['message']}
    
    def _get_bank_code(self, bank_name):
        """Map bank name to Paystack bank code (requires Paystack Banks API lookup for robust solution)"""
        # Common Nigerian banks - placeholder/mock list
        bank_codes = {
            'access bank': '044', 'citibank': '023', 'ecobank': '050', 'fidelity bank': '070', 
            'first bank': '011', 'guaranty trust bank': '058', 'united bank for africa': '033', 
            'zenith bank': '057', 'test bank': '057' # Added 'Test Bank' for testing
        }
        
        return bank_codes.get(bank_name.lower(), '057') 
    
    def generate_repayment_schedule(self, loan_application):
        """Generate repayment schedule for the loan"""
        # Delete existing schedule to prevent duplicates during retry/re-run
        RepaymentSchedule.objects.filter(loan_application=loan_application).delete()

        loan_amount = loan_application.loan_amount
        interest_rate = loan_application.interest_rate / 100
        tenure_months = loan_application.tenure_months
        
        # Simple interest calculation
        total_interest = loan_amount * interest_rate * (tenure_months / 12)
        total_repayment = loan_amount + total_interest
        
        if loan_application.repayment_frequency == 'monthly':
            # Use Decimal division and rounding for financial accuracy
            monthly_payment = (total_repayment / Decimal(tenure_months)).quantize(Decimal('0.01'))
            principal_per_month = (loan_amount / Decimal(tenure_months)).quantize(Decimal('0.01'))
            interest_per_month = (total_interest / Decimal(tenure_months)).quantize(Decimal('0.01'))

            for i in range(tenure_months):
                # Calculate due date: assumes 30 days per month approximation
                due_date = loan_application.disbursement_date.date() + timezone.timedelta(days=30 * (i + 1))
                
                RepaymentSchedule.objects.create(
                    loan_application=loan_application,
                    installment_number=i + 1,
                    due_date=due_date,
                    principal_amount=principal_per_month,
                    interest_amount=interest_per_month,
                    total_amount=monthly_payment
                )