from django.urls import path
from .views import SmeRegisterView, LenderRegisterView, LoginView, RefreshTokenView

urlpatterns = [
    path('register/sme', SmeRegisterView.as_view(), name='sme-register'),
    path('register/lender', LenderRegisterView.as_view(), name='lender-register'),
    path('login', LoginView.as_view(), name='login'),
    path('refresh', RefreshTokenView.as_view(), name='refresh-token'),
]