import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingWizard from './OnboardingWizard';

const VerificationModal = ({ isOpen, onClose, onComplete }) => {
  const [showWizard, setShowWizard] = useState(false);

  const handleStartVerification = () => {
    setShowWizard(true);
  };

  const handleWizardComplete = (data) => {
    // Simulate processing
    localStorage.setItem('sme_verification_state', 'pending');
    
    // Simulate AI processing delay
    setTimeout(() => {
      const pulseScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const profitScore = Math.floor(Math.random() * 40) + 60; // 60-100
      
      if (pulseScore >= 75) {
        localStorage.setItem('sme_verification_state', 'verified');
        localStorage.setItem('sme_pulse_score', pulseScore.toString());
        localStorage.setItem('sme_profit_score', profitScore.toString());
      } else {
        localStorage.setItem('sme_verification_state', 'failed');
        localStorage.setItem('sme_failure_reason', 'CAC document mismatch detected');
      }
      
      onComplete?.(data);
      onClose();
      setShowWizard(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`bg-white dark:bg-pulse-navy rounded-2xl w-full ${
            showWizard ? 'max-w-6xl max-h-[95vh] overflow-hidden' : 'max-w-2xl'
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {showWizard ? (
            <div className="h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-pulse-navy dark:text-white">Business Verification</h2>
                <motion.button
                  onClick={() => {
                    setShowWizard(false);
                    onClose();
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="material-symbols-outlined">close</span>
                </motion.button>
              </div>
              <OnboardingWizard onComplete={handleWizardComplete} />
            </div>
          ) : (
            <div className="p-8 max-h-[80vh] overflow-y-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 pulse-gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-white text-3xl">shield</span>
                </div>
                <h2 className="text-2xl font-bold text-pulse-navy dark:text-white mb-2">
                  Complete Your Business Verification
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate your Pulse Score to unlock funding opportunities and build trust with lenders
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-pulse-light dark:bg-gray-800 rounded-lg">
                  <span className="material-symbols-outlined text-pulse-cyan">business</span>
                  <div>
                    <h3 className="font-semibold text-pulse-navy dark:text-white">Business Information</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Provide your company details</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-pulse-light dark:bg-gray-800 rounded-lg">
                  <span className="material-symbols-outlined text-pulse-pink">upload_file</span>
                  <div>
                    <h3 className="font-semibold text-pulse-navy dark:text-white">CAC Certificate</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upload your business registration</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-pulse-light dark:bg-gray-800 rounded-lg">
                  <span className="material-symbols-outlined text-pulse-green">videocam</span>
                  <div>
                    <h3 className="font-semibold text-pulse-navy dark:text-white">Live Video</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Record your business location</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-pulse-light dark:bg-gray-800 rounded-lg">
                  <span className="material-symbols-outlined text-yellow-600">account_balance</span>
                  <div>
                    <h3 className="font-semibold text-pulse-navy dark:text-white">Bank Connection</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connect via Mono for financial data</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleStartVerification}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600"
                >
                  Start Verification
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerificationModal;