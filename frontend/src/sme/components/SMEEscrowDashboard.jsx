import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SMEEscrowDashboard = () => {
  const [escrowData, setEscrowData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    fetchEscrowData();
  }, []);

  const fetchEscrowData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        totalAmount: 5000000,
        releasedAmount: 2000000,
        pendingAmount: 3000000,
        status: 'active',
        lenderName: 'Lagos Investment Partners',
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
          requirements: ['Business plan execution', 'Initial setup costs'],
          submittedEvidence: ['receipt_001.pdf', 'bank_statement.pdf'],
          lenderFeedback: 'Funds utilized effectively for inventory restocking. Great progress!'
        },
        {
          id: 2,
          title: 'Inventory Purchase',
          amount: 1500000,
          status: 'pending_evidence',
          dueDate: '2024-12-15',
          description: 'Purchase of premium inventory for Q1 2025',
          requirements: ['Purchase orders', 'Supplier invoices', 'Delivery receipts'],
          submittedEvidence: []
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

  const handleSubmitEvidence = async (milestoneId, evidence) => {
    try {
      const formData = new FormData();
      evidence.files.forEach(file => formData.append('files', file));
      formData.append('description', evidence.description);

      const response = await fetch(`/api/escrow/milestones/${milestoneId}/evidence`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        // Update milestone status
        setMilestones(prev => prev.map(m => 
          m.id === milestoneId 
            ? { ...m, status: 'pending_approval', submittedEvidence: evidence.files.map(f => f.name) }
            : m
        ));
        setShowEvidenceModal(false);
        setSelectedMilestone(null);
      }
    } catch (error) {
      console.error('Error submitting evidence:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'released': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pending_approval': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'pending_evidence': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'upcoming': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'released': return 'check_circle';
      case 'pending_approval': return 'pending';
      case 'pending_evidence': return 'upload';
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
              Escrow Account with {escrowData.lenderName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Secure milestone-based fund releases
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-pulse-cyan mb-1">
              ₦{escrowData.totalAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Funding</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              ₦{escrowData.releasedAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Received</div>
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

        {/* Next Milestone Alert */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-600">info</span>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Next Milestone: {escrowData.nextMilestone}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Submit evidence to unlock ₦{escrowData.nextReleaseAmount.toLocaleString()} by {escrowData.nextReleaseDate}
              </p>
            </div>
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
              Complete milestones to unlock funding
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

              {/* Requirements */}
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Required Evidence:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {milestone.requirements.map((req, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full text-gray-600 dark:text-gray-400">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status-specific content */}
              {milestone.status === 'pending_evidence' && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Action Required: Submit Evidence
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Due: {milestone.dueDate}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => {
                        setSelectedMilestone(milestone);
                        setShowEvidenceModal(true);
                      }}
                      className="px-4 py-2 bg-pulse-cyan text-white rounded-lg text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Upload Evidence
                    </motion.button>
                  </div>
                </div>
              )}

              {milestone.status === 'pending_approval' && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Under Review</span> - Evidence submitted and awaiting lender approval
                  </p>
                  {milestone.submittedEvidence.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Submitted files:</p>
                      <div className="flex flex-wrap gap-1">
                        {milestone.submittedEvidence.map((file, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                            {file}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {milestone.status === 'released' && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <span className="font-medium">Completed on {milestone.releaseDate}</span>
                  </p>
                  {milestone.lenderFeedback && (
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Lender feedback: "{milestone.lenderFeedback}"
                    </p>
                  )}
                </div>
              )}

              {milestone.status === 'upcoming' && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Upcoming milestone</span> - Complete previous milestones to unlock
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Evidence Upload Modal */}
      <EvidenceUploadModal
        isOpen={showEvidenceModal}
        milestone={selectedMilestone}
        onClose={() => {
          setShowEvidenceModal(false);
          setSelectedMilestone(null);
        }}
        onSubmit={handleSubmitEvidence}
      />
    </div>
  );
};

const EvidenceUploadModal = ({ isOpen, milestone, onClose, onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');

  const handleFileSelect = (selectedFiles) => {
    setFiles(Array.from(selectedFiles));
  };

  const handleSubmit = () => {
    if (files.length === 0) return;
    
    onSubmit(milestone.id, {
      files,
      description
    });
  };

  if (!isOpen || !milestone) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
                Submit Evidence: {milestone.title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Required Evidence:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {milestone.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-pulse-cyan rounded-full"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Files
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan dark:bg-gray-700 dark:text-white"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((file, idx) => (
                      <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs">description</span>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Provide additional context about the submitted evidence..."
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={files.length === 0}
                  className="flex-1 px-4 py-3 pulse-gradient-bg text-white rounded-lg font-medium disabled:opacity-50"
                  whileHover={{ scale: files.length > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: files.length > 0 ? 0.98 : 1 }}
                >
                  Submit Evidence
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SMEEscrowDashboard;