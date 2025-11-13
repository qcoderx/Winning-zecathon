from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import BusinessProfile, CACDocument, BusinessVideo, Score
import json

User = get_user_model()

class SMEAPITests(APITestCase):
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            email='sme@example.com',
            password='testpass123',
            user_type='sme'
        )
        self.client.force_authenticate(user=self.user)

    def test_business_profile_create_and_update(self):
        """Test creating and updating business profile"""
        url = reverse('sme-profile')
        data = {
            'business_name': 'Test Business Ltd',
            'industry': 'Technology',
            'business_category': 'Software Development',
            'business_address': '123 Tech Street, Lagos',
            'number_of_employees': 10,
            'monthly_revenue': 50000,
            'business_description': 'A tech startup'
        }
        # Create
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(BusinessProfile.objects.count(), 1)
        profile = BusinessProfile.objects.get()
        self.assertEqual(profile.business_name, 'Test Business Ltd')

        # Update
        data['business_name'] = 'Updated Business Ltd'
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        profile.refresh_from_db()
        self.assertEqual(profile.business_name, 'Updated Business Ltd')

    def test_cac_upload(self):
        """Test CAC document upload"""
        url = reverse('sme-upload-cac')
        # Create a simple test file
        test_file = SimpleUploadedFile(
            "test_cac.pdf",
            b"dummy pdf content",
            content_type="application/pdf"
        )
        data = {'cac_file': test_file}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CACDocument.objects.count(), 1)

    def test_video_upload(self):
        """Test business video upload"""
        url = reverse('sme-upload-video')
        # Create a simple test file
        test_file = SimpleUploadedFile(
            "test_video.mp4",
            b"dummy video content",
            content_type="video/mp4"
        )
        data = {'video_file': test_file}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BusinessVideo.objects.count(), 1)

    def test_mono_connect_without_token(self):
        """Test Mono connect without token"""
        url = reverse('sme-mono-connect')
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_dashboard_access(self):
        """Test dashboard access"""
        url = reverse('sme-dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should create a score object if it doesn't exist
        self.assertEqual(Score.objects.count(), 1)
