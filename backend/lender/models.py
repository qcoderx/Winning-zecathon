from django.db import models
from django.conf import settings  # <-- CHANGED: Import settings
from django.core.validators import MinValueValidator, MaxValueValidator

# User = get_user_model() # <-- REMOVED: This line causes the error

class LenderProfile(models.Model):
    LENDER_TYPE_CHOICES = [
        ('bank', 'Bank'),
        ('microfinance', 'Microfinance Bank'),
        ('investor', 'Private Investor'),
        ('venture', 'Venture Capital'),
        ('other', 'Other'),
    ]
    
    # <-- CHANGED: Use the settings.AUTH_USER_MODEL string
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='lender_profile'
    )
    lender_type = models.CharField(max_length=50, choices=LENDER_TYPE_CHOICES)
    company_name = models.CharField(max_length=255)
    company_registration_number = models.CharField(max_length=100, blank=True)
    years_in_operation = models.IntegerField(validators=[MinValueValidator(0)])
    total_assets = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    preferred_industries = models.JSONField(default=list)  # List of industry preferences
    min_loan_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    max_loan_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    risk_appetite = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="1 (Low Risk) to 10 (High Risk)"
    )
    
    # Contact Information
    contact_person = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    office_address = models.TextField()
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verification_documents = models.JSONField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lender_profiles'
    
    def __str__(self):
        return f"{self.company_name} - {self.user.email}"

class SMEInterest(models.Model):
    INTEREST_STATUS = [
        ('viewed', 'Viewed'),
        ('interested', 'Interested'),
        ('contacted', 'Contacted'),
        ('rejected', 'Rejected'),
        ('funded', 'Funded'),
    ]
    
    lender = models.ForeignKey(LenderProfile, on_delete=models.CASCADE, related_name='interests')
    sme_business = models.ForeignKey('sme.BusinessProfile', on_delete=models.CASCADE, related_name='lender_interests')
    status = models.CharField(max_length=20, choices=INTEREST_STATUS, default='viewed')
    notes = models.TextField(blank=True)
    
    # Metadata
    viewed_at = models.DateTimeField(auto_now_add=True)
    status_updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lender_sme_interests'
        unique_together = ['lender', 'sme_business']
    
    def __str__(self):
        return f"{self.lender.company_name} - {self.sme_business.business_name}"

class SearchFilter(models.Model):
    lender = models.ForeignKey(LenderProfile, on_delete=models.CASCADE, related_name='search_filters')
    name = models.CharField(max_length=100)
    filters = models.JSONField()  # Store filter criteria
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'lender_search_filters'
    
    def __str__(self):
        return f"{self.lender.company_name} - {self.name}"