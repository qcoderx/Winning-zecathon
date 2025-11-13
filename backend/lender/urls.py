from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LenderProfileViewSet, MarketplaceViewSet,
    SMEInterestViewSet, SearchFilterViewSet, 
    LenderDashboardView, AdminAnalyticsView
    # LenderOffersView, # REMOVED
)

router = DefaultRouter()
router.register(r'profile', LenderProfileViewSet, basename='lender-profile')
router.register(r'marketplace', MarketplaceViewSet, basename='marketplace')
router.register(r'interests', SMEInterestViewSet, basename='sme-interest')
router.register(r'search-filters', SearchFilterViewSet, basename='search-filter')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', LenderDashboardView.as_view(), name='lender-dashboard'),
    # path('offers/', LenderOffersView.as_view(), name='lender-offers'), # REMOVED
]