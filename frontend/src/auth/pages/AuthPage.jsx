import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import AuthToggle from '../components/AuthToggle';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import SocialButtons from '../components/SocialButtons';
import Alert from '../components/Alert';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('signup');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { login, signup, forgotPassword, loading, errors, message, setErrors, setMessage } = useAuth();

  useEffect(() => {
    if (message) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setMessage('');
    setFormData({ email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeTab === 'signup') {
      const result = await signup(formData);
      if (result.success) {
        setActiveTab('login');
        setFormData({ email: formData.email, password: '' });
      }
    } else {
      const result = await login(formData);
      if (result.success) {
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email first' });
      return;
    }
    
    const result = await forgotPassword(formData.email);
    if (result.success) {
      setShowForgotPassword(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden p-4 sm:p-6 font-display">
      <motion.div 
        className="layout-container flex h-full w-full grow flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="layout-content-container flex w-full max-w-md flex-col items-center justify-center">
          {/* Logo */}
          <motion.div 
            className="flex flex-col items-center justify-center pb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.img 
              src="/src/pulsi-logo-removebg-preview.png"
              alt="PulseFi Logo"
              className="h-16 w-auto"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Auth Form */}
          <motion.div 
            className="flex w-full flex-col rounded-xl bg-background-light dark:bg-background-dark sm:border sm:border-gray-200 dark:sm:border-neutral-dark/30 sm:shadow-lg sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h1 
              className="text-primary dark:text-neutral-light tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-4"
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'signup' ? 'Create your Investor Account' : 'Welcome Back, Investor'}
            </motion.h1>

            <AuthToggle activeTab={activeTab} onTabChange={handleTabChange} />

            <AnimatePresence mode="wait">
              {!showForgotPassword ? (
                <motion.form 
                  key={activeTab}
                  className="flex w-full flex-col space-y-4 px-4 py-3"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: activeTab === 'signup' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === 'signup' ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmailInput
                    value={formData.email}
                    onChange={(value) => setFormData({ ...formData, email: value })}
                    error={errors.email}
                  />

                  <PasswordInput
                    value={formData.password}
                    onChange={(value) => setFormData({ ...formData, password: value })}
                    showStrength={activeTab === 'signup'}
                    showForgotPassword={activeTab === 'login'}
                    onForgotPassword={() => setShowForgotPassword(true)}
                    error={errors.password}
                  />

                  {errors.general && (
                    <motion.div
                      className="text-red-500 dark:text-red-400 text-sm text-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.general}
                    </motion.div>
                  )}

                  <motion.div 
                    className="px-0 pt-4 pb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <motion.button 
                      type="submit"
                      disabled={loading}
                      className="flex h-12 w-full items-center justify-center rounded-lg bg-accent-green text-primary font-bold text-base leading-normal transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-green dark:focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      {loading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        activeTab === 'signup' ? 'Create Account' : 'Sign In'
                      )}
                    </motion.button>
                  </motion.div>

                  <SocialButtons />
                </motion.form>
              ) : (
                <motion.div
                  className="flex w-full flex-col space-y-4 px-4 py-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center py-4">
                    <h2 className="text-primary dark:text-neutral-light text-xl font-semibold mb-2">
                      Reset Your Password
                    </h2>
                    <p className="text-neutral-dark dark:text-neutral-light/80 text-sm">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  <EmailInput
                    value={formData.email}
                    onChange={(value) => setFormData({ ...formData, email: value })}
                    error={errors.email}
                    placeholder="Enter your email address"
                  />

                  {errors.general && (
                    <motion.div
                      className="text-red-500 dark:text-red-400 text-sm text-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.general}
                    </motion.div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 h-12 rounded-lg border border-gray-300 dark:border-neutral-dark/50 text-primary dark:text-neutral-light font-medium transition-colors hover:bg-gray-50 dark:hover:bg-primary/10"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="flex-1 h-12 rounded-lg bg-accent-green text-primary font-bold transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      {loading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        'Send Reset Link'
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer Links */}
          <motion.div 
            className="mt-8 flex items-center justify-center space-x-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.a 
              className="text-neutral-dark dark:text-neutral-light/80 text-sm hover:underline transition-colors"
              href="#"
              whileHover={{ scale: 1.05 }}
            >
              Terms of Service
            </motion.a>
            <motion.a 
              className="text-neutral-dark dark:text-neutral-light/80 text-sm hover:underline transition-colors"
              href="#"
              whileHover={{ scale: 1.05 }}
            >
              Privacy Policy
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Alert */}
      <Alert
        type={errors.general ? 'error' : 'success'}
        message={message || errors.general}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default AuthPage;