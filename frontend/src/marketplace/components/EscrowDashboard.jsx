import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EscrowDashboard = ({ loanId, smeId, lenderId }) => {
  const [escrowData, setEscrowData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    // Fetch escrow data
    fetchEscrowData();
  }, [loanId]);

  const fetchEscrowData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        totalAmount: 5000000,
        releasedAmount: 2000000,
        pendingAmount: 3000000,
        status: 'active',
        nextMilestone: 'Inventory Purchase Complete',
        nextReleaseAmount: 1500000,
        nextReleaseDate: '2024-12-15'
      };

      const mockMilestones = [
        {
          id: 1,
          title: 'Initial Working Capital',
          amount: 2000000,
          status: 'released',
          releaseDate: '2024-11-01',
          description: 'Initial funds for immediate operational needs',
          evidence: ['receipt_001.pdf', 'bank_statement.pdf'],
          feedback: 'Funds utilized effectively for inventory restocking'
        },
        {
          id: 2,
          title: 'Inventory Purchase',
          amount: 1500000,
          status: 'pending_approval',
          dueDate: '2024-12-15',
          description: 'Purchase of premium inventory for Q1 2025',
          requirements: ['Purchase orders', 'Supplier invoices', 'Delivery receipts'],
          submittedEvidence: ['po_001.pdf', 'supplier_invoice.pdf']
        },
        {
          id: 3,
          title: 'Marketing Campaign',
          amount: 1000000,
          status: 'upcoming',
          dueDate: '2025-01-30',
          description: 'Digital marketing campaign for new product launch',
          requirements: ['Campaign proposal', 'Performance metrics', 'ROI analysis']
        },
        {
          id: 4,
          title: 'Final Expansion',
          amount: 500000,
          status: 'upcoming',
          dueDate: '2025-03-15',
          description: 'Store expansion and equipment upgrade',
          requirements: ['Lease agreement', 'Equipment invoices', 'Progress photos']
        }
      ];

      setEscrowData(mockData);
      setMilestones(mockMilestones);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching escrow data:', error);
      setLoading(false);
    }
  };

  const handleReleaseFunds = async (milestoneId) => {
    try {
      // API call to release funds
      const response = await fetch(`/api/escrow/release/${milestoneId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update milestone status
        setMilestones(prev => prev.map(m => 
          m.id === milestoneId 
            ? { ...m, status: 'released', releaseDate: new Date().toISOString().split('T')[0] }
            : m
        ));
        setShowReleaseModal(false);
      }
    } catch (error) {
      console.error('Error releasing funds:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'released': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pending_approval': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'upcoming': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'released': return 'check_circle';
      case 'pending_approval': return 'pending';
      case 'upcoming': return 'schedule';
      default: return 'help';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-pulse-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Escrow Overview */}
      <motion.div
        className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-pulse-cyan text-2xl">account_balance</span>
          <div>
            <h3 className="text-lg font-bold text-pulse-dark dark:text-white">
              Escrow Account Overview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Secure fund management with milestone-based releases
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-pulse-cyan mb-1">
              ₦{escrowData.totalAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Escrow</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              ₦{escrowData.releasedAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Released</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              ₦{escrowData.pendingAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pulse-pink mb-1">
              {Math.round((escrowData.releasedAmount / escrowData.totalAmount) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Fund Release Progress</span>
            <span>{Math.round((escrowData.releasedAmount / escrowData.totalAmount) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-pulse-cyan to-pulse-pink h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(escrowData.releasedAmount / escrowData.totalAmount) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Milestones */}
      <motion.div
        className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-pulse-pink text-2xl">flag</span>
          <div>
            <h3 className="text-lg font-bold text-pulse-dark dark:text-white">
              Funding Milestones
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track progress and approve fund releases
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pulse-cyan/20 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-pulse-cyan">
                      {getStatusIcon(milestone.status)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-pulse-dark dark:text-white">
                      {milestone.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(milestone.status)}`}>
                    <span className="material-symbols-outlined text-xs">
                      {getStatusIcon(milestone.status)}
                    </span>
                    {milestone.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <p className="text-lg font-bold text-pulse-cyan mt-1">
                    ₦{milestone.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {milestone.status === 'pending_approval' && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Ready for Review
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        SME has submitted required evidence
                      </p>
                    </div>
                    <motion.button
                      onClick={() => {
                        setSelectedMilestone(milestone);
                        setShowReleaseModal(true);
                      }}
                      className="px-4 py-2 bg-pulse-cyan text-white rounded-lg text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Review & Release
                    </motion.button>
                  </div>
                </div>
              )}

              {milestone.status === 'released' && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <span className="font-medium">Released on {milestone.releaseDate}</span>
                    {milestone.feedback && (
                      <span className="block mt-1 text-xs">"{milestone.feedback}"</span>
                    )}
                  </p>
                </div>
              )}

              {milestone.status === 'upcoming' && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Due: {milestone.dueDate}</span>
                    <span className="block mt-1 text-xs">
                      Required: {milestone.requirements?.join(', ')}
                    </span>
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Release Funds Modal */}
      <AnimatePresence>
        {showReleaseModal && selectedMilestone && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReleaseModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-pulse-navy rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-pulse-dark dark:text-white">
                    Review Milestone: {selectedMilestone.title}
                  </h3>
                  <button
                    onClick={() => setShowReleaseModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Milestone Details
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {selectedMilestone.description}
                    </p>
                    <p className="text-2xl font-bold text-pulse-cyan">
                      ₦{selectedMilestone.amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Submitted Evidence
                    </h4>
                    <div className="space-y-2">
                      {selectedMilestone.submittedEvidence?.map((doc, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="material-symbols-outlined text-pulse-cyan">description</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                          <button className="ml-auto text-pulse-cyan hover:text-pulse-cyan/80">
                            <span className="material-symbols-outlined text-sm">download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setShowReleaseModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={() => handleReleaseFunds(selectedMilestone.id)}
                      className="flex-1 px-4 py-3 pulse-gradient-bg text-white rounded-lg font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Release Funds
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

export default EscrowDashboard;