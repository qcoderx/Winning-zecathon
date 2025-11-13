from django.urls import path, include
# Use DefaultRouter and NestedDefaultRouter
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .views import (
    LoanApplicationViewSet, EscrowAccountViewSet,
    TransactionViewSet, RepaymentScheduleViewSet, LenderEscrowViewSet,
    LoanNegotiationViewSet # <-- IMPORT NEW VIEWSET
)

# Main router
router = DefaultRouter()
router.register(r'loan-applications', LoanApplicationViewSet, basename='loan-application')
router.register(r'escrow-accounts', EscrowAccountViewSet, basename='escrow-account')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'repayment-schedules', RepaymentScheduleViewSet, basename='repayment-schedule')
router.register(r'lender-escrow', LenderEscrowViewSet, basename='lender-escrow')

# Nested router for Negotiations
# This will create URLs like:
# /api/escrow/loan-applications/<loan_application_pk>/negotiations/
# /api/escrow/loan-applications/<loan_application_pk>/negotiations/<pk>/sme-accept/
negotiations_router = NestedDefaultRouter(
    router, 
    r'loan-applications', 
    lookup='loan_application'
)
negotiations_router.register(
    r'negotiations', 
    LoanNegotiationViewSet, 
    basename='loan-negotiation'
)

urlpatterns = [
    path('', include(router.urls)),
    path('', include(negotiations_router.urls)), # <-- ADD NESTED URLS
    # Add webhook endpoint
    path('webhook/verify-funding/', LoanApplicationViewSet.as_view({'post': 'verify_funding'}), name='verify-funding-webhook'),
]