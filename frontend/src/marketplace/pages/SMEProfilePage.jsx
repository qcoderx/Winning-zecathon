import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useSMEProfile } from '../hooks/useMarketplace';

const SMEProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { sme, loading } = useSMEProfile(id);

  if (loading || !sme) {
    return (
      <div className="min-h-screen bg-pulse-neutral-light dark:bg-pulse-dark flex items-center justify-center">
        <motion.div 
          className="w-12 h-12 border-4 border-pulse-cyan border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'scores', label: 'Scores' },
    { id: 'charts', label: 'Charts' },
    { id: 'insights', label: 'AI Insights' }
  ];

  const handleInvest = () => {
    setShowInvestModal(true);
  };

  const confirmInvestment = () => {
    console.log('Investment confirmed for:', sme.name);
    setShowInvestModal(false);
  };

  return (
    <div className="min-h-screen bg-pulse-neutral-light dark:bg-pulse-dark">
      {/* Header */}
      <div className="bg-white dark:bg-pulse-navy border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate('/marketplace')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </motion.button>
            <div className="size-8 text-pulse-cyan">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-pulse-dark dark:text-white text-xl font-bold">SME Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Company Header */}
        <div className="p-6 bg-white dark:bg-pulse-navy border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-1 flex-col sm:flex-row gap-6">
              <motion.div 
                className="bg-pulse-light dark:bg-gray-700 flex items-center justify-center aspect-square rounded-xl h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {sme.image ? (
                  <img src={sme.image} alt={sme.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-gray-400">business</span>
                )}
              </motion.div>
              <div className="flex flex-col justify-center gap-1">
                <h1 className="text-pulse-dark dark:text-white text-3xl font-bold">{sme.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-base">{sme.industry} | {sme.location}</p>
                <div className="mt-4 flex items-center gap-2">
                  <motion.span 
                    className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    Verified
                  </motion.span>
                  <motion.span 
                    className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    {sme.funding}
                  </motion.span>
                </div>
              </div>
            </div>
            
            {/* Score Circles */}
            <div className="flex gap-4 items-center justify-center md:justify-end">
              <ScoreCircle label="Pulse Score" score={sme.pulseScore} color="pulse-cyan" />
              <ScoreCircle label="Profit Score" score={sme.profitScore} color="pulse-pink" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-pulse-light dark:bg-pulse-dark border-b border-gray-200 dark:border-gray-700">
          <div className="flex px-6 gap-8">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-pulse-cyan text-pulse-dark dark:text-white'
                    : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm font-bold">{tab.label}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && <OverviewTab sme={sme} />}
                {activeTab === 'scores' && <ScoresTab sme={sme} />}
                {activeTab === 'charts' && <ChartsTab sme={sme} />}
                {activeTab === 'insights' && <InsightsTab sme={sme} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <InvestmentCard onInvest={handleInvest} />
            <GrowthIndicator />
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      <AnimatePresence>
        {showInvestModal && (
          <InvestmentModal
            sme={sme}
            onClose={() => setShowInvestModal(false)}
            onConfirm={confirmInvestment}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// All the existing components remain the same
const ScoreCircle = ({ label, score, color }) => {
  const circumference = 264;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
      <p className="text-pulse-dark dark:text-gray-200 text-base font-medium">{label}</p>
      <div className="relative size-24">
        <svg className="size-full -rotate-90" fill="none" strokeWidth="8" viewBox="0 0 100 100">
          <circle className="stroke-gray-200 dark:stroke-gray-700" cx="50" cy="50" r="42" />
          <motion.circle
            className={`stroke-${color}`}
            cx="50"
            cy="50"
            r="42"
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-pulse-dark dark:text-white text-2xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ sme }) => (
  <div className="space-y-8">
    <motion.div 
      className="bg-white dark:bg-pulse-navy p-6 rounded-xl border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-pulse-dark dark:text-white text-xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Business Summary</h3>
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            {sme.description}
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Company Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl text-gray-400 dark:text-gray-500 mt-0.5">person</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Founder & CEO</p>
                <p className="font-medium text-pulse-dark dark:text-gray-200">{sme.founder}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl text-gray-400 dark:text-gray-500 mt-0.5">apartment</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="font-medium text-pulse-dark dark:text-gray-200">{sme.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl text-gray-400 dark:text-gray-500 mt-0.5">calendar_today</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Founded</p>
                <p className="font-medium text-pulse-dark dark:text-gray-200">{sme.founded}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl text-gray-400 dark:text-gray-500 mt-0.5">group</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Employees</p>
                <p className="font-medium text-pulse-dark dark:text-gray-200">{sme.employees}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    
    <motion.div 
      className="bg-white dark:bg-pulse-navy p-6 rounded-xl border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="text-pulse-dark dark:text-white text-lg font-bold mb-4">Financial Highlights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-pulse-light dark:bg-pulse-dark/50 rounded-lg">
          <p className="text-2xl font-bold text-pulse-dark dark:text-white">{sme.revenue}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Annual Revenue</p>
        </div>
        <div className="text-center p-4 bg-pulse-light dark:bg-pulse-dark/50 rounded-lg">
          <p className="text-2xl font-bold text-green-500">{sme.growth}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">YoY Growth</p>
        </div>
        <div className="text-center p-4 bg-pulse-light dark:bg-pulse-dark/50 rounded-lg">
          <p className="text-2xl font-bold text-blue-500">{sme.funding}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Funding Stage</p>
        </div>
      </div>
    </motion.div>
  </div>
);

const ScoresTab = ({ sme }) => (
  <motion.div 
    className="bg-white dark:bg-pulse-navy p-6 rounded-xl border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-pulse-dark dark:text-white text-xl font-bold mb-4">Scores Breakdown</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ScoreBreakdown 
        title={`Pulse Score Breakdown (${sme.pulseScore})`}
        scores={[
          { label: 'Form', value: 95, icon: 'description' },
          { label: 'CAC', value: 80, icon: 'monitoring' },
          { label: 'Video', value: 90, icon: 'videocam' },
          { label: 'Bank', value: 75, icon: 'account_balance' }
        ]}
        color="pulse-cyan"
      />
      <ScoreBreakdown 
        title={`Profit Score Analysis (${sme.profitScore})`}
        scores={[
          { label: 'Revenue', value: 88, icon: 'payments' },
          { label: 'Cash Flow', value: 70, icon: 'account_balance_wallet' },
          { label: 'Growth', value: 67, icon: 'trending_up' }
        ]}
        color="pulse-pink"
      />
    </div>
  </motion.div>
);

const ScoreBreakdown = ({ title, scores, color }) => (
  <div>
    <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {scores.map((score, index) => (
        <motion.div 
          key={score.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <motion.div 
              className={`bg-${color} h-2.5 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${score.value}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            />
          </div>
          <div className="flex items-center gap-2 w-28 justify-end">
            <span className={`material-symbols-outlined text-${color} text-lg`}>{score.icon}</span>
            <span className="text-sm font-medium text-pulse-dark dark:text-gray-200">{score.label}: {score.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const ChartsTab = () => (
  <motion.div 
    className="bg-white dark:bg-pulse-navy p-6 rounded-xl border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-pulse-dark dark:text-white text-xl font-bold mb-4">Financial Charts</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-2">Revenue vs. Expenses</h3>
        <div className="bg-pulse-light dark:bg-pulse-dark/50 p-4 rounded-lg h-48 flex items-center justify-center">
          <span className="text-gray-500">Chart Placeholder</span>
        </div>
      </div>
      <div>
        <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-2">Transaction Heatmap</h3>
        <div className="bg-pulse-light dark:bg-pulse-dark/50 p-4 rounded-lg h-48 flex items-center justify-center">
          <span className="text-gray-500">Heatmap Placeholder</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const InsightsTab = () => (
  <motion.div 
    className="bg-white dark:bg-pulse-navy p-6 rounded-xl border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-pulse-dark dark:text-white text-xl font-bold mb-4">AI Insights & Recommendations</h2>
    <div className="space-y-3">
      {[
        { type: 'positive', icon: 'lightbulb', title: 'Positive Cash Flow', description: 'Company maintains a consistent positive cash flow, a strong indicator of financial health.' },
        { type: 'warning', icon: 'trending_down', title: 'Customer Churn', description: 'Observed a 5% increase in customer churn in Q2. Recommend investigating customer satisfaction metrics.' },
        { type: 'info', icon: 'recommend', title: 'Recommendation', description: 'Explore expanding into the APAC market, which shows a 30% YoY growth for similar SaaS products.' }
      ].map((insight, index) => (
        <motion.div 
          key={index}
          className={`flex items-start gap-4 p-4 rounded-lg ${
            insight.type === 'positive' ? 'bg-green-50 dark:bg-green-900/30' :
            insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/30' :
            'bg-blue-50 dark:bg-blue-900/30'
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className={`flex-shrink-0 mt-1 ${
            insight.type === 'positive' ? 'text-green-500 dark:text-green-400' :
            insight.type === 'warning' ? 'text-yellow-500 dark:text-yellow-400' :
            'text-blue-500 dark:text-blue-400'
          }`}>
            <span className="material-symbols-outlined">{insight.icon}</span>
          </div>
          <div>
            <h4 className={`font-bold ${
              insight.type === 'positive' ? 'text-green-800 dark:text-green-200' :
              insight.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
              'text-blue-800 dark:text-blue-200'
            }`}>
              {insight.title}
            </h4>
            <p className={`text-sm ${
              insight.type === 'positive' ? 'text-green-700 dark:text-green-300' :
              insight.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
              'text-blue-700 dark:text-blue-300'
            }`}>
              {insight.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const InvestmentCard = ({ onInvest }) => (
  <motion.div 
    className="sticky top-8 bg-white dark:bg-pulse-navy p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.3 }}
  >
    <h3 className="text-pulse-dark dark:text-white text-lg font-bold">Ready to Invest?</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm my-3">
      Become a part of this company's journey. This investment opportunity closes in 15 days.
    </p>
    <motion.button 
      className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 text-white text-base font-bold invest-button-gradient"
      onClick={onInvest}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0, 196, 180, 0.3)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <span className="truncate">Invest Now</span>
    </motion.button>
  </motion.div>
);

const GrowthIndicator = () => (
  <motion.div 
    className="bg-white dark:bg-pulse-navy p-6 rounded-xl border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <h3 className="text-pulse-dark dark:text-white text-lg font-bold mb-4">Growth Indicator</h3>
    <div className="flex flex-col items-center">
      <div className="flex items-baseline gap-2">
        <motion.span 
          className="text-4xl font-bold text-green-500 dark:text-green-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          25%
        </motion.span>
        <span className="text-gray-500 dark:text-gray-400">QoQ Revenue Growth</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
        Exceeding industry average of 15% for Q4.
      </p>
      <div className="mt-4 flex items-center gap-1 text-green-600 dark:text-green-400">
        <span className="material-symbols-outlined">trending_up</span>
        <span className="text-sm font-medium">Strong Growth Trajectory</span>
      </div>
    </div>
  </motion.div>
);

const InvestmentModal = ({ sme, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('');

  return (
    <motion.div
      className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-pulse-navy p-6 rounded-xl max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-pulse-dark dark:text-white mb-4">
          Invest in {sme.name}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Investment Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan dark:bg-gray-700 dark:text-white"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={onConfirm}
              disabled={!amount}
              className="flex-1 px-4 py-2 invest-button-gradient text-white rounded-lg disabled:opacity-50"
              whileHover={{ scale: amount ? 1.02 : 1 }}
              whileTap={{ scale: amount ? 0.98 : 1 }}
            >
              Confirm Investment
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SMEProfilePage;