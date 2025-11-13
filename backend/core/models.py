from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

class SMEProfile(models.Model):
    """SME Business Profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='sme_profile')
    business_name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    founder_name = models.CharField(max_length=100)
    years_in_business = models.IntegerField(default=0)
    
    # Verification Status
    pulse_score = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    profit_score = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    is_verified = models.BooleanField(default=False)
    verification_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected')
    ], default='pending')
    
    # Documents
    cac_document = models.FileField(upload_to='cac_documents/', null=True, blank=True)
    business_video = models.FileField(upload_to='business_videos/', null=True, blank=True)
    
    # Bank Connection
    mono_account_id = models.CharField(max_length=100, blank=True)
    bank_verified = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.business_name} - {self.user.username}"

class LenderProfile(models.Model):
    """Lender/Investor Profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='lender_profile')
    company_name = models.CharField(max_length=200)
    lender_type = models.CharField(max_length=50, choices=[
        ('venture_capital', 'Venture Capital'),
        ('private_equity', 'Private Equity'),
        ('commercial_bank', 'Commercial Bank'),
        ('impact_fund', 'Impact Fund'),
        ('angel_investor', 'Angel Investor')
    ])
    
    # Investment Focus
    industry_focus = models.JSONField(default=list)  # List of industries
    investment_thesis = models.TextField()
    
    # Typical Terms
    min_loan_amount = models.DecimalField(max_digits=15, decimal_places=2, default=100000)
    max_loan_amount = models.DecimalField(max_digits=15, decimal_places=2, default=100000000)
    min_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.0)
    max_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=30.0)
    min_tenure_months = models.IntegerField(default=6)
    max_tenure_months = models.IntegerField(default=60)
    
    # Requirements
    requirements = models.JSONField(default=list)  # List of requirements
    
    # Stats
    total_loans_funded = models.IntegerField(default=0)
    total_amount_deployed = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    avg_response_time_days = models.IntegerField(default=3)
    success_rate_percentage = models.IntegerField(default=70, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    logo = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.company_name} - {self.lender_type}"

class LoanApplication(models.Model):
    """Loan Application from SME"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sme = models.ForeignKey(SMEProfile, on_delete=models.CASCADE, related_name='loan_applications')
    
    # Loan Details
    loan_amount = models.DecimalField(max_digits=15, decimal_places=2)
    purpose = models.TextField()
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)  # Desired rate
    tenure_months = models.IntegerField()
    repayment_plan = models.CharField(max_length=20, choices=[
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('bullet', 'Bullet Payment')
    ], default='monthly')
    
    business_use = models.TextField(blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=[
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('funded', 'Funded')
    ], default='draft')
    
    # Assignment
    assigned_lender = models.ForeignKey(LenderProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_applications')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.sme.business_name} - ₦{self.loan_amount:,.2f}"

class InvestmentOffer(models.Model):
    """Investment offers from lenders to SMEs"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lender = models.ForeignKey(LenderProfile, on_delete=models.CASCADE, related_name='investment_offers')
    loan_application = models.ForeignKey(LoanApplication, on_delete=models.CASCADE, related_name='investment_offers')
    
    # Offer Terms
    offered_amount = models.DecimalField(max_digits=15, decimal_places=2)
    offered_interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    offered_tenure_months = models.IntegerField()
    
    # Additional Terms
    message = models.TextField(blank=True)
    conditions = models.JSONField(default=list)  # Additional conditions
    
    # Status
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('countered', 'Countered'),
        ('withdrawn', 'Withdrawn')
    ], default='pending')
    
    # Negotiation
    parent_offer = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='counter_offers')
    is_counter_offer = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.lender.company_name} → {self.loan_application.sme.business_name} - ₦{self.offered_amount:,.2f}"

class Pitch(models.Model):
    """SME pitches to lenders"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sme = models.ForeignKey(SMEProfile, on_delete=models.CASCADE, related_name='pitches')
    lender = models.ForeignKey(LenderProfile, on_delete=models.CASCADE, related_name='received_pitches')
    loan_application = models.ForeignKey(LoanApplication, on_delete=models.CASCADE, related_name='pitches')
    
    # Pitch Content
    cover_note = models.TextField(blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=[
        ('submitted', 'Submitted'),
        ('viewed', 'Viewed'),
        ('interested', 'Interested'),
        ('rejected', 'Rejected'),
        ('offer_made', 'Offer Made')
    ], default='submitted')
    
    # Timestamps
    viewed_at = models.DateTimeField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.sme.business_name} → {self.lender.company_name}"

class NegotiationThread(models.Model):
    """Negotiation thread between SME and Lender"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    loan_application = models.OneToOneField(LoanApplication, on_delete=models.CASCADE, related_name='negotiation_thread')
    lender = models.ForeignKey(LenderProfile, on_delete=models.CASCADE, related_name='negotiation_threads')
    
    # Status
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('agreed', 'Agreed'),
        ('terminated', 'Terminated')
    ], default='active')
    
    # Final Terms (when agreed)
    final_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    final_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    final_tenure_months = models.IntegerField(null=True, blank=True)
    
    agreed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Negotiation: {self.loan_application.sme.business_name} ↔ {self.lender.company_name}"

class AIInsight(models.Model):
    """AI-generated insights for SMEs"""
    sme = models.ForeignKey(SMEProfile, on_delete=models.CASCADE, related_name='ai_insights')
    
    insight_type = models.CharField(max_length=50, choices=[
        ('positive', 'Positive'),
        ('warning', 'Warning'),
        ('recommendation', 'Recommendation'),
        ('opportunity', 'Opportunity')
    ])
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Metadata
    data_source = models.CharField(max_length=100)  # e.g., 'bank_data', 'video_analysis'
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.sme.business_name} - {self.title}"