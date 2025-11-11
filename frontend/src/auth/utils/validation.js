export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  let strength = 'Weak';
  let color = 'red';
  let width = '20%';
  
  if (score >= 4) {
    strength = 'Strong';
    color = 'green';
    width = '100%';
  } else if (score >= 3) {
    strength = 'Medium';
    color = 'yellow';
    width = '60%';
  }
  
  return { strength, color, width, isValid: score >= 3 };
};

export const validateForm = (formData, type) => {
  const errors = {};
  
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (type === 'signup' && !validatePassword(formData.password).isValid) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
  }
  
  return errors;
};