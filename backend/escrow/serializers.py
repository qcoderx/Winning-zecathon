from rest_framework import serializers
from .models import (
    LoanApplication, EscrowAccount, Transaction, 
    RepaymentSchedule, Disbursement, LoanNegotiation
)
from sme.serializers import BusinessProfileSerializer
from lender.serializers import LenderProfileSerializer
from users.serializers import UserSerializer # <-- IMPORT USER SERIALIZER

class LoanApplicationSerializer(serializers.ModelSerializer):
    sme_business = BusinessProfileSerializer(read_only=True)
    lender = LenderProfileSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    repayment_frequency_display = serializers.CharField(source='get_repayment_frequency_display', read_only=True)
    
    # Add escrow account info
    escrow_account = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = LoanApplication
        fields = [
            'id', 'sme_business', 'lender', 'loan_amount', 'interest_rate',
            'negotiated_rate', # <-- ADD NEGOTIATED RATE
            'tenure_months', 'purpose', 'repayment_frequency', 'repayment_frequency_display',
            'status', 'status_display', 'application_date', 'approval_date',
            'disbursement_date', 'completion_date', 'risk_score', 'loan_to_value_ratio',
            'escrow_account', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'status', 'application_date', 'approval_date', 'disbursement_date',
            'completion_date', 'risk_score', 'loan_to_value_ratio', 'created_at', 'updated_at',
            'negotiated_rate' # <-- ADD HERE
        ]
    
    def get_escrow_account(self, obj):
        """Get basic escrow account info"""
        try:
            escrow_account = obj.escrow_account
            return {
                'id': escrow_account.id,
                'escrow_id': escrow_account.escrow_id,
                'amount_held': escrow_account.amount_held,
                'status': escrow_account.status,
                'status_display': escrow_account.get_status_display()
            }
        except EscrowAccount.DoesNotExist:
            return None

class LoanApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = [
            # 'sme_business', # SME business is set from the request user, not the payload
            'loan_amount', 'interest_rate', 'tenure_months',
            'purpose', 'repayment_frequency'
        ]
    
    def validate(self, data):
        """Validate loan application data"""
        # Ensure loan amount is positive
        if data['loan_amount'] <= 0:
            raise serializers.ValidationError("Loan amount must be greater than zero")
        
        # Ensure interest rate is reasonable
        if data['interest_rate'] <= 0 or data['interest_rate'] > 50:  # 50% max interest rate
            raise serializers.ValidationError("Interest rate must be between 0 and 50%")
        
        # Ensure tenure is reasonable
        if data['tenure_months'] <= 0 or data['tenure_months'] > 60:  # 5 years max
            raise serializers.ValidationError("Loan tenure must be between 1 and 60 months")
        
        return data

class EscrowAccountSerializer(serializers.ModelSerializer):
    loan_application = LoanApplicationSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = EscrowAccount
        fields = [
            'id', 'escrow_id', 'loan_application', 'amount_held', 'status',
            'status_display', 'created_at', 'updated_at', 'released_at'
        ]

class TransactionSerializer(serializers.ModelSerializer):
    loan_application = LoanApplicationSerializer(read_only=True)
    escrow_account = EscrowAccountSerializer(read_only=True)
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_id', 'loan_application', 'escrow_account',
            'transaction_type', 'transaction_type_display', 'amount', 'currency',
            'status', 'status_display', 'description', 'payment_reference',
            'gateway_response', 'initiated_at', 'completed_at'
        ]

class RepaymentScheduleSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_overdue = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = RepaymentSchedule
        fields = [
            'id', 'installment_number', 'due_date', 'principal_amount',
            'interest_amount', 'total_amount', 'status', 'status_display',
            'is_overdue', 'paid_date'
        ]
    
    def get_is_overdue(self, obj):
        """Check if repayment is overdue"""
        from django.utils import timezone
        return obj.status == 'pending' and obj.due_date < timezone.now().date()

class DisbursementSerializer(serializers.ModelSerializer):
    loan_application = LoanApplicationSerializer(read_only=True)
    escrow_account = EscrowAccountSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Disbursement
        fields = [
            'id', 'loan_application', 'escrow_account', 'amount',
            'beneficiary_account_number', 'beneficiary_account_name',
            'beneficiary_bank', 'status', 'status_display',
            'initiated_at', 'completed_at'
        ]

class FundEscrowSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    
    def validate_amount(self, value):
        """Validate funding amount"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero")
        return value

class InitiateDisbursementSerializer(serializers.Serializer):
    # No fields needed for now, just trigger the action
    pass

class MakeRepaymentSerializer(serializers.Serializer):
    amount = serializers.DecimalField(
        max_digits=12, 
        decimal_places=2,
        min_value=0.01,
        help_text="Repayment amount"
    )
    payment_method = serializers.ChoiceField(
        choices=[('bank_transfer', 'Bank Transfer'), ('card', 'Card Payment')],
        help_text="Payment method for repayment"
    )
    
    def validate_amount(self, value):
        """Validate repayment amount"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero")
        return value

class VerifyFundingSerializer(serializers.Serializer):
    reference = serializers.CharField(
        max_length=100,
        help_text="Paystack transaction reference"
    )

class WebhookSerializer(serializers.Serializer):
    """Serializer for Paystack webhook data"""
    event = serializers.CharField()
    data = serializers.DictField()
    
    def validate(self, data):
        """Validate webhook data"""
        event = data.get('event')
        if event != 'charge.success':
            raise serializers.ValidationError("Only charge.success events are handled")
        return data

class LoanApplicationStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=LoanApplication.LOAN_STATUS)
    notes = serializers.CharField(required=False, allow_blank=True)

class EscrowDashboardSerializer(serializers.Serializer):
    """Serializer for escrow dashboard data"""
    total_loans = serializers.IntegerField()
    active_loans = serializers.IntegerField()
    pending_loans = serializers.IntegerField()
    total_amount_lent = serializers.DecimalField(max_digits=15, decimal_places=2)
    recent_transactions = TransactionSerializer(many=True)


# --- NEW SERIALIZERS ---
class LoanNegotiationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = LoanNegotiation
        fields = [
            'id', 'loan_application', 'user', 'proposed_rate', 
            'message', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'loan_application', 'user', 'status', 'created_at']

    def create(self, validated_data):
        request = self.context['request']
        loan_application = self.context['loan_application']
        
        # Only lenders can make new 'pending' offers
        if request.user.user_type != 'lender':
            raise serializers.ValidationError("Only lenders can make offers.")
        
        offer = LoanNegotiation.objects.create(
            loan_application=loan_application,
            user=request.user,
            **validated_data
        )
        
        # Update loan status to show negotiation is active
        if loan_application.status in ['draft', 'submitted']:
            loan_application.status = 'under_review'
            loan_application.save()
        
        return offer

class SMECounterOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanNegotiation
        fields = ['proposed_rate', 'message']
# -----------------------