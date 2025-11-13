from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Q, Sum, Avg, Count
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from .models import LenderProfile, SMEInterest, SearchFilter
# --- UPDATED IMPORTS ---
from .serializers import (
    LenderProfileSerializer, LenderProfileCreateSerializer,
    VerifiedSMESerializer, SMEDetailSerializer,
    SMEInterestSerializer, SMEInterestCreateSerializer,
    SearchFilterSerializer, SearchFilterCreateSerializer,
    MarketplaceFilterSerializer
)
from sme.models import BusinessProfile
from escrow.models import LoanApplication, LoanNegotiation # Import real models
from users.models import User # Import User for admin stats
from rest_framework import serializers 

class LenderProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LenderProfile.objects.filter(user=self.request.user).order_by('created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LenderProfileCreateSerializer
        return LenderProfileSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MarketplaceViewSet(viewsets.GenericViewSet):
    """GET /lender/marketplace - Get list of verified SMEs for lenders"""
    permission_classes = [IsAuthenticated]
    serializer_class = VerifiedSMESerializer

    def get_queryset(self):
        # Base queryset: verified SMEs with a decent pulse score
        return BusinessProfile.objects.filter(
            verification_status='verified',
            pulse_score__gte=75 # As specified in original logic
        )
    
    def list(self, request):
        try:
            lender_profile = LenderProfile.objects.get(user=request.user)
        except LenderProfile.DoesNotExist:
            return Response({
                "success": False,
                "message": "Lender profile not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get verified SMEs
        queryset = self.get_queryset().order_by('-pulse_score', '-profit_score')
        
        # TODO: Implement full filtering based on MarketplaceFilterSerializer
        industry = request.query_params.get('industry')
        if industry:
            queryset = queryset.filter(business_category=industry)
        
        min_pulse_score = request.query_params.get('minPulseScore')
        if min_pulse_score:
            queryset = queryset.filter(pulse_score__gte=int(min_pulse_score))
        
        min_profit_score = request.query_params.get('minProfitScore')
        if min_profit_score:
            queryset = queryset.filter(profit_score__gte=int(min_profit_score))
        
        # Track views
        for sme in queryset:
            SMEInterest.objects.get_or_create(
                lender=lender_profile,
                sme_business=sme,
                defaults={'status': 'viewed'}
            )
        
        # --- REMOVED MOCKED RESPONSE ---
        # Paginate the queryset
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "data": {
                "smes": serializer.data,
                "pagination": None # Add pagination class to REST_FRAMEWORK settings for this
            }
        })
    
    def retrieve(self, request, pk=None):
        """GET /lender/marketplace/:smeId - Get detailed SME profile"""
        try:
            lender_profile = LenderProfile.objects.get(user=request.user)
        except LenderProfile.DoesNotExist:
            return Response({
                "success": False,
                "message": "Lender profile not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            sme_business = BusinessProfile.objects.get(
                id=pk, 
                verification_status='verified', 
                pulse_score__gte=75
            )
        except BusinessProfile.DoesNotExist:
            return Response({
                "success": False,
                "message": "SME not found or not verified"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Track interest
        SMEInterest.objects.get_or_create(
            lender=lender_profile,
            sme_business=sme_business,
            defaults={'status': 'viewed'}
        )
        
        # --- MOCKED DATA REMOVED ---
        # Get real marketplace metrics
        offers = LoanNegotiation.objects.filter(loan_application__sme_business=sme_business)
        active_offers_count = offers.filter(status='pending').count()
        lender_interest_count = SMEInterest.objects.filter(sme_business=sme_business).count()
        avg_offer = offers.aggregate(avg=Avg('proposed_rate'))['avg'] # Just an example

        return Response({
            "success": True,
            "data": {
                "basicInfo": {
                    "id": str(sme_business.id),
                    "businessName": sme_business.business_name,
                    "industry": sme_business.industry,
                    "businessType": sme_business.business_category,
                    "yearEstablished": sme_business.year_established,
                    "employeeCount": sme_business.number_of_employees,
                    "location": sme_business.business_address,
                    "businessDescription": sme_business.business_description,
                    "targetMarket": sme_business.target_market,
                    "competitiveAdvantage": sme_business.competitive_advantage
                },
                "scores": {
                    "pulseScore": sme_business.pulse_score,
                    "profitScore": sme_business.profit_score,
                    "riskLevel": "low" if sme_business.pulse_score > 80 else "medium", # Simple logic
                    "verificationStatus": sme_business.verification_status
                },
                "financialHighlights": { 
                    "monthlyRevenue": sme_business.monthly_revenue,
                    "profitMargin": None, # Cannot calculate without expenses
                    "growthRate": None, # Requires time-series data
                    "cashFlowStatus": None, # Requires full analysis
                    "debtToIncomeRatio": None # Requires debt data
                },
                "fundingRequest": { 
                    "amount": sme_business.funding_amount,
                    "purpose": sme_business.funding_purpose,
                    "expectedROI": None, # Not modeled
                    "paybackPeriod": None, # Not modeled
                    "collateral": None # Not modeled
                },
                "verification": {
                    "cacVerified": CACDocument.objects.filter(user=sme_business.user).exists(),
                    "videoVerified": BusinessVideo.objects.filter(user=sme_business.user).exists(),
                    "bankConnected": sme_business.mono_connected,
                    "documentsComplete": True, # Simplified
                    "lastVerified": sme_business.updated_at.isoformat()
                },
                "marketMetrics": { 
                    "profileViews": 0, # Requires tracking model
                    "lenderInterest": lender_interest_count,
                    "activeOffers": active_offers_count,
                    "averageOfferAmount": avg_offer or 0
                }
            }
        })

class SMEInterestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        lender_profile = get_object_or_404(LenderProfile, user=self.request.user)
        return SMEInterest.objects.filter(lender=lender_profile)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return SMEInterestCreateSerializer
        return SMEInterestSerializer
    
    def perform_create(self, serializer):
        lender_profile = get_object_or_404(LenderProfile, user=self.request.user)
        serializer.save(lender=lender_profile)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        interest = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(SMEInterest.INTEREST_STATUS):
            return Response({
                "error": "Invalid status"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        interest.status = new_status
        interest.save()
        
        serializer = SMEInterestSerializer(interest)
        return Response(serializer.data)

class SearchFilterViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        lender_profile = get_object_or_404(LenderProfile, user=self.request.user)
        return SearchFilter.objects.filter(lender=lender_profile)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return SearchFilterCreateSerializer
        return SearchFilterSerializer
    
    def perform_create(self, serializer):
        lender_profile = get_object_or_404(LenderProfile, user=self.request.user)
        serializer.save(lender=lender_profile)

class LenderDashboardView(APIView):
    """GET /lender/dashboard - Get lender dashboard data"""
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.Serializer # Dummy

    def get(self, request):
        try:
            lender_profile = LenderProfile.objects.get(user=request.user)
        except LenderProfile.DoesNotExist:
            return Response({
                "success": False,
                "message": "Lender profile not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # --- MOCKED DATA REMOVED ---
        
        # Real Portfolio Stats
        funded_loans = LoanApplication.objects.filter(lender=lender_profile, status__in=['active', 'completed'])
        active_loans = LoanApplication.objects.filter(lender=lender_profile, status='active')
        
        portfolio_stats = funded_loans.aggregate(
            totalInvestments=Count('id'),
            totalAmount=Sum('loan_amount'),
            averageROI=Avg('negotiated_rate') # Use negotiated_rate
        )
        
        # Real Marketplace Stats
        marketplace_stats = BusinessProfile.objects.filter(
            verification_status='verified', 
            pulse_score__gte=75
        ).aggregate(
            totalVerifiedSMEs=Count('id'),
            averagePulseScore=Avg('pulse_score'),
            averageProfitScore=Avg('profit_score')
        )
        new_smes_this_week = BusinessProfile.objects.filter(
            verification_status='verified',
            created_at__gte=datetime.now() - timedelta(days=7)
        ).count()

        
        return Response({
            "success": True,
            "data": {
                "user": {
                    "firstName": request.user.email.split('@')[0],
                    "lastName": "User",
                    "organizationName": lender_profile.company_name,
                    "email": request.user.email
                },
                "portfolio": {
                    "totalInvestments": portfolio_stats['totalInvestments'] or 0,
                    "totalAmount": portfolio_stats['totalAmount'] or 0,
                    "activeInvestments": active_loans.count(),
                    "averageROI": portfolio_stats['averageROI'] or 0,
                    "defaultRate": 0 # Needs real default tracking logic
                },
                "marketplaceStats": {
                    "totalVerifiedSMEs": marketplace_stats['totalVerifiedSMEs'] or 0,
                    "newSMEsThisWeek": new_smes_this_week,
                    "averagePulseScore": marketplace_stats['averagePulseScore'] or 0,
                    "averageProfitScore": marketplace_stats['averageProfitScore'] or 0
                },
                "recentActivity": [], # Removed mock
                "recommendations": [] # Removed mock
            }
        })

# --- MOCKED VIEW REMOVED ---
# class LenderOffersView(APIView): ...


class AdminAnalyticsView(APIView):
    """GET /admin/analytics/overview - Get platform analytics (Admin only)"""
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.Serializer # Dummy
    
    def get(self, request):
        if not request.user.is_staff:
            return Response({
                "success": False,
                "message": "Admin access required"
            }, status=status.HTTP_403_FORBIDDEN)
        
        # --- MOCKED DATA REMOVED ---
        
        # Real User Stats
        total_smes = User.objects.filter(user_type='sme').count()
        total_lenders = User.objects.filter(user_type='lender').count()
        verified_smes = BusinessProfile.objects.filter(verification_status='verified').count()
        
        # Real Verification Stats
        verification_stats = BusinessProfile.objects.aggregate(
            averagePulseScore=Avg('pulse_score'),
            averageProfitScore=Avg('profit_score'),
        )
        total_verified = BusinessProfile.objects.filter(verification_status='verified').count()
        total_processed = BusinessProfile.objects.filter(verification_status__in=['verified', 'rejected']).count()
        success_rate = (total_verified / total_processed * 100) if total_processed > 0 else 0
        
        # Real Marketplace Stats
        marketplace_stats = LoanApplication.objects.aggregate(
            successfulMatches=Count('id', filter=Q(status__in=['active', 'completed'])),
            totalFundingAmount=Sum('loan_amount', filter=Q(status__in=['active', 'completed']))
        )
        total_offers = LoanNegotiation.objects.count()
        
        return Response({
            "success": True,
            "data": {
                "userStats": { 
                    "totalSMEs": total_smes,
                    "totalLenders": total_lenders,
                    "verifiedSMEs": verified_smes,
                    "activeLenders": total_lenders # Simplified
                },
                "verificationStats": {
                    "averagePulseScore": verification_stats['averagePulseScore'] or 0,
                    "averageProfitScore": verification_stats['averageProfitScore'] or 0,
                    "verificationSuccessRate": success_rate,
                    "processingTime": None # Cannot be calculated from model
                },
                "marketplaceStats": { 
                    "totalOffers": total_offers,
                    "successfulMatches": marketplace_stats['successfulMatches'] or 0,
                    "totalFundingAmount": marketplace_stats['totalFundingAmount'] or 0,
                    "averageOfferAmount": 0 # Requires more logic
                },
                "monthlyGrowth": { # Cannot be calculated without time-series
                    "newSMEs": 0,
                    "newLenders": 0,
                    "completedDeals": 0,
                    "platformRevenue": 0
                }
            }
        })