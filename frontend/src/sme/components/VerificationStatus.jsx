import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const VerificationStatus = ({ onStartVerification, onRetryVerification }) => {
  const [verificationState, setVerificationState] = useState('unverified'); // unverified, pending, verified, failed
  const [pulseScore, setPulseScore] = useState(null);
  const [profitScore, setProfitScore] = useState(null);
  const [failureReason, setFailureReason] = useState(null);

  // Simulate checking verification status (in real app, this would be an API call)
  useEffect(() => {
    const savedState = localStorage.getItem('sme_verification_state');
    const savedPulseScore = localStorage.getItem('sme_pulse_score');
    const savedProfitScore = localStorage.getItem('sme_profit_score');
    const savedFailureReason = localStorage.getItem('sme_failure_reason');

    if (savedState) {
      setVerificationState(savedState);
      if (savedPulseScore) setPulseScore(parseInt(savedPulseScore));
      if (savedProfitScore) setProfitScore(parseInt(savedProfitScore));
      if (savedFailureReason) setFailureReason(savedFailureReason);
    }
  }, []);

  const getStatusConfig = () => {
    switch (verificationState) {
      case 'unverified':
        return {
          icon: 'shield',
          title: 'Complete Your Verification',
          subtitle: 'Generate your Pulse Score to unlock funding opportunities',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          actionText: 'Start Verification',
          actionColor: 'pulse-gradient-bg',
          showAction: true
        };
      case 'pending':
        return {
          icon: 'hourglass_empty',
          title: 'Verification in Progress',
          subtitle: 'We\'re analyzing your business data to generate your scores',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          actionText: 'Processing...',
          actionColor: 'bg-yellow-500',
          showAction: false
        };
      case 'verified':
        return {
          icon: 'verified',
          title: 'Verification Complete',
          subtitle: `Pulse Score: ${pulseScore} | Profit Score: ${profitScore}`,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          actionText: 'View Details',
          actionColor: 'bg-green-500',
          showAction: false
        };
      case 'failed':
        return {
          icon: 'error',
          title: 'Verification Failed',
          subtitle: failureReason || 'Please review your information and try again',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          actionText: 'Retry Verification',
          actionColor: 'bg-red-500',
          showAction: true
        };
      default:
        return {};
    }
  };

  const config = getStatusConfig();

  const handleAction = () => {
    if (verificationState === 'unverified') {
      onStartVerification?.();
    } else if (verificationState === 'failed') {
      onRetryVerification?.();
    }
  };

  return (
    <motion.div
      className={`p-4 rounded-xl border-2 border-dashed ${config.bgColor} border-gray-300`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 ${config.bgColor} rounded-full`}>
          <span className={`material-symbols-outlined ${config.color} text-2xl`}>
            {config.icon}
          </span>
        </div>
        <div className="flex-1">
          <h3 className={`font-bold ${config.color}`}>{config.title}</h3>
          <p className="text-sm text-gray-600">{config.subtitle}</p>
        </div>
        {config.showAction && (
          <motion.button
            onClick={handleAction}
            className={`px-4 py-2 ${config.actionColor} text-white rounded-lg font-medium`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {config.actionText}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default VerificationStatus;