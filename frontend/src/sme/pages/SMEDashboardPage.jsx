import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SMEDashboardPage = ({ smeData }) => {
  const [dashboardData, setDashboardData] = useState({
    status: 'processing', // 'processing', 'verified', 'failed'
    pulseScore: null,
    profitScore: null,
    recommendations: []
  });

  // Mock data generation for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate mock scores based on submitted data
      const mockPulseScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const mockProfitScore = Math.floor(Math.random() * 40) + 60; // 60-100
      
      const mockRecommendations = [
        {
          type: 'financial',
          title: 'Improve Cash Flow Consistency',
          description: 'Maintain more regular transaction patterns to boost your Profit Score',
          impact: '+5 points'
        },
        {
          type: 'documentation',
          title: 'Complete Business Registration',
          description: 'Finalize your CAC registration to maximize your Pulse Score',
          impact: '+10 points'
        },
        {
          type: 'operations',
          title: 'Expand Digital Presence',
          description: 'Create business social media profiles to enhance credibility',
          impact: '+3 points'
        }
      ];

      setDashboardData({
        status: mockPulseScore >= 75 ? 'verified' : 'failed',
        pulseScore: mockPulseScore,
        profitScore: mockProfitScore,
        recommendations: mockRecommendations
      });
    }, 3000); // 3 second delay to simulate processing

    return () => clearTimeout(timer);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const ProcessingView = () => (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="w-24 h-24 mx-auto mb-6 bg-pulse-cyan/20 rounded-full flex items-center justify-center"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ 
          scale: 1,
          rotate: 360
        }}
        transition={{ 
          scale: { duration: 0.5, delay: 0.2 },
          rotate: { duration: 2, repeat: Infinity, ease: "linear", delay: 0.7 }
        }}
      >
        <span className="material-symbols-outlined text-pulse-cyan text-4xl">
          analytics
        </span>
      </motion.div>
      <motion.h2 
        className="text-2xl font-bold text-pulse-navy dark:text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Analyzing Your Business Data
      </motion.h2>
      <motion.p 
        className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Our AI is processing your business information, CAC certificate, video, and financial data to generate your scores.
      </motion.p>
      <motion.div 
        className="flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.div 
          className="w-3 h-3 bg-pulse-cyan rounded-full"
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.div 
          className="w-3 h-3 bg-pulse-cyan rounded-full"
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div 
          className="w-3 h-3 bg-pulse-cyan rounded-full"
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );

  const VerifiedView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Success Banner */}
      <motion.div
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl">verified</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
              Congratulations! Your Business is Verified
            </h2>
            <p className="text-green-700 dark:text-green-300">
              You've passed our verification process and are now visible to investors
            </p>
          </div>
        </div>
      </motion.div>

      {/* Scores Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, staggerChildren: 0.2 }}
      >
        <motion.div
          className="bg-white dark:bg-pulse-dark rounded-xl shadow-soft p-6"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-pulse-navy dark:text-white">Pulse Score</h3>
            <span className="material-symbols-outlined text-pulse-cyan">verified_user</span>
          </div>
          <div className="text-center">
            <motion.div
              className={`text-5xl font-bold ${getScoreColor(dashboardData.pulseScore)} mb-2`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              {dashboardData.pulseScore}
            </motion.div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Authenticity Score</p>
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-pulse-cyan h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${dashboardData.pulseScore}%` }}
                transition={{ delay: 0.6, duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-pulse-dark rounded-xl shadow-soft p-6"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-pulse-navy dark:text-white">Profit Score</h3>
            <span className="material-symbols-outlined text-pulse-green">trending_up</span>
          </div>
          <div className="text-center">
            <motion.div
              className={`text-5xl font-bold ${getScoreColor(dashboardData.profitScore)} mb-2`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {dashboardData.profitScore}
            </motion.div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Financial Health Score</p>
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-pulse-green h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${dashboardData.profitScore}%` }}
                transition={{ delay: 0.7, duration: 1 }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        className="bg-white dark:bg-pulse-dark rounded-xl shadow-soft p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-pulse-navy dark:text-white mb-4">
          AI-Powered Recommendations
        </h3>
        <div className="space-y-4">
          {dashboardData.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <div className="w-8 h-8 bg-pulse-cyan/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-pulse-cyan text-sm">
                  {rec.type === 'financial' ? 'payments' : rec.type === 'documentation' ? 'description' : 'public'}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-pulse-navy dark:text-white">{rec.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-full">
                  {rec.impact}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const FailedView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl">error</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200">
              Verification Incomplete
            </h2>
            <p className="text-red-700 dark:text-red-300">
              Your Pulse Score is below the minimum threshold of 75 points
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-pulse-dark rounded-xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-pulse-navy dark:text-white mb-4">
          Your Current Scores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(dashboardData.pulseScore)} mb-2`}>
              {dashboardData.pulseScore}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pulse Score</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(dashboardData.profitScore)} mb-2`}>
              {dashboardData.profitScore}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Profit Score</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-pulse-navy dark:text-white">Recommended Actions:</h4>
          {dashboardData.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="material-symbols-outlined text-pulse-cyan text-sm mt-0.5">arrow_forward</span>
              <div>
                <p className="font-medium text-pulse-navy dark:text-white">{rec.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-pulse-light dark:bg-pulse-dark">
      {/* Header */}
      <motion.header
        className="bg-white dark:bg-pulse-dark shadow-sm border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                  SME Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {smeData?.businessInfo?.businessName || 'Your Business'}
                </p>
              </div>
            </div>
            
            {dashboardData.status === 'verified' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span className="text-sm font-medium">Verified Business</span>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {dashboardData.status === 'processing' && <ProcessingView />}
        {dashboardData.status === 'verified' && <VerifiedView />}
        {dashboardData.status === 'failed' && <FailedView />}
      </div>
    </div>
  );
};

export default SMEDashboardPage;