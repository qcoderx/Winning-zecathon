import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NegotiationTab = ({ sme, offers = [], onSubmitOffer }) => {
  const [newOffer, setNewOffer] = useState({
    interestRate: sme.interestRate || 15,
    message: '',
    amount: sme.loanAmount || 2500000,
    tenure: 24
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmitOffer = async () => {
    if (!newOffer.interestRate || newOffer.interestRate < 5 || newOffer.interestRate > 30) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const offer = {
        id: Date.now(),
        ...newOffer,
        timestamp: new Date().toISOString(),
        status: 'pending',
        investorName: 'Alex Morgan'
      };
      
      onSubmitOffer?.(offer);
      setNewOffer({
        interestRate: sme.interestRate || 15,
        message: '',
        amount: sme.loanAmount || 2500000,
        tenure: 24
      });
      setIsSubmitting(false);
      setShowConfirmation(true);
      
      setTimeout(() => setShowConfirmation(false), 3000);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'countered': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return 'check_circle';
      case 'rejected': return 'cancel';
      case 'countered': return 'sync';
      default: return 'schedule';
    }
  };

  return (
    <div className="space-y-6">
      {/* Offer Form */}
      <motion.div
        className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-pulse-cyan text-2xl">gavel</span>
          <div>
            <h3 className="text-lg font-bold text-pulse-dark dark:text-white">
              Submit Formal Investment Proposal
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional term sheet - This will be sent directly to the SME for review
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proposed Interest Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="30"
                step="0.1"
                value={newOffer.interestRate}
                onChange={(e) => setNewOffer({ ...newOffer, interestRate: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan bg-white dark:bg-gray-700 text-pulse-dark dark:text-white"
                placeholder="15.0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Market range: 12-25% for similar businesses
            </p>
          </div>

          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Investment Amount (₦)
            </label>
            <input
              type="number"
              value={newOffer.amount}
              onChange={(e) => setNewOffer({ ...newOffer, amount: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan bg-white dark:bg-gray-700 text-pulse-dark dark:text-white"
              placeholder="2500000"
            />
          </div>

          {/* Tenure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Tenure (months)
            </label>
            <select
              value={newOffer.tenure}
              onChange={(e) => setNewOffer({ ...newOffer, tenure: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan bg-white dark:bg-gray-700 text-pulse-dark dark:text-white"
            >
              <option value={12}>12 months</option>
              <option value={18}>18 months</option>
              <option value={24}>24 months</option>
              <option value={36}>36 months</option>
            </select>
          </div>

          {/* Expected Monthly Return */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected Monthly Return
            </label>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
              <span className="text-lg font-bold text-pulse-cyan">
                ₦{Math.round((newOffer.amount * newOffer.interestRate / 100) / 12).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message to SME (Optional)
          </label>
          <textarea
            value={newOffer.message}
            onChange={(e) => setNewOffer({ ...newOffer, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan bg-white dark:bg-gray-700 text-pulse-dark dark:text-white resize-none"
            placeholder="Add any terms, conditions, or questions you'd like to discuss..."
          />
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmitOffer}
          disabled={isSubmitting || !newOffer.interestRate}
          className="w-full py-4 pulse-gradient-bg text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
          whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting Term Sheet...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">send</span>
              Submit Investment Proposal
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Success Confirmation */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600 text-2xl">
                check_circle
              </span>
              <div>
                <h4 className="font-bold text-green-800 dark:text-green-200">
                  Offer Submitted Successfully!
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  The SME will be notified and can respond within 48 hours.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Negotiation History */}
      {offers.length > 0 && (
        <motion.div
          className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-pulse-pink text-2xl">history</span>
            <div>
              <h3 className="text-lg font-bold text-pulse-dark dark:text-white">
                Investment Proposals & Negotiations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Formal term sheets and counteroffers
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pulse-cyan/20 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-pulse-cyan">
                        account_balance
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-pulse-dark dark:text-white">
                        {offer.investorName} - Investment Proposal
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted {new Date(offer.timestamp).toLocaleDateString()} at{' '}
                        {new Date(offer.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(offer.status)}`}>
                    <span className="material-symbols-outlined text-xs">
                      {getStatusIcon(offer.status)}
                    </span>
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500">Interest Rate:</span>
                    <span className="font-bold text-pulse-dark dark:text-white ml-2">
                      {offer.interestRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-bold text-pulse-dark dark:text-white ml-2">
                      ₦{offer.amount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tenure:</span>
                    <span className="font-bold text-pulse-dark dark:text-white ml-2">
                      {offer.tenure}m
                    </span>
                  </div>
                </div>

                {offer.message && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      "{offer.message}"
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NegotiationTab;