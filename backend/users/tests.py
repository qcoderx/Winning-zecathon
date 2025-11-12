from django.test import TestCase
from django.contrib.auth import get_user_model
from sme.models import BusinessProfile, CACDocument, BusinessVideo
from .services import PulseEngine

User = get_user_model()

class PulseEngineTests(TestCase):
    def setUp(self):
        """Set up test data for PulseEngine"""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            user_type='sme'
        )
        self.business_profile = BusinessProfile.objects.create(
            user=self.user,
            business_name='Test Business Ltd',
            industry='Technology'
        )

    def test_pulse_engine_missing_profile(self):
        """Test PulseEngine with missing business profile"""
        # Delete the profile
        self.business_profile.delete()

        engine = PulseEngine(self.user, 'Test Bank Account')
        score, reason = engine.run_verification()
        self.assertEqual(score, 0)
        self.assertIn('Business Profile is missing', reason)

    def test_pulse_engine_missing_documents(self):
        """Test PulseEngine with missing CAC and video documents"""
        engine = PulseEngine(self.user, 'Test Bank Account')
        score, reason = engine.run_verification()
        # Should have penalties for missing CAC and video
        self.assertLess(score, 100)
        self.assertIn('CAC document missing', reason)
        self.assertIn('Business Video missing', reason)

    def test_pulse_engine_bank_name_match(self):
        """Test bank name matching"""
        # Matching bank name
        engine = PulseEngine(self.user, 'Test Business Ltd')
        score, reason = engine.run_verification()
        # Should get points for bank match, but lose for missing docs
        self.assertGreaterEqual(score, 0)

        # Non-matching bank name
        engine2 = PulseEngine(self.user, 'Different Bank Name')
        score2, reason2 = engine2.run_verification()
        self.assertLessEqual(score2, score)  # Should have lower or equal score

    def test_pulse_engine_initialization(self):
        """Test PulseEngine initialization"""
        engine = PulseEngine(self.user, 'Test Bank')
        self.assertEqual(engine.user, self.user)
        self.assertEqual(engine.bank_account_name, 'Test Bank')
        self.assertEqual(engine.score, 0)
        self.assertEqual(engine.fail_reasons, [])
