from django.apps import AppConfig

class LenderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lender'
    verbose_name = 'Lender Management'
    
    def ready(self):
        import lender.signals