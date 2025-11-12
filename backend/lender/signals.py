from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import LenderProfile

User = get_user_model()

@receiver(post_save, sender=LenderProfile)
def log_lender_profile_creation(sender, instance, created, **kwargs):
    """
    Signal to handle lender profile creation
    """
    if created:
        # You can add any post-creation logic here
        # For example, send welcome email to lender
        pass