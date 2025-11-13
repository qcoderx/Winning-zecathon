from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
import requests
from django.conf import settings
from datetime import datetime
# --- UPDATED IMPORTS ---
from .models import BusinessProfile, CACDocument, BusinessVideo
from .serializers import (
    BusinessProfileSerializer,
    BusinessProfileInputSerializer, # Added
    CACUploadSerializer,
    VideoUploadSerializer,
    MonoConnectSerializer,
    SMEDashboardSerializer,
    VerifyCACSerializer,
    BusinessTypeSerializer,
    # SMEOfferResponseSerializer # Removed
)
from rest_framework import serializers

class BusinessProfileView(APIView):
    """
    POST /sme/profile - Submit business information
    GET /sme/profile - Get complete SME profile
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BusinessProfileInputSerializer
        return BusinessProfileSerializer # Default for GET (though GET doesn't use it)

    def post(self, request):
        profile, created = BusinessProfile.objects.get_or_create(user=request.user)
        
        # Use the new input serializer to validate and update the profile
        serializer = BusinessProfileInputSerializer(
            instance=profile, 
            data=request.data, 
            partial=True # Allow partial updates
        )
        
        if serializer.is_valid():
            profile = serializer.save(user=request.user)
            
            return Response({
                "success": True,
                "message": "Business profile saved successfully",
                "data": {
                    "profileId": str(profile.id),
                    "status": "profile_completed",
                    "nextStep": "cac_upload"
                }
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
            
        # --- FIXED ---
        # Changed 'except Exception as e:' to 'else:'
        # This block handles the case where serializer.is_valid() is False
        else:
            return Response({
                "success": False,
                "message": "Profile creation/update failed",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """GET /sme/profile - Get complete SME profile"""
        try:
            profile = BusinessProfile.objects.get(user=request.user)
            has_cac = CACDocument.objects.filter(user=request.user).exists()
            has_video = BusinessVideo.objects.filter(user=request.user).exists()
            
            # --- REMOVED MOCKED FINANCIAL DATA ---
            # Real data is fetched from the profile model
            
            return Response({
                "success": True,
                "data": {
                    "businessInfo": {
                        "businessName": profile.business_name,
                        "businessType": profile.business_category,
                        "industry": profile.industry,
                        "yearEstablished": profile.year_established,
                        "employeeCount": profile.number_of_employees,
                        "monthlyRevenue": profile.monthly_revenue,
                        "businessAddress": profile.business_address,
                        "state": profile.state,
                        "lga": profile.lga,
                        "businessDescription": profile.business_description
                    },
                    "verification": {
                        "pulseScore": profile.pulse_score,
                        "profitScore": profile.profit_score,
                        "verificationStatus": profile.verification_status,
                        "cacVerified": has_cac,
                        "videoVerified": has_video,
                        "bankConnected": profile.mono_connected
                    },
                    # --- REMOVED MOCKED FINANCIAL DATA ---
                    # This data is already in 'businessInfo'
                    "financialData": {
                        "monthlyRevenue": profile.monthly_revenue,
                        "monthlyExpenses": None, # Cannot be known without real analysis
                        "profitMargin": None,
                        "cashFlow": None,
                        "growthRate": None
                    },
                    "documents": {
                        "cacCertificate": {
                            "fileName": "cac_certificate.pdf" if has_cac else None, # Simplified
                            "verified": has_cac
                        },
                        "businessVideo": {
                            "fileName": "business_video.mp4" if has_video else None, # Simplified
                            "verified": has_video
                        }
                    }
                }
            })
        except BusinessProfile.DoesNotExist:
            return Response({
                "success": False,
                "message": "Profile not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
    def get(self, request):
        """GET /sme/profile - Get complete SME profile"""
        try:
            profile = BusinessProfile.objects.get(user=request.user)
            has_cac = CACDocument.objects.filter(user=request.user).exists()
            has_video = BusinessVideo.objects.filter(user=request.user).exists()
            
            # --- REMOVED MOCKED FINANCIAL DATA ---
            # Real data is fetched from the profile model
            
            return Response({
                "success": True,
                "data": {
                    "businessInfo": {
                        "businessName": profile.business_name,
                        "businessType": profile.business_category,
                        "industry": profile.industry,
                        "yearEstablished": profile.year_established,
                        "employeeCount": profile.number_of_employees,
                        "monthlyRevenue": profile.monthly_revenue,
                        "businessAddress": profile.business_address,
                        "state": profile.state,
                        "lga": profile.lga,
                        "businessDescription": profile.business_description
                    },
                    "verification": {
                        "pulseScore": profile.pulse_score,
                        "profitScore": profile.profit_score,
                        "verificationStatus": profile.verification_status,
                        "cacVerified": has_cac,
                        "videoVerified": has_video,
                        "bankConnected": profile.mono_connected
                    },
                    # --- REMOVED MOCKED FINANCIAL DATA ---
                    # This data is already in 'businessInfo'
                    "financialData": {
                        "monthlyRevenue": profile.monthly_revenue,
                        "monthlyExpenses": None, # Cannot be known without real analysis
                        "profitMargin": None,
                        "cashFlow": None,
                        "growthRate": None
                    },
                    "documents": {
                        "cacCertificate": {
                            "fileName": "cac_certificate.pdf" if has_cac else None, # Simplified
                            "verified": has_cac
                        },
                        "businessVideo": {
                            "fileName": "business_video.mp4" if has_video else None, # Simplified
                            "verified": has_video
                        }
                    }
                }
            })
        except BusinessProfile.DoesNotExist:
            return Response({
                "success": False,
                "message": "Profile not found"
            }, status=status.HTTP_404_NOT_FOUND)

class CACUploadView(APIView):
    """POST /sme/upload/cac - Upload CAC certificate"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = CACUploadSerializer

    def post(self, request):
        # The serializer_class will handle this, but explicit check is good
        if 'file' not in request.FILES:
            return Response({
                "success": False,
                "message": "No CAC file provided (expected 'file' field)"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cac_file = request.FILES['file']
        
        try:
            cac_doc, created = CACDocument.objects.get_or_create(
                user=request.user,
                defaults={'cac_file': cac_file}
            )
            
            if not created:
                cac_doc.cac_file = cac_file
                cac_doc.save()
            
            return Response({
                "success": True,
                "message": "CAC certificate uploaded successfully",
                "data": {
                    "fileId": str(cac_doc.id),
                    "fileName": cac_file.name,
                    "fileSize": cac_file.size,
                    "uploadedAt": datetime.now().isoformat(),
                    "status": "uploaded",
                    "nextStep": "business_type_check"
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                "success": False,
                "message": f"CAC upload failed: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

class VerifyCACView(APIView):
    """POST /sme/verify-cac - Verify RC number with CAC database"""
    permission_classes = [IsAuthenticated]
    serializer_class = VerifyCACSerializer

    def post(self, request):
        serializer = VerifyCACSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rc_number = serializer.validated_data['rcNumber']
        
        # --- MOCK LOGIC REMOVED ---
        
        # Save the RC number to the profile
        try:
            profile = BusinessProfile.objects.get(user=request.user)
            profile.rc_number = rc_number
            profile.save()
        except BusinessProfile.DoesNotExist:
             return Response({
                "success": False,
                "message": "Business profile not found. Please create a profile first."
            }, status=status.HTTP_404_NOT_FOUND)

        # TODO: Implement actual CAC verification API call here
        # 1. Call external CAC verification service with rc_number
        # 2. Get response (e.g., real_name, real_address, real_status)
        # 3. Save details to profile:
        #    profile.business_name = real_name 
        #    profile.business_address = real_address
        #    profile.date_of_incorporation = real_date
        #    profile.save()
        # 4. Return the real data
        
        # Return 501 Not Implemented to indicate mock is removed and real logic is pending
        return Response({
            "success": False,
            "message": "RC Number saved. Real-time CAC verification is not yet implemented.",
            "data": {
                "rcNumber": rc_number,
                "status": "pending_verification"
            }
        }, status=status.HTTP_501_NOT_IMPLEMENTED)


class BusinessTypeView(APIView):
    """POST /sme/business-type - Submit business type verification"""
    permission_classes = [IsAuthenticated]
    serializer_class = BusinessTypeSerializer

    def post(self, request):
        # --- MOCK LOGIC REMOVED ---
        
        serializer = BusinessTypeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            profile = BusinessProfile.objects.get(user=request.user)
            
            # Update profile with validated data
            profile.has_physical_location = serializer.validated_data.get('hasPhysicalLocation', profile.has_physical_location)
            profile.operating_hours = serializer.validated_data.get('operatingHours', profile.operating_hours)
            profile.business_model = serializer.validated_data.get('businessModel', profile.business_model)
            profile.save()
            
            return Response({
                "success": True,
                "message": "Business type information saved",
                "data": {
                    "status": "business_type_completed",
                    "nextStep": "video_recording"
                }
            }, status=status.HTTP_201_CREATED)
            
        except BusinessProfile.DoesNotExist:
            return Response({
                "success": False,
                "message": "Business profile not found. Please create a profile first."
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"Failed to save business type: {str(e)}",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


class VideoUploadView(APIView):
    """POST /sme/upload/video - Upload business video"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = VideoUploadSerializer

    def post(self, request):
        if 'video' not in request.FILES:
            return Response({
                "success": False,
                "message": "No video file provided (expected 'video' field)"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        video_file = request.FILES['video']
        
        try:
            video_doc, created = BusinessVideo.objects.get_or_create(
                user=request.user,
                defaults={'video_file': video_file}
            )
            
            if not created:
                video_doc.video_file = video_file
                video_doc.save()
            
            return Response({
                "success": True,
                "message": "Video uploaded successfully",
                "data": {
                    "videoId": str(video_doc.id),
                    "fileName": video_file.name,
                    "fileSize": video_file.size,
                    "duration": request.data.get('duration', 0), # Get duration from request
                    "uploadedAt": datetime.now().isoformat(),
                    "status": "uploaded",
                    "nextStep": "bank_connection"
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                "success": False,
                "message": f"Video upload failed: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

class MonoConnectView(APIView):
    """POST /sme/mono/connect - Connect bank account via Mono"""
    permission_classes = [IsAuthenticated]
    serializer_class = MonoConnectSerializer

    def post(self, request):
        # --- FIXED BUG & REMOVED MOCK ---
        # Now uses the serializer correctly
        serializer = MonoConnectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        mono_code = data['monoCode']
        account_name = data['accountName']
        account_id = data['accountId'] # From README
        
        try:
            # --- REAL LOGIC ---
            # TODO: Exchange mono_code for a permanent token with Mono API
            # For this implementation, we trust the data sent from the frontend
            # as specified in the README.
            
            # Update user profile with bank connection and details
            profile = BusinessProfile.objects.get(user=request.user)
            profile.mono_connected = True
            profile.bank_account_name = account_name
            profile.bank_account_number = data['accountNumber']
            profile.bank_name = data['bankName']
            
            # Trigger AI verification (This part is real)
            from core.services import PulseEngine, ProfitEngine
            
            # Run Pulse Engine (Authenticity)
            pulse_engine = PulseEngine(request.user, account_name)
            pulse_score, fail_reason = pulse_engine.run_verification()
            
            # Run Profit Engine (Financial Health)
            # TODO: Implement a real Mono call to get account ID if not provided
            profit_engine = ProfitEngine(request.user, mono_account_id=account_id)
            profit_score, profit_analysis = profit_engine.analyze_financial_health()

            # Save scores
            profile.pulse_score = pulse_score
            profile.profit_score = profit_score
            
            if fail_reason:
                profile.verification_status = 'rejected' # Use 'rejected' not 'failed'
            else:
                profile.verification_status = 'verified'
            profile.save()
            
            return Response({
                "success": True,
                "message": "Bank account connected and verification processed.",
                "data": {
                    "connectionId": f"mono_conn_{request.user.id}",
                    "accountId": account_id,
                    "bankName": data['bankName'],
                    "accountName": account_name,
                    "connectedAt": datetime.now().isoformat(),
                    "status": "connected",
                    "nextStep": "processing_complete", # Changed from "processing"
                    "pulseScore": pulse_score,
                    "profitScore": profit_score,
                    "verificationStatus": profile.verification_status
                }
            }, status=status.HTTP_201_CREATED)
                
        except BusinessProfile.DoesNotExist:
            return Response({
                "success": False,
                "message": "Business profile not found. Please create a profile first."
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"Mono connection failed: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

class SMEDashboardView(APIView):
    """GET /sme/dashboard - Get SME dashboard data"""
    permission_classes = [IsAuthenticated]
    serializer_class = SMEDashboardSerializer

    def get(self, request):
        try:
            profile = BusinessProfile.objects.get(user=request.user)
            has_cac = CACDocument.objects.filter(user=request.user).exists()
            has_video = BusinessVideo.objects.filter(user=request.user).exists()
            
            # --- MOCKED DATA REMOVED ---
            
            # Get real marketplace stats
            # Note: This requires the 'escrow' app models
            try:
                from escrow.models import LoanNegotiation
                offers = LoanNegotiation.objects.filter(loan_application__sme_business=profile)
                active_offers_count = offers.filter(status='pending').count()
                # A simple proxy for "interest"
                lender_interest_count = offers.values('user').distinct().count()
            except ImportError:
                active_offers_count = 0
                lender_interest_count = 0

            
            return Response({
                "success": True,
                "data": {
                    "user": {
                        "firstName": request.user.email.split('@')[0], # Simple name
                        "lastName": "User",
                        "businessName": profile.business_name,
                        "email": request.user.email
                    },
                    "verificationStatus": profile.verification_status,
                    "pulseScore": profile.pulse_score,
                    "profitScore": profile.profit_score,
                    "verificationSteps": {
                        "profile": {"completed": bool(profile.business_name)},
                        "cac": {"completed": has_cac},
                        "businessType": {"completed": bool(profile.business_model or profile.has_physical_location)},
                        "video": {"completed": has_video},
                        "bankConnection": {"completed": profile.mono_connected}
                    },
                    "scoreBreakdown": {
                        "pulseScore": {
                            "total": profile.pulse_score,
                            "components": {} # Removed mocked components
                        },
                        "profitScore": {
                            "total": profile.profit_score,
                            "components": {} # Removed mocked components
                        }
                    },
                    "recommendations": [], # Removed mocked recommendations
                    "marketplaceStats": {
                        "profileViews": 0, # This would require a separate tracking model
                        "lenderInterest": lender_interest_count,
                        "activeOffers": active_offers_count
                    }
                }
            })
            
        except BusinessProfile.DoesNotExist:
            return Response({
                "success": False,
                "message": "Profile not found"
            }, status=status.HTTP_404_NOT_FOUND)

# --- MOCKED VIEWS REMOVED ---
# class SMEOffersView(APIView): ...
# class SMEOfferResponseView(APIView): ...