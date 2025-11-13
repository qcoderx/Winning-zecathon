import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      // Mock data - replace with actual API call
      const mockOffers = [
        {
          id: 'offer_001',
          lender: {
            name: 'Lagos Investment Partners',
            organizationName: 'Lagos Investment Partners',
            rating: 4.8,
            totalInvestments: 15,
            averageROI: 22.5
          },
          offerDetails: {
            amount: 4500000,
            interestRate: 18,
            termMonths: 24,
            offerType: 'loan',
            conditions: [
              'Monthly financial reporting required',
              'Quarterly business reviews',
              'Insurance coverage mandatory'
            ]
          },
          status: 'pending',
          submittedAt: '2024-11-12T21:00:00Z',
          expiresAt: '2024-11-19T21:00:00Z',
          message: "We're impressed with your business model and growth potential. This offer reflects our confidence in your success."
        },
        {
          id: 'offer_002',
          lender: {
            name: 'Abuja Capital Fund',
            organizationName: 'Abuja Capital Fund',
            rating: 4.6,
            totalInvestments: 23,
            averageROI: 19.8
          },
          offerDetails: {
            amount: 5000000,
            interestRate: 16,
            termMonths: 30,
            offerType: 'loan',
            conditions: [
              'Bi-weekly progress reports',
              'Milestone-based releases',
              'Business mentorship included'
            ]
          },
          status: 'pending',
          submittedAt: '2024-11-11T14:30:00Z',
          expiresAt: '2024-11-18T14:30:00Z',
          message: "Your fashion business shows excellent potential. We'd like to partner with you for long-term growth."
        }
      ];
      
      setOffers(mockOffers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setLoading(false);
    }
  };

  const handleOfferResponse = async (offerId, action, counterOffer = null) => {
    try {
      const response = await fetch(`/api/sme/offers/${offerId}/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          counterOffer,
          message: counterOffer?.message || ''
        })
      });

      if (response.ok) {
        // Update offer status
        setOffers(prev => prev.map(offer => 
          offer.id === offerId 
            ? { ...offer, status: action === 'negotiate' ? 'negotiating' : action }
            : offer
        ));
        setShowCounterModal(false);
        setSelectedOffer(null);
      }
    } catch (error) {
      console.error('Error responding to offer:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'negotiating': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days remaining`;
    if (hours > 0) return `${hours} hours remaining`;
    return 'Expires soon';
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pulse-dark dark:text-white">Investment Offers</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {offers.length} offers received • Review and respond to lender proposals
          </p>
        </div>
      </div>

      {/* Offers List */}
      {offers.length === 0 ? (
        <div className="bg-white dark:bg-pulse-navy rounded-xl p-12 text-center shadow-soft">
          <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">inbox</span>
          <h3 className="text-xl font-bold text-pulse-dark dark:text-white mb-2">No Offers Yet</h3>
          <p className="text-gray-500">Complete your verification to start receiving investment offers</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Offer Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pulse-cyan/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-pulse-cyan">account_balance</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-pulse-dark dark:text-white">
                      {offer.lender.organizationName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>★ {offer.lender.rating} rating</span>
                      <span>{offer.lender.totalInvestments} investments</span>
                      <span>{offer.lender.averageROI}% avg ROI</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(offer.status)}`}>
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTimeRemaining(offer.expiresAt)}
                  </p>
                </div>
              </div>

              {/* Offer Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pulse-cyan">
                    ₦{offer.offerDetails.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Loan Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pulse-pink">
                    {offer.offerDetails.interestRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Interest Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pulse-green">
                    {offer.offerDetails.termMonths}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Months</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pulse-navy dark:text-white">
                    ₦{Math.round((offer.offerDetails.amount * (1 + offer.offerDetails.interestRate/100)) / offer.offerDetails.termMonths).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Payment</div>
                </div>
              </div>

              {/* Message */}
              {offer.message && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    "{offer.message}"
                  </p>
                </div>
              )}

              {/* Conditions */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Conditions:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {offer.offerDetails.conditions.map((condition, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-pulse-cyan rounded-full"></span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              {offer.status === 'pending' && (
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => handleOfferResponse(offer.id, 'reject')}
                    className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Decline
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setSelectedOffer(offer);
                      setShowCounterModal(true);
                    }}
                    className="flex-1 px-4 py-2 border border-pulse-cyan text-pulse-cyan rounded-lg hover:bg-pulse-cyan/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Negotiate
                  </motion.button>
                  <motion.button
                    onClick={() => handleOfferResponse(offer.id, 'accept')}
                    className="flex-1 px-4 py-2 pulse-gradient-bg text-white rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Accept Offer
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Counter Offer Modal */}
      <CounterOfferModal
        isOpen={showCounterModal}
        offer={selectedOffer}
        onClose={() => {
          setShowCounterModal(false);
          setSelectedOffer(null);
        }}
        onSubmit={(counterOffer) => handleOfferResponse(selectedOffer.id, 'negotiate', counterOffer)}
      />
    </div>
  );
};

const CounterOfferModal = ({ isOpen, offer, onClose, onSubmit }) => {
  const [counterOffer, setCounterOffer] = useState({
    amount: offer?.offerDetails.amount || 0,
    interestRate: offer?.offerDetails.interestRate || 0,
    termMonths: offer?.offerDetails.termMonths || 0,
    message: ''
  });

  useEffect(() => {
    if (offer) {
      setCounterOffer({
        amount: offer.offerDetails.amount,
        interestRate: offer.offerDetails.interestRate,
        termMonths: offer.offerDetails.termMonths,
        message: ''
      });
    }
  }, [offer]);

  if (!isOpen || !offer) return null;

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
                Counter Offer to {offer.lender.organizationName}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loan Amount (₦)
                  </label>
                  <input
                    type="number"
                    value={counterOffer.amount}
                    onChange={(e) => setCounterOffer(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={counterOffer.interestRate}
                    onChange={(e) => setCounterOffer(prev => ({ ...prev, interestRate: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Term (Months)
                  </label>
                  <input
                    type="number"
                    value={counterOffer.termMonths}
                    onChange={(e) => setCounterOffer(prev => ({ ...prev, termMonths: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message to Lender
                </label>
                <textarea
                  value={counterOffer.message}
                  onChange={(e) => setCounterOffer(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Explain your counter offer terms..."
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
                  onClick={() => onSubmit(counterOffer)}
                  className="flex-1 px-4 py-3 pulse-gradient-bg text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Counter Offer
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OffersManagement;