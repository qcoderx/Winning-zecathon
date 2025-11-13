from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
# --- UPDATED IMPORTS ---
from .serializers import SmeRegisterSerializer, LenderRegisterSerializer, UserLoginSerializer, UserSerializer, RefreshTokenSerializer
from .models import User

class SmeRegisterView(generics.CreateAPIView):
    """POST /auth/sme/register"""
    queryset = User.objects.all()
    serializer_class = SmeRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "success": True,
                "message": "SME registered successfully",
                "data": {
                    "userId": str(user.id),
                    "email": user.email,
                    "userType": "sme",
                    "token": str(refresh.access_token),
                    "refreshToken": str(refresh)
                }
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Registration failed",
            "error": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LenderRegisterView(generics.CreateAPIView):
    """POST /auth/lender/register"""
    queryset = User.objects.all()
    serializer_class = LenderRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "success": True,
                "message": "Lender registered successfully",
                "data": {
                    "userId": str(user.id),
                    "email": user.email,
                    "userType": "lender",
                    "token": str(refresh.access_token),
                    "refreshToken": str(refresh)
                }
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Registration failed",
            "error": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """POST /auth/login"""
    # --- ADDED THIS LINE ---
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Invalid input",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user_type = serializer.validated_data.get('user_type')

        user = authenticate(request, email=email, password=password)

        if user is not None and (not user_type or user.user_type == user_type):
            refresh = RefreshToken.for_user(user)
            
            # Get profile data
            profile_data = {}
            if user.user_type == 'sme':
                try:
                    from sme.models import BusinessProfile
                    profile = BusinessProfile.objects.get(user=user)
                    profile_data = {
                        "businessName": profile.business_name,
                        "verificationStatus": profile.verification_status,
                        "pulseScore": profile.pulse_score,
                        "profitScore": profile.profit_score
                    }
                except:
                    profile_data = {
                        "businessName": None,
                        "verificationStatus": "pending",
                        "pulseScore": None,
                        "profitScore": None
                    }
            
            return Response({
                "success": True,
                "message": "Login successful",
                "data": {
                    "userId": str(user.id),
                    "email": user.email,
                    "userType": user.user_type,
                    "token": str(refresh.access_token),
                    "refreshToken": str(refresh),
                    "profile": profile_data
                }
            }, status=status.HTTP_200_OK)
        
        return Response({
            "success": False,
            "message": "Invalid credentials or user type"
        }, status=status.HTTP_401_UNAUTHORIZED)

class RefreshTokenView(APIView):
    """POST /auth/refresh"""
    # --- ADDED THIS LINE ---
    serializer_class = RefreshTokenSerializer

    def post(self, request):
        refresh_token = request.data.get('refreshToken')
        if not refresh_token:
            return Response({
                "success": False,
                "message": "Refresh token required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            refresh = RefreshToken(refresh_token)
            return Response({
                "success": True,
                "data": {
                    "token": str(refresh.access_token),
                    "refreshToken": str(refresh)
                }
            })
        except Exception as e:
            return Response({
                "success": False,
                "message": "Invalid refresh token"
            }, status=status.HTTP_401_UNAUTHORIZED)