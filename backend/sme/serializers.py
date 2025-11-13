from rest_framework import serializers
from .models import BusinessProfile, CACDocument, BusinessVideo, Score
from users.models import User

# NEW Serializer for POST /api/sme/profile
class BusinessProfileInputSerializer(serializers.ModelSerializer):
    # Mapping README fields to model fields
    businessType = serializers.CharField(source='business_category', required=False)
    yearEstablished = serializers.IntegerField(source='year_established', required=False)
    employeeCount = serializers.IntegerField(source='number_of_employees', required=False)
    monthlyRevenue = serializers.DecimalField(source='monthly_revenue', max_digits=12, decimal_places=2, required=False)
    businessAddress = serializers.CharField(source='business_address', required=False)
    businessDescription = serializers.CharField(source='business_description', required=False)
    fundingAmount = serializers.DecimalField(source='funding_amount', max_digits=12, decimal_places=2, required=False)
    fundingPurpose = serializers.CharField(source='funding_purpose', required=False)

    class Meta:
        model = BusinessProfile
        fields = [
            'businessName', 'businessType', 'industry', 'yearEstablished',
            'employeeCount', 'monthlyRevenue', 'businessAddress', 'state', 'lga',
            'businessDescription', 'targetMarket', 'competitiveAdvantage',
            'fundingAmount', 'fundingPurpose'
        ]
        # Rename fields that don't match the model
        extra_kwargs = {
            'businessName': {'source': 'business_name'},
            'targetMarket': {'source': 'target_market'},
            'competitiveAdvantage': {'source': 'competitive_advantage'},
        }


class BusinessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessProfile
        fields = [
            'business_name', 'business_category', 'industry', 
            'monthly_revenue', 'number_of_employees', 'business_description',
            'business_address'
        ]

class CACUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CACDocument
        fields = ['cac_file']

class VideoUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessVideo
        fields = ['video_file']

# UPDATED Serializer for POST /api/sme/mono/connect
class MonoConnectSerializer(serializers.Serializer):
    monoCode = serializers.CharField()
    accountId = serializers.CharField()
    bankName = serializers.CharField()
    accountName = serializers.CharField()
    accountNumber = serializers.CharField()


class SMEDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessProfile
        fields = ['business_name', 'verification_status', 'pulse_score', 'profit_score']

class VerifyCACSerializer(serializers.Serializer):
    rcNumber = serializers.CharField()

class BusinessTypeSerializer(serializers.Serializer):
    # businessType = serializers.CharField(required=False) # This is a legacy field, using hasPhysicalLocation
    hasPhysicalLocation = serializers.BooleanField(required=False)
    operatingHours = serializers.CharField(required=False, allow_blank=True)
    businessModel = serializers.CharField(required=False, allow_blank=True)

# REMOVED SMEOfferResponseSerializer as it was for a mocked view
# class SMEOfferResponseSerializer(serializers.Serializer):
#    ...