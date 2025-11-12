from rest_framework import serializers
from .models import LenderProfile, SMEInterest, SearchFilter
from sme.models import BusinessProfile
from sme.serializers import BusinessProfileSerializer
from users.serializers import UserSerializer

class LenderProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    lender_type_display = serializers.CharField(source='get_lender_type_display', read_only=True)
    
    class Meta:
        model = LenderProfile
        fields = [
            'id', 'user', 'lender_type', 'lender_type_display', 'company_name',
            'company_registration_number', 'years_in_operation', 'total_assets',
            'preferred_industries', 'min_loan_amount', 'max_loan_amount',
            'risk_appetite', 'contact_person', 'contact_email', 'contact_phone',
            'office_address', 'is_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['is_verified', 'created_at', 'updated_at']

class LenderProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LenderProfile
        fields = [
            'lender_type', 'company_name', 'company_registration_number',
            'years_in_operation', 'total_assets', 'preferred_industries',
            'min_loan_amount', 'max_loan_amount', 'risk_appetite',
            'contact_person', 'contact_email', 'contact_phone', 'office_address'
        ]

class VerifiedSMESerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    business_category_display = serializers.CharField(source='get_business_category_display', read_only=True)
    verification_status_display = serializers.CharField(source='get_verification_status_display', read_only=True)
    
    class Meta:
        model = BusinessProfile
        fields = [
            'id', 'user', 'business_name', 'business_category', 'business_category_display',
            'business_email', 'business_phone', 'business_address',
            'number_of_employees', 'monthly_revenue', 'annual_revenue',
            'pulse_score', 'profit_score', 'verification_status', 'verification_status_display',
            'created_at'
        ]

class SMEDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    business_category_display = serializers.CharField(source='get_business_category_display', read_only=True)
    verification_status_display = serializers.CharField(source='get_verification_status_display', read_only=True)

    class Meta:
        model = BusinessProfile
        fields = [
            'id', 'user', 'business_name', 'business_registration_number',
            'business_email', 'business_phone', 'business_address',
            'business_category', 'business_category_display', 'date_of_incorporation',
            'number_of_employees', 'monthly_revenue', 'annual_revenue',
            'business_description', 'pulse_score', 'profit_score',
            'verification_status', 'verification_status_display',
            'mono_connected', 'created_at', 'updated_at'
        ]

class SMEInterestSerializer(serializers.ModelSerializer):
    lender = LenderProfileSerializer(read_only=True)
    sme_business = VerifiedSMESerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = SMEInterest
        fields = [
            'id', 'lender', 'sme_business', 'status', 'status_display',
            'notes', 'viewed_at', 'status_updated_at'
        ]
        read_only_fields = ['viewed_at', 'status_updated_at']

class SMEInterestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMEInterest
        fields = ['sme_business', 'status', 'notes']

class SearchFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchFilter
        fields = ['id', 'name', 'filters', 'is_active', 'created_at']

class SearchFilterCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchFilter
        fields = ['name', 'filters']

class MarketplaceFilterSerializer(serializers.Serializer):
    industry = serializers.ListField(
        child=serializers.CharField(), 
        required=False,
        help_text="Filter by business categories"
    )
    min_pulse_score = serializers.IntegerField(
        min_value=0, max_value=100, required=False, default=75
    )
    min_profit_score = serializers.IntegerField(
        min_value=0, max_value=100, required=False
    )
    max_profit_score = serializers.IntegerField(
        min_value=0, max_value=100, required=False
    )
    min_employees = serializers.IntegerField(min_value=0, required=False)
    max_employees = serializers.IntegerField(min_value=0, required=False)
    min_revenue = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    location = serializers.CharField(required=False, help_text="Filter by location keyword")
    sort_by = serializers.ChoiceField(
        choices=[
            ('pulse_score', 'Pulse Score'),
            ('profit_score', 'Profit Score'),
            ('monthly_revenue', 'Monthly Revenue'),
            ('created_at', 'Registration Date'),
        ],
        default='profit_score'
    )
    sort_order = serializers.ChoiceField(
        choices=[('desc', 'Descending'), ('asc', 'Ascending')],
        default='desc'
    )