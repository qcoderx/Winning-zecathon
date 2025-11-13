from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoanApplicationViewSet, EscrowAccountViewSet,
    TransactionViewSet, RepaymentScheduleViewSet, LenderEscrowViewSet
)

router = DefaultRouter()
router.register(r'loan-applications', LoanApplicationViewSet, basename='loan-application')
router.register(r'escrow-accounts', EscrowAccountViewSet, basename='escrow-account')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'repayment-schedules', RepaymentScheduleViewSet, basename='repayment-schedule')
router.register(r'lender-escrow', LenderEscrowViewSet, basename='lender-escrow')

urlpatterns = [
    path('', include(router.urls)),
    # Add webhook endpoint
    path('webhook/verify-funding/', LoanApplicationViewSet.as_view({'post': 'verify_funding'}), name='verify-funding-webhook'),
]