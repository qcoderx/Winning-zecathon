import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LenderProfileCard from './LenderProfileCard';
import { demoLenders } from '../../data/demoData';

const LenderMarketplace = ({ loanApplications = [], onPitchSubmitted }) => {
  const [selectedLender, setSelectedLender] = useState(null);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [filters, setFilters] = useState({
    industryFocus: 'All Industries',
    loanSize: 'All Sizes',
    lenderType: 'All Types'
  });

  const lenders = demoLenders;

  const filteredLenders = lenders.filter(lender => {
    if (filters.industryFocus !== 'All Industries' && 
        !lender.industryFocus.includes(filters.industryFocus) && 
        !lender.industryFocus.includes('All Industries')) {
      return false;
    }
    if (filters.lenderType !== 'All Types' && lender.type !== filters.lenderType) {
      return false;
    }
    return true;
  });

  const handlePitch = (lender) => {
    setSelectedLender(lender);
    setShowPitchModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-pulse-navy dark:text-white mb-4">
            Find Your Perfect Financial Partner
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
            Browse verified lenders and investors. Submit targeted, professional pitches to those who match your business profile and funding requirements.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2 text-pulse-cyan">
              <span className="material-symbols-outlined">verified</span>
              <span>All Lenders Verified</span>
            </div>
            <div className="flex items-center gap-2 text-pulse-pink">
              <span className="material-symbols-outlined">speed</span>
              <span>Fast Response Times</span>
            </div>
            <div className="flex items-center gap-2 text-pulse-green">
              <span className="material-symbols-outlined">handshake</span>
              <span>Professional Matching</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-pulse-navy dark:text-white mb-4">Filter Lenders</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industry Focus
            </label>
            <select
              value={filters.industryFocus}
              onChange={(e) => setFilters({...filters, industryFocus: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan"
            >
              <option value="All Industries">All Industries</option>
              <option value="FinTech">FinTech</option>
              <option value="AgriTech">AgriTech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Size Range
            </label>
            <select
              value={filters.loanSize}
              onChange={(e) => setFilters({...filters, loanSize: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan"
            >
              <option value="All Sizes">All Sizes</option>
              <option value="₦1-10M">₦1-10M</option>
              <option value="₦10-50M">₦10-50M</option>
              <option value="₦50M+">₦50M+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lender Type
            </label>
            <select
              value={filters.lenderType}
              onChange={(e) => setFilters({...filters, lenderType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan"
            >
              <option value="All Types">All Types</option>
              <option value="Venture Capital">Venture Capital</option>
              <option value="Private Equity">Private Equity</option>
              <option value="Commercial Bank">Commercial Bank</option>
              <option value="Impact Fund">Impact Fund</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Lender Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLenders.map((lender, index) => (
          <motion.div
            key={lender.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LenderProfileCard 
              lender={lender}
              onPitch={handlePitch}
              disabled={loanApplications.length === 0}
            />
          </motion.div>
        ))}
      </div>

      {/* Pitch Modal */}
      <AnimatePresence>
        {showPitchModal && selectedLender && (
          <PitchModal 
            lender={selectedLender}
            loanApplications={loanApplications}
            onClose={() => setShowPitchModal(false)}
            onSubmit={onPitchSubmitted}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const PitchModal = ({ lender, loanApplications, onClose, onSubmit }) => {
  const [selectedApplication, setSelectedApplication] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedApp = loanApplications.find(app => app.id === selectedApplication);

  const handleSubmit = async () => {
    if (!selectedApplication) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const pitch = {
        id: Date.now(),
        lenderId: lender.id,
        lenderName: lender.name,
        applicationId: selectedApplication,
        coverNote,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      };
      
      onSubmit(pitch);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-pulse-navy rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={lender.logo} 
            alt={lender.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-xl font-bold text-pulse-navy dark:text-white">
              Submit Pitch to {lender.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lender.type} • Focuses on {lender.industryFocus.slice(0, 2).join(', ')}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Application Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Loan Application to Submit *
            </label>
            <select
              value={selectedApplication}
              onChange={(e) => setSelectedApplication(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan bg-white dark:bg-gray-700"
            >
              <option value="">Choose an application...</option>
              {loanApplications.map((app) => (
                <option key={app.id} value={app.id}>
                  ₦{app.loanAmount.toLocaleString()} - {app.purpose.substring(0, 50)}...
                </option>
              ))}
            </select>
          </div>

          {/* Application Preview */}
          {selectedApp && (
            <motion.div 
              className="bg-gradient-to-r from-pulse-cyan/10 to-pulse-pink/10 dark:from-pulse-cyan/20 dark:to-pulse-pink/20 rounded-lg p-4 border border-pulse-cyan/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-semibold text-pulse-navy dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-pulse-cyan">preview</span>
                Application Preview
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <div className="font-bold text-pulse-cyan">₦{selectedApp.loanAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Rate:</span>
                  <div className="font-bold text-pulse-pink">{selectedApp.interestRate}%</div>
                </div>
                <div>
                  <span className="text-gray-500">Tenure:</span>
                  <div className="font-bold text-pulse-green">{selectedApp.tenureMonths}m</div>
                </div>
                <div>
                  <span className="text-gray-500">Monthly:</span>
                  <div className="font-bold text-pulse-navy dark:text-white">
                    ₦{Math.round((selectedApp.loanAmount * (1 + selectedApp.interestRate/100)) / selectedApp.tenureMonths).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                <span className="text-gray-500 text-sm">Purpose:</span>
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{selectedApp.purpose}</p>
              </div>
            </motion.div>
          )}

          {/* Cover Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personalized Cover Note (Optional)
            </label>
            <textarea
              rows={5}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan resize-none bg-white dark:bg-gray-700"
              placeholder={`Dear ${lender.name} team,

I noticed your focus on ${lender.industryFocus[0]} businesses and believe my company would be an excellent fit for your investment criteria. Our business has shown consistent growth and aligns with your typical investment range.

I would welcome the opportunity to discuss this further.

Best regards,
[Your Name]`}
            />
            <p className="text-xs text-gray-500 mt-1">
              A personalized note increases your chances of getting a response by 40%
            </p>
          </div>

          {/* Lender Match Indicator */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">psychology</span>
              Why This Lender?
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                <span>Avg. response time: {lender.stats.avgResponseTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                <span>Success rate: {lender.stats.successRate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                <span>Total deployed: {lender.stats.totalDeployed}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <motion.button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              disabled={!selectedApplication || isSubmitting}
              className="flex-2 px-6 py-3 pulse-gradient-bg text-white rounded-lg disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
              whileHover={{ scale: !selectedApplication || isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: !selectedApplication || isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting Pitch...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">send</span>
                  Submit Professional Pitch
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LenderMarketplace;