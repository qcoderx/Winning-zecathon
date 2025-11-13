from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class UserType(models.TextChoices):
        SME = 'sme', 'SME'
        LENDER = 'lender', 'Lender'
    
    user_type = models.CharField(max_length=10, choices=UserType.choices)
    phone_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)