from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LenderProfileViewSet, MarketplaceViewSet,
    SMEInterestViewSet, SearchFilterViewSet, LenderDashboardViewSet
)

router = DefaultRouter()
router.register(r'profile', LenderProfileViewSet, basename='lender-profile')
router.register(r'marketplace', MarketplaceViewSet, basename='marketplace')
router.register(r'interests', SMEInterestViewSet, basename='sme-interest')
router.register(r'search-filters', SearchFilterViewSet, basename='search-filter')
router.register(r'dashboard', LenderDashboardViewSet, basename='lender-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]