from django.test import TestCase, TransactionTestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from unittest.mock import patch, MagicMock
import uuid
import json

from .models import LoanApplication, EscrowAccount, Transaction, RepaymentSchedule, Disbursement
from .services import EscrowService, PaystackService
from sme.models import BusinessProfile
from lender.models import LenderProfile

User = get_user_model()

# Helper functions
def create_test_user(email, user_type, password='testpass123'):
    """Create a test user"""
    return User.objects.create_user(
        email=email,
        password=password,
        user_type=user_type
    )

def create_test_business_profile(user, **kwargs):
    """Create a business profile with all required fields"""
    defaults = {
        'business_name': f'Test Business {user.email}',
        'business_category': 'software',
        'business_registration_number': f'RC{uuid.uuid4().hex[:6].upper()}',
        'business_address': '123 Test Street, Lagos',
        'business_phone': '+2348012345678',
        'business_email': user.email,
        'bank_account_number': '1234567890',
        'bank_name': 'Test Bank',
        'bank_account_name': f'Test Business {user.email}',
        'verification_status': 'verified',
        'pulse_score': 85,
        'profit_score': 78
    }
    defaults.update(kwargs)
    return BusinessProfile.objects.create(user=user, **defaults)

def create_test_lender_profile(user, **kwargs):
    """Create a lender profile with all required fields"""
    defaults = {
        'lender_type': 'bank',
        'company_name': f'Test Lender {user.email}',
        'company_registration_number': f'LIC{uuid.uuid4().hex[:6].upper()}',
        'years_in_operation': 5,
        'total_assets': Decimal('10000000.00'),
        'preferred_industries': ['software', 'retail'],
        'min_loan_amount': Decimal('10000.00'),
        'max_loan_amount': Decimal('1000000.00'),
        'risk_appetite': 7,
        'contact_person': 'Test Contact',
        'contact_email': user.email,
        'contact_phone': '+2348087654321',
        'office_address': '456 Lender Street, Lagos',
        'is_verified': True
    }
    defaults.update(kwargs)
    return LenderProfile.objects.create(user=user, **defaults)

class EscrowModelsTestCase(TestCase):
    """Test cases for escrow models"""
    
    def setUp(self):
        self.sme_user = create_test_user('sme@test.com', 'sme')
        self.lender_user = create_test_user('lender@test.com', 'lender')
        self.business_profile = create_test_business_profile(self.sme_user)
        self.lender_profile = create_test_lender_profile(self.lender_user)
    
    def test_loan_application_creation(self):
        """Test loan application model creation"""
        loan_app = LoanApplication.objects.create(
            sme_business=self.business_profile,
            lender=self.lender_profile,
            loan_amount=Decimal('100000.00'),
            interest_rate=Decimal('15.00'),
            tenure_months=12,
            purpose='Working capital',
            repayment_frequency='monthly'
        )
        
        self.assertEqual(loan_app.sme_business, self.business_profile)
        self.assertEqual(loan_app.lender, self.lender_profile)
        self.assertEqual(loan_app.loan_amount, Decimal('100000.00'))
        self.assertEqual(loan_app.status, 'draft')
        self.assertIsNotNone(loan_app.created_at)
    
    def test_escrow_account_creation(self):
        """Test escrow account model creation"""
        loan_app = LoanApplication.objects.create(
            sme_business=self.business_profile,
            lender=self.lender_profile,
            loan_amount=Decimal('100000.00'),
            interest_rate=Decimal('15.00'),
            tenure_months=12,
            purpose='Working capital'
        )
        
        escrow_account = EscrowAccount.objects.create(
            loan_application=loan_app,
            escrow_id='ESC12345678',
            amount_held=Decimal('100000.00'),
            status='active'
        )
        
        self.assertEqual(escrow_account.loan_application, loan_app)
        self.assertEqual(escrow_account.amount_held, Decimal('100000.00'))
        self.assertEqual(escrow_account.status, 'active')
    
    def test_transaction_creation(self):
        """Test transaction model creation"""
        loan_app = LoanApplication.objects.create(
            sme_business=self.business_profile,
            lender=self.lender_profile,
            loan_amount=Decimal('100000.00'),
            interest_rate=Decimal('15.00'),
            tenure_months=12,
            purpose='Working capital'
        )
        
        escrow_account = EscrowAccount.objects.create(
            loan_application=loan_app,
            escrow_id='ESC12345678'
        )
        
        transaction = Transaction.objects.create(
            loan_application=loan_app,
            escrow_account=escrow_account,
            transaction_id='TXN12345678',
            transaction_type='fund_escrow',
            amount=Decimal('100000.00'),
            status='completed'
        )
        
        self.assertEqual(transaction.loan_application, loan_app)
        self.assertEqual(transaction.escrow_account, escrow_account)
        self.assertEqual(transaction.amount, Decimal('100000.00'))
        self.assertEqual(transaction.transaction_type, 'fund_escrow')
    
    def test_repayment_schedule_creation(self):
        """Test repayment schedule model creation"""
        loan_app = LoanApplication.objects.create(
            sme_business=self.business_profile,
            lender=self.lender_profile,
            loan_amount=Decimal('100000.00'),
            interest_rate=Decimal('15.00'),
            tenure_months=12,
            purpose='Working capital',
            status='active'
        )
        
        repayment = RepaymentSchedule.objects.create(
            loan_application=loan_app,
            installment_number=1,
            due_date=timezone.now().date() + timezone.timedelta(days=30),
            principal_amount=Decimal('8333.33'),
            interest_amount=Decimal('1250.00'),
            total_amount=Decimal('9583.33'),
            status='pending'
        )
        
        self.assertEqual(repayment.loan_application, loan_app)
        self.assertEqual(repayment.installment_number, 1)
        self.assertEqual(repayment.total_amount, Decimal('9583.33'))
    
    def test_disbursement_creation(self):
        """Test disbursement model creation"""
        loan_app = LoanApplication.objects.create(
            sme_business=self.business_profile,
            lender=self.lender_profile,
            loan_amount=Decimal('100000.00'),
            interest_rate=Decimal('15.00'),
            tenure_months=12,
            purpose='Working capital'
        )
        
        escrow_account = EscrowAccount.objects.create(
            loan_application=loan_app,
            escrow_id='ESC12345678',
            amount_held=Decimal('100000.00')
        )
        
        disbursement = Disbursement.objects.create(
            loan_application=loan_app,
            escrow_account=escrow_account,
            amount=Decimal('100000.00'),
            beneficiary_account_number='1234567890',
            beneficiary_account_name='Test Business',
            beneficiary_bank='Test Bank',
            status='completed'
        )
        
        self.assertEqual(disbursement.loan_application, loan_app)
        self.assertEqual(disbursement.amount, Decimal('100000.00'))
        self.assertEqual(disbursement.status, 'completed')

class PaystackServiceTestCase(TestCase):
    """Test cases for Paystack service with proper mocking"""
    
    def setUp(self):
        self.paystack_service = PaystackService()
    
    @patch('paystack.Paystack')
    def test_create_subaccount_success(self, mock_paystack):
        """Test successful subaccount creation"""
        mock_instance = MagicMock()
        mock_instance.subaccount.create.return_value = {
            'status': True,
            'data': {
                'subaccount_code': 'ACCT_test123',
                'account_number': '1234567890',
                'settlement_bank': 'Test Bank'
            }
        }
        mock_paystack.return_value = mock_instance
        
        result = self.paystack_service.create_subaccount(
            business_name='Test Business',
            account_number='1234567890',
            bank_code='044'
        )
        
        self.assertTrue(result['success'])
        self.assertEqual(result['subaccount_code'], 'ACCT_test123')
        mock_instance.subaccount.create.assert_called_once()
    
    @patch('paystack.Paystack')
    def test_initialize_transaction_success(self, mock_paystack):
        """Test successful transaction initialization"""
        mock_instance = MagicMock()
        mock_instance.transaction.initialize.return_value = {
            'status': True,
            'data': {
                'authorization_url': 'https://checkout.paystack.com/test123',
                'access_code': 'test_access_code',
                'reference': 'test_ref_123'
            }
        }
        mock_paystack.return_value = mock_instance
        
        result = self.paystack_service.initialize_transaction(
            email='test@example.com',
            amount=Decimal('100000.00'),
            reference='test_ref_123'
        )
        
        self.assertTrue(result['success'])
        self.assertIn('authorization_url', result)
        self.assertEqual(result['reference'], 'test_ref_123')
        mock_instance.transaction.initialize.assert_called_once()
    
    @patch('paystack.Paystack')
    def test_verify_transaction_success(self, mock_paystack):
        """Test successful transaction verification"""
        mock_instance = MagicMock()
        mock_instance.transaction.verify.return_value = {
            'status': True,
            'data': {
                'status': 'success',
                'amount': 10000000,  # Amount in kobo
                'currency': 'NGN',
                'paid_at': '2023-01-01T00:00:00Z'
            }
        }
        mock_paystack.return_value = mock_instance
        
        result = self.paystack_service.verify_transaction('test_ref_123')
        
        self.assertTrue(result['success'])
        self.assertEqual(result['amount'], Decimal('100000.00'))
        mock_instance.transaction.verify.assert_called_once_with('test_ref_123')
    
    @patch('paystack.Paystack')
    def test_create_transfer_recipient_success(self, mock_paystack):
        """Test successful transfer recipient creation"""
        mock_instance = MagicMock()
        mock_instance.transfer_recipient.create.return_value = {
            'status': True,
            'data': {
                'recipient_code': 'RCP_test123',
                'details': {'account_number': '1234567890'}
            }
        }
        mock_paystack.return_value = mock_instance
        
        result = self.paystack_service.create_transfer_recipient(
            name='Test Business',
            account_number='1234567890',
            bank_code='044'
        )
        
        self.assertTrue(result['success'])
        self.assertEqual(result['recipient_code'], 'RCP_test123')
        mock_instance.transfer_recipient.create.assert_called_once()
    
    @patch('paystack.Paystack')
    def test_transfer_to_subaccount_success(self, mock_paystack):
        """Test successful transfer to subaccount"""
        mock_instance = MagicMock()
        mock_instance.transfer.create.return_value = {
            'status': True,
            'data': {
                'transfer_code': 'TRF_test123',
                'reference': 'transfer_ref_123'
            }
        }
        mock_paystack.return_value = mock_instance
        
        result = self.paystack_service.transfer_to_subaccount(
            amount=Decimal('50000.00'),
            recipient='RCP_test123',
            reason='Test disbursement'
        )
        
        self.assertTrue(result['success'])
        self.assertEqual(result['transfer_code'], 'TRF_test123')
        mock_instance.transfer.create.assert_called_once()

class EscrowServiceTestCase(TransactionTestCase):
    """Test cases for escrow service with proper database isolation"""
    
    def setUp(self):
        self.sme_user = create_test_user('sme@test.com', 'sme')
        self.lender_user = create_test_user('lender@test.com', 'lender')
        self.business_profile = create_test_business_profile(self.sme_user)
        self.lender_profile = create_test_lender_profile(self.lender_user)
        
        self.loan_application = LoanApplication.objects.create(
            sme_business=self.business_profile,
            lender=self.lender_profile,
            loan_amount=Decimal('100000.00'),
            interest_rate=Decimal('15.00'),
            tenure_months=12,
            purpose='Working capital',
            status='approved'
        )
        
        self.escrow_service = EscrowService()
    
    def test_create_escrow_account(self):
        """Test escrow account creation"""
        escrow_account = self.escrow_service.create_escrow_account(self.loan_application)
        
        self.assertIsNotNone(escrow_account)
        self.assertEqual(escrow_account.loan_application, self.loan_application)
        self.assertEqual(escrow_account.amount_held, Decimal('0.00'))
        self.assertEqual(escrow_account.status, 'pending')
        self.assertTrue(escrow_account.escrow_id.startswith('ESC'))
    
    @patch.object(PaystackService, 'initialize_transaction')
    def test_initialize_escrow_funding_success(self, mock_initialize):
        """Test successful escrow funding initialization"""
        # Create escrow account first
        escrow_account = self.escrow_service.create_escrow_account(self.loan_application)
        
        mock_initialize.return_value = {
            'success': True,
            'authorization_url': 'https://checkout.paystack.com/test123',
            'reference': 'test_ref_123'
        }
        
        result = self.escrow_service.initialize_escrow_funding(
            loan_application=self.loan_application,
            amount=Decimal('100000.00'),
            lender_email='lender@test.com'
        )
        
        self.assertTrue(result['success'])
        self.assertIn('authorization_url', result)
        
        # Check transaction was created
        transaction = Transaction.objects.get(payment_reference='test_ref_123')
        self.assertEqual(transaction.amount, Decimal('100000.00'))
        self.assertEqual(transaction.status, 'pending')
        self.assertEqual(transaction.transaction_type, 'fund_escrow')
    
    @patch.object(PaystackService, 'verify_transaction')
    def test_verify_escrow_funding_success(self, mock_verify):
        """Test successful escrow funding verification"""
        # Create escrow account and transaction
        escrow_account = self.escrow_service.create_escrow_account(self.loan_application)
        
        transaction = Transaction.objects.create(
            loan_application=self.loan_application,
            escrow_account=escrow_account,
            transaction_id='test_ref_123',
            transaction_type='fund_escrow',
            amount=Decimal('100000.00'),
            status='pending',
            payment_reference='test_ref_123'
        )
        
        mock_verify.return_value = {
            'success': True,
            'amount': Decimal('100000.00'),
            'gateway_response': {'status': 'success'}
        }
        
        result = self.escrow_service.verify_escrow_funding('test_ref_123')
        
        self.assertTrue(result['success'])
        
        # Check transaction and escrow account were updated
        transaction.refresh_from_db()
        escrow_account.refresh_from_db()
        self.loan_application.refresh_from_db()
        
        self.assertEqual(transaction.status, 'completed')
        self.assertEqual(escrow_account.amount_held, Decimal('100000.00'))
        self.assertEqual(escrow_account.status, 'active')
    
    @patch.object(PaystackService, 'create_transfer_recipient')
    @patch.object(PaystackService, 'transfer_to_subaccount')
    def test_initiate_disbursement_success(self, mock_transfer, mock_create_recipient):
        """Test successful disbursement initiation"""
        # Create funded escrow account
        escrow_account = self.escrow_service.create_escrow_account(self.loan_application)
        escrow_account.amount_held = Decimal('100000.00')
        escrow_account.status = 'active'
        escrow_account.save()
        
        mock_create_recipient.return_value = {
            'success': True,
            'recipient_code': 'RCP_test123'
        }
        
        mock_transfer.return_value = {
            'success': True,
            'transfer_code': 'TRF_test123',
            'reference': 'transfer_ref_123'
        }
        
        result = self.escrow_service.initiate_disbursement(self.loan_application)
        
        self.assertTrue(result['success'])
        
        # Check disbursement was created
        disbursement = Disbursement.objects.get(loan_application=self.loan_application)
        self.assertEqual(disbursement.amount, Decimal('100000.00'))
        self.assertEqual(disbursement.status, 'completed')
        
        # Check escrow account was updated
        escrow_account.refresh_from_db()
        self.assertEqual(escrow_account.amount_held, Decimal('0.00'))
        self.assertEqual(escrow_account.status, 'released')
        
        # Check repayment schedule was generated
        repayment_schedules = RepaymentSchedule.objects.filter(loan_application=self.loan_application)
        self.assertEqual(repayment_schedules.count(), 12)  # 12 monthly payments

class EscrowAPITestCase(APITestCase):
    """Test cases for escrow API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.sme_user = create_test_user('sme@test.com', 'sme')
        self.lender_user = create_test_user('lender@test.com', 'lender')
        self.business_profile = create_test_business_profile(self.sme_user)
        self.lender_profile = create_test_lender_profile(self.lender_user)
    
    def test_create_loan_application_as_sme(self):
        """Test loan application creation by SME"""
        self.client.force_authenticate(user=self.sme_user)
        
        data = {
            'loan_amount': '100000.00',
            'interest_rate': '15.00',
            'tenure_months': 12,
            'purpose': 'Working capital for business expansion',
            'repayment_frequency': 'monthly'
        }
        
        url = reverse('loan-application-list')
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(LoanApplication.objects.count(), 1)
        
        loan_app = LoanApplication.objects.first()
        self.assertEqual(loan_app.sme_business, self.business_profile)
        self.assertEqual(loan_app.status, 'submitted')
        
        # Check escrow account was created
        self.assertTrue(hasattr(loan_app, 'escrow_account'))
    
    def test_approve_loan_application_as_lender(self):
        """Test loan application approval by lender"""
        # Create loan application
        loan_app = LoanApplication.objects.create(
            sme_business=self.business_profile,
            lender=self.lender_profile,
            loan_amount=Decimal('100000.00'),
            interest_rate=Decimal('15.00'),
            tenure_months=12,
            purpose='Working capital',
            status='submitted'
        )
        
        self.client.force_authenticate(user=self.lender_user)
        
        url = reverse('loan-application-approve-application', kwargs={'pk': loan_app.id})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        loan_app.refresh_from_db()
        self.assertEqual(loan_app.status, 'approved')
        self.assertIsNotNone(loan_app.approval_date)
    
    @patch.object(EscrowService, 'initialize_escrow_funding')
    def test_initialize_funding_as_lender(self, mock_initialize):
        """Test escrow funding initialization by lender"""
        # Create approved loan application with escrow account
        loan_app = LoanApplication.objects.create(
            sme_business=self.business_profile,
            lender=self.lender_profile,
            loan_amount=Decimal('100000.00'),
            interest_rate=Decimal('15.00'),
            tenure_months=12,
            purpose='Working capital',
            status='approved'
        )
        
        EscrowAccount.objects.create(
            loan_application=loan_app,
            escrow_id='ESC12345678'
        )
        
        mock_initialize.return_value = {
            'success': True,
            'authorization_url': 'https://checkout.paystack.com/test123',
            'reference': 'test_ref_123'
        }
        
        self.client.force_authenticate(user=self.lender_user)
        
        data = {'amount': '100000.00'}
        url = reverse('loan-application-initialize-funding', kwargs={'pk': loan_app.id})
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('authorization_url', response.data)
        self.assertEqual(response.data['reference'], 'test_ref_123')
    
    def test_get_loan_applications_as_sme(self):
        """Test SME can only see their own loan applications"""
        # Create loan application
        loan_app = LoanApplication.objects.create(
            sme_business=self.business_profile,
            lender=self.lender_profile,
            loan_amount=Decimal('100000.00'),
            interest_rate=Decimal('15.00'),
            tenure_months=12,
            purpose='Working capital'
        )
        
        self.client.force_authenticate(user=self.sme_user)
        
        url = reverse('loan-application-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], loan_app.id)
    
    def test_unauthorized_access_to_loan_application(self):
        """Test unauthorized users cannot access loan applications"""
        # Create loan application
        loan_app = LoanApplication.objects.create(
            sme_business=self.business_profile,
            lender=self.lender_profile,
            loan_amount=Decimal('100000.00'),
            interest_rate=Decimal('15.00'),
            tenure_months=12,
            purpose='Working capital'
        )
        
        # Create another user
        other_user = create_test_user('other@test.com', 'sme')
        self.client.force_authenticate(user=other_user)
        
        url = reverse('loan-application-detail', kwargs={'pk': loan_app.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class EscrowIntegrationTestCase(TransactionTestCase):
    """Integration tests for complete escrow workflow"""
    
    def setUp(self):
        self.client = APIClient()
        self.sme_user = create_test_user('sme@test.com', 'sme')
        self.lender_user = create_test_user('lender@test.com', 'lender')
        self.business_profile = create_test_business_profile(self.sme_user)
        self.lender_profile = create_test_lender_profile(self.lender_user)
    
    @patch.object(EscrowService, 'initialize_escrow_funding')
    @patch.object(EscrowService, 'verify_escrow_funding')
    @patch.object(EscrowService, 'initiate_disbursement')
    def test_complete_escrow_workflow(self, mock_disburse, mock_verify, mock_initialize):
        """Test complete escrow workflow from application to disbursement"""
        
        # Step 1: SME creates loan application
        self.client.force_authenticate(user=self.sme_user)
        
        loan_data = {
            'loan_amount': '100000.00',
            'interest_rate': '15.00',
            'tenure_months': 12,
            'purpose': 'Working capital for business expansion',
            'repayment_frequency': 'monthly'
        }
        
        url = reverse('loan-application-list')
        response = self.client.post(url, loan_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        loan_app_id = response.data['id']
        loan_app = LoanApplication.objects.get(id=loan_app_id)
        
        # Step 2: Lender approves application
        self.client.force_authenticate(user=self.lender_user)
        
        url = reverse('loan-application-approve-application', kwargs={'pk': loan_app_id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Step 3: Lender initializes funding
        mock_initialize.return_value = {
            'success': True,
            'authorization_url': 'https://checkout.paystack.com/test123',
            'reference': 'test_ref_123'
        }
        
        funding_data = {'amount': '100000.00'}
        url = reverse('loan-application-initialize-funding', kwargs={'pk': loan_app_id})
        response = self.client.post(url, funding_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Step 4: Verify funding (webhook simulation)
        # Create a mock transaction for verification
        mock_transaction = MagicMock()
        mock_transaction.id = 1
        mock_transaction.loan_application.id = loan_app_id
        mock_transaction.amount = Decimal('100000.00')
        
        mock_verify.return_value = {
            'success': True,
            'transaction': mock_transaction
        }
        
        verify_data = {'reference': 'test_ref_123'}
        url = reverse('verify-funding-webhook')
        response = self.client.post(url, verify_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Step 5: Initiate disbursement
        mock_disbursement = MagicMock()
        mock_disbursement.id = 1
        mock_disbursement.status = 'completed'
        mock_disbursement.amount = Decimal('100000.00')
        mock_disbursement.beneficiary_account_name = 'Test Business'
        
        mock_disburse.return_value = {
            'success': True,
            'disbursement': mock_disbursement
        }
        
        url = reverse('loan-application-initiate-disbursement', kwargs={'pk': loan_app_id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify final state
        loan_app.refresh_from_db()
        self.assertEqual(loan_app.status, 'active')
        self.assertTrue(hasattr(loan_app, 'escrow_account'))

# Test runner
if __name__ == '__main__':
    import django
    from django.conf import settings
    
    if not settings.configured:
        settings.configure(
            DEBUG=True,
            DATABASES={
                'default': {
                    'ENGINE': 'django.db.backends.sqlite3',
                    'NAME': ':memory:',
                }
            },
            INSTALLED_APPS=[
                'django.contrib.auth',
                'django.contrib.contenttypes',
                'rest_framework',
                'sme',
                'lender',
                'escrow',
                'users',
            ],
            SECRET_KEY='test-secret-key',
            REST_FRAMEWORK={
                'DEFAULT_AUTHENTICATION_CLASSES': [
                    'rest_framework_simplejwt.authentication.JWTAuthentication',
                ],
            }
        )
    
    django.setup()
    from django.test.utils import get_runner
    TestRunner = get_runner(settings)
    test_runner = TestRunner(verbosity=2)
    failures = test_runner.run_tests(["escrow.tests"])
    print(f"\nTests completed. Failures: {failures}")