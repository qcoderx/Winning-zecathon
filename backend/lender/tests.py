from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from sme.models import BusinessProfile
from .models import LenderProfile, SMEInterest

User = get_user_model()

class LenderAPITests(APITestCase):
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            email='lender@example.com',
            password='testpass123',
            user_type='lender'
        )
        self.client.force_authenticate(user=self.user)

        # Create lender profile
        self.lender_profile = LenderProfile.objects.create(
            user=self.user,
            lender_type='bank',
            company_name='Test Lender Corp',
            years_in_operation=5,
            min_loan_amount=10000,
            max_loan_amount=100000,
            risk_appetite=5,
            contact_person='John Doe',
            contact_email='john@testlender.com',
            contact_phone='+1234567890',
            office_address='123 Test Street'
        )

        # Create some verified SMEs for marketplace
        self.sme_user1 = User.objects.create_user(
            email='sme1@example.com',
            password='testpass123',
            user_type='sme'
        )
        self.sme_profile1 = BusinessProfile.objects.create(
            user=self.sme_user1,
            business_name='Tech Startup 1',
            industry='Technology',
            verification_status='verified',
            pulse_score=85,
            profit_score=80
        )

        self.sme_user2 = User.objects.create_user(
            email='sme2@example.com',
            password='testpass123',
            user_type='sme'
        )
        self.sme_profile2 = BusinessProfile.objects.create(
            user=self.sme_user2,
            business_name='Retail Store',
            industry='Retail',
            verification_status='verified',
            pulse_score=90,
            profit_score=75
        )

    def test_lender_profile_create_and_update(self):
        """Test lender profile creation and updates"""
        # Profile should already exist from setUp
        url = reverse('lender-profile-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

        # Update profile
        update_url = reverse('lender-profile-detail', kwargs={'pk': self.lender_profile.pk})
        data = {
            'company_name': 'Updated Lender Corp',
            'years_in_operation': 6,
            'min_loan_amount': 15000,
            'max_loan_amount': 150000,
            'risk_appetite': 6,
            'contact_person': 'Jane Doe',
            'contact_email': 'jane@testlender.com',
            'contact_phone': '+1234567891',
            'office_address': '456 Updated Street'
        }
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.lender_profile.refresh_from_db()
        self.assertEqual(self.lender_profile.company_name, 'Updated Lender Corp')

    def test_marketplace_list(self):
        """Test marketplace listing"""
        url = reverse('marketplace-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return the verified SMEs
        self.assertGreaterEqual(len(response.data), 2)

    def test_marketplace_detail(self):
        """Test marketplace detail view"""
        url = reverse('marketplace-detail', kwargs={'pk': self.sme_profile1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['business_name'], 'Tech Startup 1')

    def test_sme_interest_create(self):
        """Test creating interest in an SME"""
        url = reverse('sme-interest-list')
        data = {
            'sme_business': self.sme_profile1.pk,
            'status': 'interested',
            'notes': 'Very promising startup'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SMEInterest.objects.count(), 1)

    def test_sme_interest_update_status(self):
        """Test updating interest status"""
        # Create interest first
        interest = SMEInterest.objects.create(
            lender=self.lender_profile,
            sme_business=self.sme_profile1,
            status='viewed'
        )
        url = reverse('sme-interest-update-status', kwargs={'pk': interest.pk})
        data = {'status': 'contacted'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        interest.refresh_from_db()
        self.assertEqual(interest.status, 'contacted')

    def test_search_filters(self):
        """Test search filter creation and listing"""
        url = reverse('search-filter-list')
        data = {
            'name': 'Tech Startups',
            'filters': {
                'industry': ['Software Development'],
                'min_pulse_score': 80,
                'min_profit_score': 70
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Tech Startups')

    def test_dashboard_stats(self):
        """Test lender dashboard stats"""
        url = reverse('lender-dashboard-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_verified_smes', response.data)
        self.assertIn('my_interests', response.data)
