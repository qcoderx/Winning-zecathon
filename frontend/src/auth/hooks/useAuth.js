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

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          user_type: 'lender'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Login successful! Redirecting...');
        return { success: true, data };
      } else {
        setErrors({ general: data.message || 'Login failed' });
        return { success: false };
      }
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

    try {
      const response = await fetch(`${API_BASE_URL}/auth/lender/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Account created successfully! Check your email for verification.');
        return { success: true, data };
      } else {
        setErrors({ general: data.message || 'Registration failed' });
        return { success: false };
      }
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

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset link sent to your email.');
        return { success: true };
      } else {
        setErrors({ general: data.message || 'Failed to send reset link' });
        return { success: false };
      }
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