from django.db import models
from django.conf import settings

class BusinessProfile(models.Model):
    """
    Stores the "Stated Truth"
    """
    BUSINESS_CATEGORIES = [
        ('software', 'Software Development'),
        ('ecommerce', 'E-commerce'),
        ('consulting', 'Consulting'),
        ('manufacturing', 'Manufacturing'),
        ('retail', 'Retail'),
        ('healthcare', 'Healthcare'),
        ('education', 'Education'),
        ('finance', 'Finance'),
        ('other', 'Other'),
    ]

    VERIFICATION_STATUS = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    business_name = models.CharField(max_length=255)
    
    # --- FIELDS ADDED TO MATCH README ---
    business_category = models.CharField(max_length=50, choices=BUSINESS_CATEGORIES, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    year_established = models.IntegerField(null=True, blank=True)
    number_of_employees = models.IntegerField(null=True, blank=True)
    monthly_revenue = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    business_address = models.TextField(blank=True)
    state = models.CharField(max_length=100, blank=True)
    lga = models.CharField(max_length=100, blank=True)
    business_description = models.TextField(blank=True)
    target_market = models.CharField(max_length=255, blank=True)
    competitive_advantage = models.TextField(blank=True)
    
    funding_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    funding_purpose = models.TextField(blank=True)
    
    # From CAC step
    rc_number = models.CharField(max_length=100, blank=True) 
    
    # From business-type step
    has_physical_location = models.BooleanField(null=True, blank=True)
    operating_hours = models.CharField(max_length=100, blank=True)
    business_model = models.CharField(max_length=100, blank=True)
    
    # --- EXISTING FIELDS ---
    business_registration_number = models.CharField(max_length=100, blank=True) # Note: README uses rcNumber, model had this. Using rc_number now.
    business_email = models.EmailField(blank=True)
    business_phone = models.CharField(max_length=20, blank=True)
    date_of_incorporation = models.DateField(null=True, blank=True)
    annual_revenue = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True) # README uses monthly
    
    pulse_score = models.IntegerField(default=0)
    profit_score = models.IntegerField(default=0)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='pending')
    mono_connected = models.BooleanField(default=False)
    
    # Legacy fields from original model
    location = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    founded_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Bank account fields for disbursement
    bank_account_number = models.CharField(max_length=20, blank=True)
    bank_account_name = models.CharField(max_length=255, blank=True)
    bank_name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.business_name

class CACDocument(models.Model):
    """
    Stores the "Document Truth"
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cac_document')
    cac_file = models.FileField(upload_to='cac_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    extracted_name = models.CharField(max_length=255, blank=True, null=True) # To be filled by AI

    def __str__(self):
        return f"CAC for {self.user.email}"

class BusinessVideo(models.Model):
    """
    Stores the "Visual Truth"
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='business_video')
    video_file = models.FileField(upload_to='videos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    video_summary = models.TextField(blank=True, null=True) # To be filled by AI

    def __str__(self):
        return f"Video for {self.user.email}"

class Score(models.Model):
    """
    Stores the Pulse and Profit Scores
    """
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        VERIFIED = 'verified', 'Verified'
        FAILED = 'failed', 'Failed'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='score')
    pulse_score = models.IntegerField(default=0)
    profit_score = models.IntegerField(default=0)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    pulse_fail_reason = models.TextField(blank=True, null=True) # To explain failure
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Scores for {self.user.email}: Pulse({self.pulse_score}), Profit({self.profit_score})"