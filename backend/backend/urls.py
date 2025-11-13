from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from lender.views import AdminAnalyticsView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints matching README specification
    path('api/auth/', include('users.urls')),
    path('api/sme/', include('sme.urls')),
    path('api/lender/', include('lender.urls')),
    path('api/admin/analytics/overview', AdminAnalyticsView.as_view(), name='admin-analytics'),
    
    # Legacy endpoints (for backward compatibility)
    path('auth/', include('users.urls')),
    path('sme/', include('sme.urls')),
    path('lender/', include('lender.urls')),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)