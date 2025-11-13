from django.urls import path
from .views import (
    BusinessProfileView, 
    CACUploadView, 
    VideoUploadView, 
    MonoConnectView,
    SMEDashboardView,
    VerifyCACView,
    BusinessTypeView,
    # SMEOffersView,           # REMOVED
    # SMEOfferResponseView   # REMOVED
)

urlpatterns = [
    path('profile', BusinessProfileView.as_view(), name='sme-profile'),
    path('upload/cac', CACUploadView.as_view(), name='sme-upload-cac'),
    path('upload/video', VideoUploadView.as_view(), name='sme-upload-video'),
    path('verify-cac', VerifyCACView.as_view(), name='sme-verify-cac'),
    path('business-type', BusinessTypeView.as_view(), name='sme-business-type'),
    path('mono/connect', MonoConnectView.as_view(), name='sme-mono-connect'),
    path('dashboard', SMEDashboardView.as_view(), name='sme-dashboard'),
    
    # REMOVED MOCKED OFFER ENDPOINTS
    # path('offers', SMEOffersView.as_view(), name='sme-offers'),
    # path('offers/<str:offerId>/respond', SMEOfferResponseView.as_view(), name='sme-offer-respond'),
]