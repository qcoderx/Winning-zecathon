import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VerificationStatus from './VerificationStatus';
import VerificationModal from './VerificationModal';

const SMEDashboard = () => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [pitches, setPitches] = useState([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationState, setVerificationState] = useState('unverified');
  const [pulseScore, setPulseScore] = useState(null);
  const [profitScore, setProfitScore] = useState(null);

  // Check verification status on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sme_verification_state');
    const savedPulseScore = localStorage.getItem('sme_pulse_score');
    const savedProfitScore = localStorage.getItem('sme_profit_score');
    
    if (savedState) {
      setVerificationState(savedState);
      if (savedPulseScore) setPulseScore(parseInt(savedPulseScore));
      if (savedProfitScore) setProfitScore(parseInt(savedProfitScore));
    }
  }, []);

  const handleVerificationComplete = () => {
    // Refresh verification status
    const savedState = localStorage.getItem('sme_verification_state');
    const savedPulseScore = localStorage.getItem('sme_pulse_score');
    const savedProfitScore = localStorage.getItem('sme_profit_score');
    
    if (savedState) {
      setVerificationState(savedState);
      if (savedPulseScore) setPulseScore(parseInt(savedPulseScore));
      if (savedProfitScore) setProfitScore(parseInt(savedProfitScore));
    }
  };

  const handlePitchSubmitted = (pitch) => {
    setPitches(prev => [...prev, pitch]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-pulse-navy dark:text-white">SME Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your funding journey</p>
        </div>
        <div className="flex items-center gap-4">
          {verificationState === 'verified' ? (
            <>
              <div className="text-right">
                <div className="text-sm text-gray-500">Pulse Score</div>
                <div className="text-2xl font-bold text-pulse-cyan">{pulseScore}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Profit Score</div>
                <div className="text-2xl font-bold text-pulse-pink">{profitScore}</div>
              </div>
            </>
          ) : (
            <motion.button
              onClick={() => setShowVerificationModal(true)}
              className="px-4 py-2 pulse-gradient-bg text-white rounded-lg font-medium flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <span className="material-symbols-outlined text-sm">shield</span>
              Get Verified
            </motion.button>
          )}
        </div>
      </div>
      
      <OverviewTab 
        loanApplications={loanApplications} 
        pitches={pitches} 
        verificationState={verificationState}
        onStartVerification={() => setShowVerificationModal(true)}
        onRetryVerification={() => setShowVerificationModal(true)}
      />
      
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onComplete={handleVerificationComplete}
      />
    </div>
  );
};

const OverviewTab = ({ loanApplications, pitches, verificationState, onStartVerification, onRetryVerification }) => (
  <div className="space-y-6">
    {/* Verification Status */}
    {verificationState !== 'verified' && (
      <VerificationStatus
        onStartVerification={onStartVerification}
        onRetryVerification={onRetryVerification}
      />
    )}
    
    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <motion.div 
        className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft"
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center">
          <div className="p-2 bg-pulse-cyan/10 rounded-lg">
            <span className="material-symbols-outlined text-pulse-cyan">request_quote</span>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Applications</p>
            <p className="text-2xl font-bold text-pulse-dark dark:text-white">{loanApplications.length}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft"
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center">
          <div className="p-2 bg-pulse-pink/10 rounded-lg">
            <span className="material-symbols-outlined text-pulse-pink">send</span>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pitches Sent</p>
            <p className="text-2xl font-bold text-pulse-dark dark:text-white">{pitches.length}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft"
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center">
          <div className="p-2 bg-pulse-green/10 rounded-lg">
            <span className="material-symbols-outlined text-pulse-green">trending_up</span>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
            <p className="text-2xl font-bold text-pulse-dark dark:text-white">
              {pitches.length > 0 ? '67%' : '0%'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft"
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <span className="material-symbols-outlined text-yellow-500">schedule</span>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
            <p className="text-2xl font-bold text-pulse-dark dark:text-white">2.3 days</p>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
      <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Recent Activity</h3>
      {pitches.length === 0 && loanApplications.length === 0 ? (
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-gray-400 text-4xl mb-4">inbox</span>
          <p className="text-gray-500">No activity yet. Create your first loan application to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pitches.slice(0, 3).map((pitch) => (
            <div key={pitch.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="material-symbols-outlined text-pulse-pink">send</span>
              <div>
                <p className="font-medium text-pulse-dark dark:text-white">
                  Pitch sent to {pitch.lenderName}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(pitch.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default SMEDashboard;