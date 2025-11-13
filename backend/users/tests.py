from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import User

User = get_user_model()

class UserRegistrationTests(APITestCase):
    def test_sme_registration(self):
        """Test SME user registration"""
        url = reverse('sme-register')
        data = {
            'email': 'sme@example.com',
            'password': 'testpass123',
            'user_type': 'sme',
            'business_name': 'Test SME',
            'phone_number': '+2341234567890'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().user_type, 'sme')

    def test_lender_registration(self):
        """Test Lender user registration"""
        url = reverse('lender-register')
        data = {
            'email': 'lender@example.com',
            'password': 'testpass123',
            'user_type': 'lender',
            'company_name': 'Test Lender Corp',
            'phone_number': '+2341234567890'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().user_type, 'lender')

    def test_login_sme(self):
        """Test SME login"""
        # Create user
        user = User.objects.create_user(
            email='sme@example.com',
            password='testpass123',
            user_type='sme'
        )
        url = reverse('login')
        data = {
            'email': 'sme@example.com',
            'password': 'testpass123',
            'user_type': 'sme'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['user_type'], 'sme')

    def test_login_lender(self):
        """Test Lender login"""
        # Create user
        user = User.objects.create_user(
            email='lender@example.com',
            password='testpass123',
            user_type='lender'
        )
        url = reverse('login')
        data = {
            'email': 'lender@example.com',
            'password': 'testpass123',
            'user_type': 'lender'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['user_type'], 'lender')

    def test_invalid_login(self):
        """Test invalid login credentials"""
        url = reverse('login')
        data = {
            'email': 'nonexistent@example.com',
            'password': 'wrongpass',
            'user_type': 'sme'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
