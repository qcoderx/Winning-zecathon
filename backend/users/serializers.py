from rest_framework import serializers
from .models import User
from sme.models import BusinessProfile
from lender.models import LenderProfile # Import LenderProfile

class SmeRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    # --- FIELDS ADDED TO MATCH README ---
    firstName = serializers.CharField(write_only=True, source='first_name')
    lastName = serializers.CharField(write_only=True, source='last_name')
    phoneNumber = serializers.CharField(write_only=True, source='phone_number')
    businessName = serializers.CharField(write_only=True, source='business_name')

    class Meta:
        model = User
        fields = ('email', 'password', 'firstName', 'lastName', 'phoneNumber', 'businessName')

    def create(self, validated_data):
        business_name = validated_data.pop('business_name')
        phone_number = validated_data.pop('phone_number')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=User.UserType.SME,
            first_name=first_name,
            last_name=last_name
        )
        # Create the initial business profile with all provided data
        BusinessProfile.objects.create(
            user=user, 
            business_name=business_name,
            business_phone=phone_number,
            business_email=validated_data['email'] # Pre-fill email
        )
        return user

class LenderRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    # --- FIELDS ADDED TO MATCH README ---
    firstName = serializers.CharField(write_only=True, source='first_name')
    lastName = serializers.CharField(write_only=True, source='last_name')
    phoneNumber = serializers.CharField(write_only=True, source='phone_number')
    organizationName = serializers.CharField(write_only=True, source='organization_name')
    investmentFocus = serializers.JSONField(write_only=True, source='investment_focus', required=False, default=list)


    class Meta:
        model = User
        # --- UPDATED FIELDS LIST ---
        fields = ('email', 'password', 'firstName', 'lastName', 'phoneNumber', 'organizationName', 'investmentFocus')

    def create(self, validated_data):
        # Pop all extra fields
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        phone_number = validated_data.pop('phone_number')
        organization_name = validated_data.pop('organization_name')
        investment_focus = validated_data.pop('investment_focus')

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=User.UserType.LENDER,
            first_name=first_name,
            last_name=last_name
        )
        
        # Create the initial lender profile
        # Note: The README specifies fields like organizationName, but the LenderProfile model
        # has required fields like 'lender_type', 'years_in_operation', etc.
        # This will create a basic profile; the lender must update it via POST /api/lender/profile/
        LenderProfile.objects.create(
            user=user,
            company_name=organization_name,
            contact_phone=phone_number,
            contact_email=validated_data['email'],
            preferred_industries=investment_focus,
            
            # Add dummy data for required fields not in README registration
            # These MUST be updated by the lender later
            lender_type='other', 
            years_in_operation=0,
            risk_appetite=5, 
            contact_person=f"{first_name} {last_name}",
            office_address="Pending update"
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    # --- FIXED BUG ---
    # Made user_type optional to align with README (login request only has email/pass)
    # and the view's `get('user_type')` logic.
    user_type = serializers.ChoiceField(choices=User.UserType.choices, required=False)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # --- ADDED first_name and last_name ---
        fields = ('id', 'email', 'user_type', 'first_name', 'last_name')

class RefreshTokenSerializer(serializers.Serializer):
    refreshToken = serializers.CharField()