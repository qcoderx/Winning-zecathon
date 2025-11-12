import { useState } from 'react';
import { motion } from 'framer-motion';

const InvestmentCard = ({ sme, onMakeOffer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const kpis = [
    {
      label: 'Expected ROI',
      value: '18-24%',
      icon: 'trending_up',
      color: 'text-green-600'
    },
    {
      label: 'Risk Level',
      value: 'Medium',
      icon: 'shield',
      color: 'text-yellow-600'
    },
    {
      label: 'Loan Term',
      value: '24 months',
      icon: 'schedule',
      color: 'text-blue-600'
    },
    {
      label: 'Collateral',
      value: 'Business Assets',
      icon: 'account_balance',
      color: 'text-purple-600'
    }
  ];

  return (
    <motion.div
      className="sticky top-8 bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-pulse-dark dark:text-white">
            Investment Overview
          </h3>
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="material-symbols-outlined text-gray-500"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              expand_more
            </motion.span>
          </motion.button>
        </div>

        {/* Loan Amount */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-pulse-dark dark:text-white mb-1">
            ₦{(sme.loanAmount || 2500000).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Funding Required</div>
        </div>

        {/* Interest Rate */}
        <div className="bg-pulse-light dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-pulse-cyan mb-1">
            {sme.interestRate || '15'}%
          </div>
          <div className="text-xs text-gray-500">Proposed Interest Rate</div>
        </div>
      </div>

      {/* KPIs */}
      <motion.div
        className="p-6"
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 'auto' }}
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <span className={`material-symbols-outlined ${kpi.color} text-lg mb-1 block`}>
                {kpi.icon}
              </span>
              <div className="text-sm font-bold text-pulse-dark dark:text-white">
                {kpi.value}
              </div>
              <div className="text-xs text-gray-500">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        {/* AI Confidence Score */}
        <div className="bg-gradient-to-r from-pulse-cyan/10 to-pulse-pink/10 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              AI Confidence
            </span>
            <span className="text-lg font-bold text-pulse-cyan">
              {Math.round((sme.pulseScore + sme.profitScore) / 2)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-pulse-cyan to-pulse-pink h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((sme.pulseScore + sme.profitScore) / 2)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={() => onMakeOffer?.(sme)}
          className="w-full py-4 pulse-gradient-bg text-white font-bold rounded-lg text-lg"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(0, 196, 180, 0.3)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          Make an Offer
        </motion.button>

        {/* Risk Disclaimer */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-yellow-600 text-sm mt-0.5">
              warning
            </span>
            <div className="text-xs text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Investment Risk Notice</p>
              <p>All investments carry risk. Past performance does not guarantee future results.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvestmentCard;