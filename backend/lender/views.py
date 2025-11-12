from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import LenderProfile, SMEInterest, SearchFilter
from .serializers import (
    LenderProfileSerializer, LenderProfileCreateSerializer,
    VerifiedSMESerializer, SMEDetailSerializer,
    SMEInterestSerializer, SMEInterestCreateSerializer,
    SearchFilterSerializer, SearchFilterCreateSerializer,
    MarketplaceFilterSerializer
)
from sme.models import BusinessProfile

class LenderProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return LenderProfile.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LenderProfileCreateSerializer
        return LenderProfileSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MarketplaceViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return None
    
    def list(self, request):
        """Get filtered list of verified SMEs for marketplace"""
        # Get lender profile
        lender_profile = get_object_or_404(LenderProfile, user=request.user)
        
        # Validate filters
        filter_serializer = MarketplaceFilterSerializer(data=request.query_params)
        if not filter_serializer.is_valid():
            return Response(filter_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        filters = filter_serializer.validated_data
        
        # Base queryset - only verified SMEs with pulse_score >= 75
        queryset = BusinessProfile.objects.filter(
            verification_status='verified',
            pulse_score__gte=75
        )
        
        # Apply filters
        if filters.get('industry'):
            queryset = queryset.filter(business_category__in=filters['industry'])
        
        if filters.get('min_pulse_score'):
            queryset = queryset.filter(pulse_score__gte=filters['min_pulse_score'])
        
        if filters.get('min_profit_score'):
            queryset = queryset.filter(profit_score__gte=filters['min_profit_score'])
        
        if filters.get('max_profit_score'):
            queryset = queryset.filter(profit_score__lte=filters['max_profit_score'])
        
        if filters.get('min_employees'):
            queryset = queryset.filter(number_of_employees__gte=filters['min_employees'])
        
        if filters.get('max_employees'):
            queryset = queryset.filter(number_of_employees__lte=filters['max_employees'])
        
        if filters.get('min_revenue'):
            queryset = queryset.filter(monthly_revenue__gte=filters['min_revenue'])
        
        if filters.get('location'):
            queryset = queryset.filter(
                Q(business_address__icontains=filters['location']) |
                Q(business_name__icontains=filters['location'])
            )
        
        # Apply sorting
        sort_field = filters['sort_by']
        if filters['sort_order'] == 'desc':
            sort_field = f"-{sort_field}"
        queryset = queryset.order_by(sort_field)
        
        # Track view for analytics
        for sme in queryset:
            SMEInterest.objects.get_or_create(
                lender=lender_profile,
                sme_business=sme,
                defaults={'status': 'viewed'}
            )
        
        # Paginate results
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = VerifiedSMESerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = VerifiedSMESerializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get detailed SME profile"""
        lender_profile = get_object_or_404(LenderProfile, user=request.user)
        sme_business = get_object_or_404(
            BusinessProfile.objects.filter(verification_status='verified', pulse_score__gte=75),
            pk=pk
        )
        
        # Track interest
        interest, created = SMEInterest.objects.get_or_create(
            lender=lender_profile,
            sme_business=sme_business,
            defaults={'status': 'viewed'}
        )
        
        if not created and interest.status == 'viewed':
            interest.save()  # Update timestamp
        
        serializer = SMEDetailSerializer(sme_business)
        return Response(serializer.data)

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
        """Update interest status"""
        interest = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(SMEInterest.INTEREST_STATUS):
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
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

class LenderDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get lender dashboard statistics"""
        lender_profile = get_object_or_404(LenderProfile, user=request.user)
        
        # Count verified SMEs
        total_verified_smes = BusinessProfile.objects.filter(
            verification_status='verified',
            pulse_score__gte=75
        ).count()
        
        # Count SME interests by status
        interests = SMEInterest.objects.filter(lender=lender_profile)
        viewed_count = interests.filter(status='viewed').count()
        interested_count = interests.filter(status='interested').count()
        contacted_count = interests.filter(status='contacted').count()
        funded_count = interests.filter(status='funded').count()
        
        # Recent activity
        recent_interests = interests.order_by('-status_updated_at')[:5]
        recent_interests_data = SMEInterestSerializer(recent_interests, many=True).data
        
        return Response({
            'total_verified_smes': total_verified_smes,
            'my_interests': {
                'viewed': viewed_count,
                'interested': interested_count,
                'contacted': contacted_count,
                'funded': funded_count,
                'total': interests.count()
            },
            'recent_activity': recent_interests_data
        })