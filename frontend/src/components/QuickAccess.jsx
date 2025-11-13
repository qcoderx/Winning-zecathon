import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VerificationModal from '../sme/components/VerificationModal';

const QuickAccess = ({ userType }) => {
  const navigate = useNavigate();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationState, setVerificationState] = useState('unverified');

  // Check verification status for SME users
  useEffect(() => {
    if (userType === 'sme') {
      const savedState = localStorage.getItem('sme_verification_state');
      if (savedState) {
        setVerificationState(savedState);
      }
    }
  }, [userType]);

  const handleVerificationComplete = () => {
    const savedState = localStorage.getItem('sme_verification_state');
    if (savedState) {
      setVerificationState(savedState);
    }
  };

  const getQuickActions = () => {
    if (userType === 'sme') {
      const baseActions = [
        { 
          label: 'Create Application', 
          path: '/sme/applications', 
          icon: 'add_circle',
          color: 'pulse-cyan',
          description: 'Start a new loan application'
        },
        { 
          label: 'Find Lenders', 
          path: '/sme/lenders', 
          icon: 'search',
          color: 'pulse-pink',
          description: 'Browse verified lenders'
        },
        { 
          label: 'View Profile', 
          path: '/sme/profile', 
          icon: 'person',
          color: 'pulse-green',
          description: 'Manage your business profile'
        },
        { 
          label: 'Track Pitches', 
          path: '/sme/pitches', 
          icon: 'send',
          color: 'pulse-navy',
          description: 'Monitor your pitch status'
        }
      ];

      // Add verification action if not verified
      if (verificationState !== 'verified') {
        baseActions.unshift({
          label: verificationState === 'failed' ? 'Retry Verification' : 'Get Verified',
          action: () => setShowVerificationModal(true),
          icon: 'shield',
          color: verificationState === 'failed' ? 'red-500' : 'yellow-500',
          description: verificationState === 'failed' 
            ? 'Fix verification issues' 
            : 'Complete your business verification',
          priority: true
        });
      }

      return baseActions;
    } else if (userType === 'lender') {
      return [
        { 
          label: 'Browse SMEs', 
          path: '/marketplace', 
          icon: 'store',
          color: 'pulse-cyan',
          description: 'Discover verified SMEs'
        },
        { 
          label: 'View Applications', 
          path: '/lender/applications', 
          icon: 'inbox',
          color: 'pulse-pink',
          description: 'Review incoming pitches'
        },
        { 
          label: 'My Portfolio', 
          path: '/lender/portfolio', 
          icon: 'account_balance_wallet',
          color: 'pulse-green',
          description: 'Track your investments'
        },
        { 
          label: 'My Profile', 
          path: '/lender/profile', 
          icon: 'person',
          color: 'pulse-navy',
          description: 'Update investment criteria'
        }
      ];
    }
    return [];
  };

  const quickActions = getQuickActions();

  if (!userType || userType === 'guest') {
    return null;
  }

  return (
    <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft mb-8">
      <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-pulse-cyan">flash_on</span>
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.path || action.label}
            onClick={() => action.action ? action.action() : navigate(action.path)}
            className={`p-4 rounded-lg border-2 transition-all text-left group ${
              action.priority 
                ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 hover:border-yellow-400'
                : `border-transparent hover:border-${action.color}`
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${
              action.priority
                ? 'bg-yellow-100 group-hover:bg-yellow-200'
                : `bg-${action.color}/10 group-hover:bg-${action.color}/20`
            }`}>
              <span className={`material-symbols-outlined text-xl ${
                action.priority ? 'text-yellow-600' : `text-${action.color}`
              }`}>
                {action.icon}
              </span>
            </div>
            <h4 className={`font-semibold mb-1 ${
              action.priority 
                ? 'text-yellow-800 dark:text-yellow-200'
                : 'text-pulse-dark dark:text-white'
            }`}>
              {action.label}
            </h4>
            <p className={`text-sm ${
              action.priority
                ? 'text-yellow-700 dark:text-yellow-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {action.description}
            </p>
          </motion.button>
        ))}
      </div>
      
      {userType === 'sme' && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          onComplete={handleVerificationComplete}
        />
      )}
    </div>
  );
};

export default QuickAccess;