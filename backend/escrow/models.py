from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings
import uuid

class LoanApplication(models.Model):
    LOAN_STATUS = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('disbursed', 'Disbursed'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('defaulted', 'Defaulted'),
    ]
    
    # Parties involved
    sme_business = models.ForeignKey('sme.BusinessProfile', on_delete=models.CASCADE, related_name='loan_applications')
    lender = models.ForeignKey(
        'lender.LenderProfile', 
        on_delete=models.SET_NULL, # Use SET_NULL or similar appropriate strategy
        related_name='applications_received',
        null=True # <--- THIS IS THE REQUIRED FIX
    )
    
    # Loan details
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0)])
    tenure_months = models.IntegerField(validators=[MinValueValidator(1)])
    purpose = models.TextField()
    
    # Repayment schedule
    repayment_frequency = models.CharField(
        max_length=20,
        choices=[('monthly', 'Monthly'), ('quarterly', 'Quarterly'), ('bullet', 'Bullet')],
        default='monthly'
    )
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=LOAN_STATUS, default='draft')
    application_date = models.DateTimeField(auto_now_add=True)
    approval_date = models.DateTimeField(null=True, blank=True)
    disbursement_date = models.DateTimeField(null=True, blank=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    
    # Risk assessment
    risk_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    loan_to_value_ratio = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'escrow_loan_applications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Loan #{self.id} - {self.sme_business.business_name}"

class EscrowAccount(models.Model):
    ESCROW_STATUS = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('released', 'Released'),
        ('refunded', 'Refunded'),
        ('disputed', 'Disputed'),
    ]
    
    loan_application = models.OneToOneField(LoanApplication, on_delete=models.CASCADE, related_name='escrow_account')
    escrow_id = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    amount_held = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)], default=0)
    status = models.CharField(max_length=20, choices=ESCROW_STATUS, default='pending')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    released_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'escrow_accounts'
    
    def __str__(self):
        return f"Escrow {self.escrow_id} - ₦{self.amount_held}"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('fund_escrow', 'Fund Escrow'),
        ('disburse', 'Disburse to SME'),
        ('repayment', 'Repayment'),
        ('interest', 'Interest Payment'),
        ('fee', 'Fee'),
        ('refund', 'Refund'),
    ]
    
    TRANSACTION_STATUS = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Reference fields
    loan_application = models.ForeignKey(LoanApplication, on_delete=models.CASCADE, related_name='transactions')
    escrow_account = models.ForeignKey(EscrowAccount, on_delete=models.CASCADE, related_name='transactions')
    
    # Transaction details
    transaction_id = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    currency = models.CharField(max_length=3, default='NGN')
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=TRANSACTION_STATUS, default='pending')
    description = models.TextField(blank=True)
    
    # Payment gateway references
    payment_reference = models.CharField(max_length=255, blank=True)
    gateway_response = models.JSONField(null=True, blank=True)
    
    # Timestamps
    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'escrow_transactions'
        ordering = ['-initiated_at']
    
    def __str__(self):
        return f"TXN {self.transaction_id} - {self.transaction_type} - ₦{self.amount}"

class RepaymentSchedule(models.Model):
    loan_application = models.ForeignKey(LoanApplication, on_delete=models.CASCADE, related_name='repayment_schedule')
    installment_number = models.IntegerField()
    due_date = models.DateField()
    principal_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    interest_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Payment status
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('paid', 'Paid'), ('overdue', 'Overdue')],
        default='pending'
    )
    paid_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'escrow_repayment_schedules'
        ordering = ['installment_number']
        unique_together = ['loan_application', 'installment_number']
    
    def __str__(self):
        return f"Installment {self.installment_number} - {self.loan_application}"

class Disbursement(models.Model):
    loan_application = models.OneToOneField(LoanApplication, on_delete=models.CASCADE, related_name='disbursement')
    escrow_account = models.ForeignKey(EscrowAccount, on_delete=models.CASCADE, related_name='disbursements')
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Bank details for disbursement
    beneficiary_account_number = models.CharField(max_length=20)
    beneficiary_account_name = models.CharField(max_length=255)
    beneficiary_bank = models.CharField(max_length=100)
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('processing', 'Processing'), ('completed', 'Completed'), ('failed', 'Failed')],
        default='pending'
    )
    
    # Timestamps
    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'escrow_disbursements'
    
    def __str__(self):
        return f"Disbursement - {self.loan_application} - ₦{self.amount}"