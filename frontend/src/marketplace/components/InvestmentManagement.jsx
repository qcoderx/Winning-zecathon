import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EscrowDashboard from './EscrowDashboard';
import PulseMonitoring from './PulseMonitoring';

const InvestmentManagement = ({ investment }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    fetchFeedbackHistory();
  }, [investment.id]);

  const fetchFeedbackHistory = async () => {
    try {
      // Mock data - replace with actual API call
      const mockFeedback = [
        {
          id: 1,
          message: 'Great progress on the inventory expansion. The new product lines are showing strong sales.',
          timestamp: '2024-11-10T14:30:00Z',
          type: 'positive',
          milestoneId: 1
        },
        {
          id: 2,
          message: 'Please provide more detailed breakdown of marketing expenses for better tracking.',
          timestamp: '2024-11-08T09:15:00Z',
          type: 'request',
          milestoneId: 2
        },
        {
          id: 3,
          message: 'Excellent cash flow management this quarter. Keep up the good work!',
          timestamp: '2024-11-05T16:45:00Z',
          type: 'positive',
          milestoneId: null
        }
      ];
      setFeedbackHistory(mockFeedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!newFeedback.trim()) return;

    try {
      const feedback = {
        id: Date.now(),
        message: newFeedback,
        timestamp: new Date().toISOString(),
        type: 'general',
        milestoneId: null
      };

      // API call to submit feedback
      const response = await fetch(`/api/investments/${investment.id}/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedback)
      });

      if (response.ok) {
        setFeedbackHistory(prev => [feedback, ...prev]);
        setNewFeedback('');
        setShowFeedbackModal(false);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'escrow', label: 'Escrow Management', icon: 'account_balance' },
    { id: 'monitoring', label: 'Pulse Monitoring', icon: 'monitoring' },
    { id: 'feedback', label: 'Communication', icon: 'chat' }
  ];

  const getFeedbackIcon = (type) => {
    switch (type) {
      case 'positive': return 'thumb_up';
      case 'request': return 'help';
      case 'warning': return 'warning';
      default: return 'chat';
    }
  };

  const getFeedbackColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'request': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-pulse-cyan/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-pulse-cyan text-2xl">
                business
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-pulse-dark dark:text-white">
                {investment.smeName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {investment.industry} • {investment.location}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-pulse-cyan font-medium">
                  Investment: ₦{investment.amount.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  Started: {new Date(investment.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="text-sm text-gray-500">
              {investment.remainingMonths} months remaining
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-pulse-cyan text-pulse-cyan'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-pulse-cyan mb-1">
                        {investment.currentROI}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Current ROI</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ₦{investment.totalReturns.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Returns</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-pulse-pink mb-1">
                        {investment.riskLevel}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Risk Level</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-pulse-navy dark:text-white mb-1">
                        {investment.completedMilestones}/{investment.totalMilestones}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Milestones</div>
                    </div>
                  </div>

                  {/* Recent Updates */}
                  <div>
                    <h4 className="text-lg font-semibold text-pulse-dark dark:text-white mb-4">
                      Recent Updates
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          type: 'milestone',
                          title: 'Inventory Milestone Completed',
                          description: 'Successfully completed Q4 inventory expansion ahead of schedule',
                          timestamp: '2024-11-12T10:30:00Z'
                        },
                        {
                          type: 'payment',
                          title: 'Monthly Payment Received',
                          description: 'Received scheduled payment of ₦125,000',
                          timestamp: '2024-11-10T14:15:00Z'
                        },
                        {
                          type: 'report',
                          title: 'Monthly Report Submitted',
                          description: 'October business performance report available',
                          timestamp: '2024-11-08T09:00:00Z'
                        }
                      ].map((update, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-8 h-8 bg-pulse-cyan/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-pulse-cyan text-sm">
                              {update.type === 'milestone' ? 'flag' : 
                               update.type === 'payment' ? 'payments' : 'description'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-pulse-dark dark:text-white">
                              {update.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {update.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(update.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'escrow' && (
                <EscrowDashboard 
                  loanId={investment.loanId}
                  smeId={investment.smeId}
                  lenderId={investment.lenderId}
                />
              )}

              {activeTab === 'monitoring' && (
                <PulseMonitoring 
                  smeId={investment.smeId}
                  loanId={investment.loanId}
                />
              )}

              {activeTab === 'feedback' && (
                <div className="space-y-6">
                  {/* Send Feedback */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-pulse-dark dark:text-white">
                        Communication with SME
                      </h4>
                      <motion.button
                        onClick={() => setShowFeedbackModal(true)}
                        className="px-4 py-2 pulse-gradient-bg text-white rounded-lg text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Send Message
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Maintain open communication with the SME to track progress and provide guidance.
                    </p>
                  </div>

                  {/* Feedback History */}
                  <div>
                    <h4 className="text-lg font-semibold text-pulse-dark dark:text-white mb-4">
                      Message History
                    </h4>
                    <div className="space-y-4">
                      {feedbackHistory.map((feedback, index) => (
                        <motion.div
                          key={feedback.id}
                          className={`p-4 rounded-lg ${getFeedbackColor(feedback.type)}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined">
                              {getFeedbackIcon(feedback.type)}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm mb-2">{feedback.message}</p>
                              <div className="flex items-center gap-4 text-xs opacity-75">
                                <span>{new Date(feedback.timestamp).toLocaleString()}</span>
                                {feedback.milestoneId && (
                                  <span>Related to Milestone #{feedback.milestoneId}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-pulse-navy rounded-xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-pulse-dark dark:text-white">
                    Send Message to SME
                  </h3>
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      value={newFeedback}
                      onChange={(e) => setNewFeedback(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Share feedback, ask questions, or provide guidance..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setShowFeedbackModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSubmitFeedback}
                      disabled={!newFeedback.trim()}
                      className="flex-1 px-4 py-2 pulse-gradient-bg text-white rounded-lg disabled:opacity-50"
                      whileHover={{ scale: newFeedback.trim() ? 1.02 : 1 }}
                      whileTap={{ scale: newFeedback.trim() ? 0.98 : 1 }}
                    >
                      Send Message
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvestmentManagement;