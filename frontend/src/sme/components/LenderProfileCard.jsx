import { motion } from 'framer-motion';

const LenderProfileCard = ({ lender, onPitch, disabled = false }) => {
  const {
    id,
    name,
    logo,
    type,
    industryFocus,
    investmentThesis,
    typicalTerms,
    stats,
    requirements
  } = lender;

  const getTypeColor = (type) => {
    switch (type) {
      case 'Venture Capital': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Private Equity': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Commercial Bank': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'Impact Fund': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getSuccessRateColor = (rate) => {
    const numRate = parseInt(rate);
    if (numRate >= 80) return 'text-green-600 dark:text-green-400';
    if (numRate >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <motion.div
      className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <motion.div 
          className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img 
            src={logo} 
            alt={`${name} logo`}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-pulse-navy dark:text-white mb-2 truncate">
            {name}
          </h3>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(type)}`}>
            {type}
          </span>
          <div className="flex flex-wrap gap-1 mt-3">
            {industryFocus.slice(0, 3).map((industry, idx) => (
              <motion.span 
                key={idx} 
                className="px-2 py-1 bg-pulse-cyan/10 text-pulse-cyan text-xs rounded-md font-medium"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {industry}
              </motion.span>
            ))}
            {industryFocus.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs rounded-md">
                +{industryFocus.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Investment Thesis */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-pulse-pink text-sm">lightbulb</span>
          Investment Focus
        </h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
          {investmentThesis}
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Terms */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-pulse-cyan text-sm">percent</span>
            Typical Terms
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Interest:</span>
              <span className="font-bold text-pulse-dark dark:text-white">{typicalTerms.interestRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tenure:</span>
              <span className="font-bold text-pulse-dark dark:text-white">{typicalTerms.tenureRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Range:</span>
              <span className="font-bold text-pulse-dark dark:text-white">
                ₦{(typicalTerms.minLoan/1000000).toFixed(1)}M-{(typicalTerms.maxLoan/1000000).toFixed(0)}M
              </span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-pulse-green text-sm">trending_up</span>
            Track Record
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Funded:</span>
              <span className="font-bold text-pulse-dark dark:text-white">{stats.loansfunded} SMEs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Response:</span>
              <span className="font-bold text-pulse-dark dark:text-white">{stats.avgResponseTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Success:</span>
              <span className={`font-bold ${getSuccessRateColor(stats.successRate)}`}>
                {stats.successRate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-pulse-pink text-sm">checklist</span>
          Key Requirements
        </h4>
        <div className="space-y-1">
          {requirements.slice(0, 2).map((req, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <span className="material-symbols-outlined text-pulse-green text-sm mt-0.5">check_circle</span>
              <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{req}</span>
            </div>
          ))}
          {requirements.length > 2 && (
            <div className="text-xs text-gray-500 ml-6">
              +{requirements.length - 2} more requirements
            </div>
          )}
        </div>
      </div>

      {/* Total Deployed */}
      <div className="bg-gradient-to-r from-pulse-cyan/10 to-pulse-pink/10 dark:from-pulse-cyan/20 dark:to-pulse-pink/20 rounded-lg p-3 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-pulse-cyan mb-1">
            {stats.totalDeployed}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Total Capital Deployed
          </div>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        onClick={() => onPitch(lender)}
        disabled={disabled}
        className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 ${
          disabled 
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'pulse-gradient-bg text-white hover:shadow-lg'
        }`}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">
            {disabled ? 'block' : 'send'}
          </span>
          {disabled ? 'Create Loan Application First' : 'Submit Pitch'}
        </div>
      </motion.button>
    </motion.div>
  );
};

export default LenderProfileCard;