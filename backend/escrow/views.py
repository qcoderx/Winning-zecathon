import uuid
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction as db_transaction
from .models import LoanApplication, EscrowAccount, Transaction, RepaymentSchedule, Disbursement
from .serializers import (
    LoanApplicationSerializer, LoanApplicationCreateSerializer,
    EscrowAccountSerializer, TransactionSerializer,
    RepaymentScheduleSerializer, DisbursementSerializer,
    FundEscrowSerializer, InitiateDisbursementSerializer, 
    MakeRepaymentSerializer, VerifyFundingSerializer, LoanApplicationStatusSerializer
)
from .services import EscrowService, PaymentGatewayService
from sme.models import BusinessProfile
from django.db.models import Sum

class LoanApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.user_type == 'sme':
            return LoanApplication.objects.filter(sme_business__user=user)
        elif user.user_type == 'lender':
            return LoanApplication.objects.filter(lender__user=user)
        else:
            return LoanApplication.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LoanApplicationCreateSerializer
        elif self.action == 'update_status':
            return LoanApplicationStatusSerializer
        return LoanApplicationSerializer
    
    @db_transaction.atomic
    def perform_create(self, serializer):
        user = self.request.user
        
        if user.user_type == 'sme':
            sme_business = get_object_or_404(BusinessProfile, user=user)
            
            if sme_business.verification_status != 'verified':
                # Return the error response directly
                return Response(
                    {"error": "Business must be verified before applying for loans"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            loan_application = serializer.save(sme_business=sme_business, status='submitted')
            
            # NOTE: Removed automatic escrow creation here.
            # Escrow account creation should typically happen upon approval/funding initialization,
            # not immediately upon submission, to avoid the UNIQUE constraint error 
            # when the test explicitly calls it later.
            
            # Return the created instance
            return loan_application
        
        elif user.user_type == 'lender':
            lender_profile = get_object_or_404(user.lender_profile)
            loan_application = serializer.save(lender=lender_profile, status='draft')
            
            # Return the created instance
            return loan_application
        
        return None
    
    def create(self, request, *args, **kwargs):
        """Override create to handle validation response and ensure ID is returned on success"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Capture the result of perform_create: either a Response (error) or the created instance (success)
        result = self.perform_create(serializer)
        
        # If perform_create returned a Response (e.g., a 400 error for unverified SME), return it.
        if isinstance(result, Response):
            return result
        
        # If successful, 'result' is the LoanApplication instance.
        # Use the primary serializer (LoanApplicationSerializer) to represent the data,
        # ensuring all fields (including 'id') are present in the output.
        if result:
            output_serializer = LoanApplicationSerializer(result)
            headers = self.get_success_headers(output_serializer.data)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            
        # Fallback if result is None (should be caught by returning a Response earlier, but for safety)
        return Response({"detail": "Application creation failed unexpectedly."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'], serializer_class=FundEscrowSerializer)
    def initialize_funding(self, request, pk=None):
        """Initialize escrow funding with Paystack"""
        loan_application = self.get_object()
        
        # Check if user is the lender for this loan
        if request.user != loan_application.lender.user:
            return Response(
                {"error": "You can only fund your own loan applications"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if loan_application.status != 'approved':
            return Response(
                {"error": "Loan application must be approved before funding escrow"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if escrow account exists, if not, create it before funding
        if not hasattr(loan_application, 'escrow_account'):
            escrow_service = EscrowService()
            escrow_service.create_escrow_account(loan_application) # Create if missing
            
        if loan_application.escrow_account.status == 'active':
            return Response(
                {"error": "Escrow is already funded"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        amount = serializer.validated_data['amount']
        
        # Verify amount matches loan amount
        if amount != loan_application.loan_amount:
            return Response(
                {"error": f"Funding amount must match loan amount of ₦{loan_application.loan_amount}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        escrow_service = EscrowService()
        result = escrow_service.initialize_escrow_funding(
            loan_application=loan_application,
            amount=amount,
            lender_email=request.user.email
        )
        
        if result['success']:
            return Response({
                "message": "Payment initialized successfully",
                "authorization_url": result['authorization_url'],
                "reference": result['reference'],
                "amount": amount
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": result['message']},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'], serializer_class=VerifyFundingSerializer)
    def verify_funding(self, request):
        """Verify escrow funding transaction (webhook endpoint)"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        reference = serializer.validated_data['reference']
        
        escrow_service = EscrowService()
        result = escrow_service.verify_escrow_funding(reference)
        
        if result['success']:
            return Response({
                "message": "Escrow funded successfully",
                "transaction_id": result['transaction'].id,
                "loan_application_id": result['transaction'].loan_application.id,
                "amount": result['transaction'].amount
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": result['message']},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'], serializer_class=InitiateDisbursementSerializer)
    def initiate_disbursement(self, request, pk=None):
        """Initiate disbursement to SME"""
        loan_application = self.get_object()
        
        # Check permissions
        if request.user != loan_application.lender.user:
            return Response(
                {"error": "Only the lender can initiate disbursement"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if loan_application.status != 'approved':
            return Response(
                {"error": "Loan application must be approved before disbursement"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not hasattr(loan_application, 'escrow_account') or loan_application.escrow_account.status != 'active':
            return Response(
                {"error": "Escrow must be funded before disbursement"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if SME has bank details
        sme_business = loan_application.sme_business
        if not sme_business.bank_account_number or not sme_business.bank_name:
            return Response(
                {"error": "SME must have bank account details configured for disbursement"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        escrow_service = EscrowService()
        result = escrow_service.initiate_disbursement(loan_application)
        
        if result['success']:
            return Response({
                "message": "Disbursement initiated successfully",
                "disbursement_id": result['disbursement'].id,
                "status": result['disbursement'].status,
                "amount": result['disbursement'].amount,
                "beneficiary": result['disbursement'].beneficiary_account_name
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": result['message']},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def approve_application(self, request, pk=None):
        """Approve a loan application (Lender only)"""
        loan_application = self.get_object()
        
        if request.user != loan_application.lender.user:
            return Response(
                {"error": "Only the assigned lender can approve this application"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if loan_application.status != 'submitted':
            return Response(
                {"error": "Only submitted applications can be approved"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        loan_application.status = 'approved'
        loan_application.approval_date = timezone.now()
        loan_application.save()
        
        return Response({
            "message": "Loan application approved successfully",
            "status": loan_application.status,
            "approval_date": loan_application.approval_date
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def reject_application(self, request, pk=None):
        """Reject a loan application (Lender only)"""
        loan_application = self.get_object()
        
        if request.user != loan_application.lender.user:
            return Response(
                {"error": "Only the assigned lender can reject this application"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if loan_application.status not in ['submitted', 'under_review']:
            return Response(
                {"error": "Application cannot be rejected in its current state"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        loan_application.status = 'rejected'
        loan_application.save()
        
        return Response({
            "message": "Loan application rejected",
            "status": loan_application.status
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'])
    def repayment_schedule(self, request, pk=None):
        """Get repayment schedule for a loan"""
        loan_application = self.get_object()
        
        # Check permissions
        if request.user not in [loan_application.sme_business.user, loan_application.lender.user]:
            return Response(
                {"error": "You don't have permission to view this repayment schedule"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        repayment_schedule = RepaymentSchedule.objects.filter(
            loan_application=loan_application
        ).order_by('installment_number')
        
        serializer = RepaymentScheduleSerializer(repayment_schedule, many=True)
        return Response(serializer.data)
    
    
    
# Add these missing viewsets
class EscrowAccountViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EscrowAccountSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.user_type == 'sme':
            return EscrowAccount.objects.filter(loan_application__sme_business__user=user)
        elif user.user_type == 'lender':
            return EscrowAccount.objects.filter(loan_application__lender__user=user)
        else:
            return EscrowAccount.objects.none()

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.user_type == 'sme':
            return Transaction.objects.filter(loan_application__sme_business__user=user)
        elif user.user_type == 'lender':
            return Transaction.objects.filter(loan_application__lender__user=user)
        else: 
            return Transaction.objects.none()

class RepaymentScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RepaymentScheduleSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.user_type == 'sme':
            return RepaymentSchedule.objects.filter(loan_application__sme_business__user=user)
        elif user.user_type == 'lender':
            return RepaymentSchedule.objects.filter(loan_application__lender__user=user)
        else:
            return RepaymentSchedule.objects.none()
    
    @action(detail=True, methods=['post'], serializer_class=MakeRepaymentSerializer)
    def make_repayment(self, request, pk=None):
        """Make a repayment for a scheduled installment (FIXED TRANSACTION ID)"""
        repayment_schedule = self.get_object()
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            payment_method = serializer.validated_data['payment_method']
            
            # Process payment
            payment_result = PaymentGatewayService.process_payment(
                amount=amount,
                payment_method=payment_method,
                metadata={
                    'repayment_schedule_id': repayment_schedule.id,
                    'loan_application_id': repayment_schedule.loan_application.id
                }
            )
            
            if payment_result['success']:
                # Update repayment schedule
                repayment_schedule.status = 'paid'
                repayment_schedule.paid_date = timezone.now()
                repayment_schedule.save()
                
                # Create repayment transaction
                # FIX: Use a full UUID for the internal transaction_id to guarantee uniqueness
                transaction_unique_id = str(uuid.uuid4()).upper() 
                
                transaction = Transaction.objects.create(
                    loan_application=repayment_schedule.loan_application,
                    escrow_account=repayment_schedule.loan_application.escrow_account,
                    transaction_id=f"TXN-{transaction_unique_id}", # Use full UUID for guaranteed uniqueness
                    transaction_type='repayment',
                    amount=amount,
                    status='completed',
                    description=f"Repayment for installment #{repayment_schedule.installment_number}",
                    payment_reference=payment_result['transaction_reference'],
                    completed_at=timezone.now()
                )
                
                return Response({
                    "message": "Repayment processed successfully",
                    "transaction_reference": payment_result['transaction_reference']
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Payment processing failed"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LenderEscrowViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get lender escrow dashboard statistics"""
        lender_profile = get_object_or_404(request.user.lender_profile)
        
        # Get loan applications statistics
        total_loans = LoanApplication.objects.filter(lender=lender_profile).count()
        active_loans = LoanApplication.objects.filter(lender=lender_profile, status='active').count()
        pending_loans = LoanApplication.objects.filter(lender=lender_profile, status__in=['submitted', 'under_review']).count()
        
        # FIXED: Use Django's Sum function properly
        total_amount_lent = LoanApplication.objects.filter(
            lender=lender_profile, 
            status__in=['active', 'completed']
        ).aggregate(total=Sum('loan_amount'))['total'] or 0
        
        # Get recent transactions
        recent_transactions = Transaction.objects.filter(
            loan_application__lender=lender_profile
        ).order_by('-initiated_at')[:10]
        
        return Response({
            'total_loans': total_loans,
            'active_loans': active_loans,
            'pending_loans': pending_loans,
            'total_amount_lent': float(total_amount_lent),  # Convert Decimal to float for JSON
            'recent_transactions': TransactionSerializer(recent_transactions, many=True).data
        })