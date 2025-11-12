import { useState } from 'react';
import { motion } from 'framer-motion';
import OnboardingWizard from '../components/OnboardingWizard';

const SMEOnboardingPage = ({ onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleOnboardingComplete = async (data) => {
    setSubmittedData(data);
    setIsCompleted(true);

    // Simulate API submission
    setTimeout(() => {
      onComplete?.(data);
    }, 2000);
  };

  if (isCompleted) {
    return (
      <motion.div 
        className="min-h-screen bg-pulse-light dark:bg-pulse-dark flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="max-w-md mx-auto text-center p-8"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-pulse-cyan rounded-full flex items-center justify-center"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 360, 720]
            }}
            transition={{ 
              scale: { duration: 0.8, times: [0, 0.6, 1] },
              rotate: { duration: 2, repeat: Infinity, ease: "linear", delay: 0.8 }
            }}
          >
            <span className="material-symbols-outlined text-white text-3xl">
              check
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold text-pulse-navy dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Onboarding Complete!
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Your business information has been submitted successfully. We're now processing your data to generate your Pulse and Profit scores.
          </motion.p>
          
          <motion.div
            className="flex items-center justify-center gap-2 text-pulse-cyan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.div 
              className="w-2 h-2 bg-pulse-cyan rounded-full"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="w-2 h-2 bg-pulse-cyan rounded-full"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="w-2 h-2 bg-pulse-cyan rounded-full"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
            <span className="ml-2 text-sm font-medium">Processing...</span>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-pulse-light dark:bg-pulse-dark">
      {/* Header */}
      <motion.header
        className="bg-white dark:bg-pulse-dark shadow-sm border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <motion.img
              src="/src/pulsi-logo-removebg-preview.png"
              alt="PulseFi Logo"
              className="h-12 w-12"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div>
              <h1 className="text-xl font-bold text-pulse-navy dark:text-white">
                PulseFi Business Onboarding
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get verified and unlock funding opportunities
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <OnboardingWizard onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default SMEOnboardingPage;