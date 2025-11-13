import { useState } from 'react';
import { validateForm } from '../utils/validation';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const login = async (formData) => {
    setLoading(true);
    setErrors({});
    
    const validationErrors = validateForm(formData, 'login');
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return { success: false };
    }

    // Simulate backend API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Mock successful login based on user type
      const mockUser = formData.userType === 'sme' ? {
        id: 'sme_1',
        firstName: 'Sade',
        lastName: 'Adebayo',
        businessName: 'Sade Fashion House',
        email: formData.email,
        userType: 'sme',
        verificationStatus: 'pending', // 'pending', 'processing', 'verified'
        pulseScore: null,
        profitScore: null
      } : {
        id: 'lender_1',
        name: 'Alex Morgan',
        email: formData.email,
        userType: 'lender'
      };
      
      const mockToken = `mock_jwt_token_${formData.userType}_` + Date.now();
      
      // Store tokens based on user type
      if (formData.userType === 'sme') {
        localStorage.setItem('sme_token', mockToken);
        localStorage.setItem('sme_user', JSON.stringify(mockUser));
      } else {
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      
      setMessage(`Login successful! Redirecting to ${formData.userType === 'sme' ? 'dashboard' : 'marketplace'}...`);
      
      return { success: true, data: { token: mockToken, user: mockUser } };
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    setErrors({});
    
    const validationErrors = validateForm(formData, 'signup');
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return { success: false };
    }

    // Simulate backend API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      // Mock successful registration based on user type
      const userType = formData.userType || 'lender';
      setMessage(`${userType.toUpperCase()} account created successfully! Please login to continue.`);
      return { success: true, data: { message: 'Registration successful', userType } };
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setErrors({});
    
    if (!email) {
      setErrors({ email: 'Email is required' });
      setLoading(false);
      return { success: false };
    }

    // Simulate backend API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      setMessage('Password reset link sent to your email.');
      return { success: true };
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    forgotPassword,
    loading,
    errors,
    message,
    setErrors,
    setMessage
  };
};