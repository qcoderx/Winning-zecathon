import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useSMEProfile } from '../hooks/useMarketplace';
import { PulsefiLogo } from '../../components/LoadingScreen';
import InvestmentCard from '../components/InvestmentCard';
import NegotiationTab from '../components/NegotiationTab';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SMEProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [offers, setOffers] = useState([]);
  const [showNegotiation, setShowNegotiation] = useState(false);
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
    { id: 'overview', label: 'Overview', icon: 'overview' },
    { id: 'financial', label: 'Financial Health', icon: 'analytics' },
    { id: 'verification', label: 'Trust Verification', icon: 'verified_user' },
    { id: 'negotiation', label: 'Make Offer', icon: 'handshake' }
  ];

  // Mock financial data for charts
  const cashFlowData = [
    { month: 'Jan', inflow: 450000, outflow: 320000, net: 130000 },
    { month: 'Feb', inflow: 520000, outflow: 340000, net: 180000 },
    { month: 'Mar', inflow: 480000, outflow: 360000, net: 120000 },
    { month: 'Apr', inflow: 610000, outflow: 380000, net: 230000 },
    { month: 'May', inflow: 580000, outflow: 400000, net: 180000 },
    { month: 'Jun', inflow: 650000, outflow: 420000, net: 230000 }
  ];

  const revenueData = [
    { quarter: 'Q1 2023', revenue: 1450000, growth: 12 },
    { quarter: 'Q2 2023', revenue: 1680000, growth: 16 },
    { quarter: 'Q3 2023', revenue: 1820000, growth: 8 },
    { quarter: 'Q4 2023', revenue: 2100000, growth: 15 }
  ];

  const handleMakeOffer = () => {
    setActiveTab('negotiation');
    setShowNegotiation(true);
  };

  const handleSubmitOffer = (offer) => {
    setOffers([...offers, offer]);
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
            <PulsefiLogo size={64} />
            <h1 className="text-pulse-dark dark:text-white text-xl font-bold">SME Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Company Header */}
        <div className="p-8 bg-gradient-to-r from-white to-pulse-light dark:from-pulse-navy dark:to-pulse-dark border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-1 flex-col sm:flex-row gap-6">
              <motion.div 
                className="bg-white dark:bg-gray-700 flex items-center justify-center aspect-square rounded-2xl h-32 w-32 flex-shrink-0 overflow-hidden shadow-soft"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                {sme.image ? (
                  <img src={sme.image} alt={sme.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-gray-400">business</span>
                )}
              </motion.div>
              <div className="flex flex-col justify-center gap-2">
                <motion.h1 
                  className="text-pulse-dark dark:text-white text-4xl font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {sme.name}
                </motion.h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">{sme.industry} • {sme.location}</p>
                <div className="mt-4 flex items-center gap-3">
                  <motion.span 
                    className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-200 ring-1 ring-green-600/20"
                    whileHover={{ scale: 1.05 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="material-symbols-outlined text-sm mr-1">verified</span>
                    Verified Business
                  </motion.span>
                  <motion.span 
                    className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200 ring-1 ring-blue-600/20"
                    whileHover={{ scale: 1.05 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {sme.funding || 'Series A'}
                  </motion.span>
                  <motion.div
                    className="text-2xl font-bold text-pulse-dark dark:text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    ₦{(sme.loanAmount || 2500000).toLocaleString()}
                    <span className="text-sm text-gray-500 font-normal ml-1">seeking</span>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Score Display */}
            <div className="flex gap-6 items-center justify-center lg:justify-end">
              <ScoreCircle label="Pulse Score" score={sme.pulseScore} color="pulse-cyan" />
              <ScoreCircle label="Profit Score" score={sme.profitScore} color="pulse-pink" />
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white dark:bg-pulse-navy border-b border-gray-200 dark:border-gray-700">
          <div className="flex px-8 gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`flex items-center gap-2 px-6 py-4 border-b-3 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-b-pulse-cyan text-pulse-cyan bg-pulse-cyan/5'
                    : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-pulse-cyan hover:bg-pulse-cyan/5'
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
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
                {activeTab === 'financial' && <FinancialTab sme={sme} cashFlowData={cashFlowData} revenueData={revenueData} />}
                {activeTab === 'verification' && <VerificationTab sme={sme} />}
                {activeTab === 'negotiation' && <NegotiationTab sme={sme} offers={offers} onSubmitOffer={handleSubmitOffer} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Investment Card Sidebar */}
          <div className="lg:col-span-1">
            <InvestmentCard sme={sme} onMakeOffer={handleMakeOffer} />
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
    {/* Investment Opportunity Summary */}
    <motion.div 
      className="bg-gradient-to-br from-white to-pulse-light dark:from-pulse-navy dark:to-pulse-dark p-8 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-pulse-cyan text-2xl">investment</span>
        <h2 className="text-pulse-dark dark:text-white text-2xl font-bold">Investment Opportunity</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="text-center p-4 bg-white dark:bg-pulse-navy rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-pulse-cyan mb-2">₦{(sme.loanApplication?.loanAmount || 2500000).toLocaleString()}</div>
          <div className="text-sm text-gray-500">Loan Amount Requested</div>
        </div>
        <div className="text-center p-4 bg-white dark:bg-pulse-navy rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-pulse-pink mb-2">{sme.loanApplication?.interestRate || 15}%</div>
          <div className="text-sm text-gray-500">Asking Interest Rate</div>
        </div>
        <div className="text-center p-4 bg-white dark:bg-pulse-navy rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-green-500 mb-2">{sme.loanApplication?.tenureMonths || 24}</div>
          <div className="text-sm text-gray-500">Tenure (Months)</div>
        </div>
        <div className="text-center p-4 bg-white dark:bg-pulse-navy rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-blue-500 mb-2">{Math.round((sme.loanApplication?.interestRate || 15) * 1.2)}-{Math.round((sme.loanApplication?.interestRate || 15) * 1.4)}%</div>
          <div className="text-sm text-gray-500">Expected ROI</div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined">psychology</span>
          What PulseFi AI Says About This Business
        </h3>
        <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
          This SME demonstrates strong financial discipline with consistent cash flow patterns and verified business operations. 
          The cross-verification of CAC documents, video evidence, and bank data shows high authenticity. 
          Revenue growth trajectory indicates sustainable business model with low default risk.
        </p>
      </div>
    </motion.div>

    {/* Business Details */}
    <motion.div 
      className="bg-white dark:bg-pulse-navy p-8 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="text-pulse-dark dark:text-white text-xl font-bold mb-6">Business Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Business Summary</h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {sme.description}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Funding Purpose</h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {sme.loanApplication?.purpose || `Expansion of operations, inventory procurement, and working capital to meet growing demand in the ${sme.industry} sector.`}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { icon: 'person', label: 'Founder & CEO', value: sme.founder },
            { icon: 'apartment', label: 'Location', value: sme.location },
            { icon: 'calendar_today', label: 'Founded', value: sme.founded },
            { icon: 'group', label: 'Employees', value: sme.employees },
            { icon: 'category', label: 'Industry', value: sme.industry }
          ].map((item, index) => (
            <motion.div 
              key={item.label}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <span className="material-symbols-outlined text-pulse-cyan">{item.icon}</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="font-medium text-pulse-dark dark:text-gray-200">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

const FinancialTab = ({ sme, cashFlowData, revenueData }) => (
  <div className="space-y-8">
    {/* Cash Flow Chart */}
    <motion.div 
      className="bg-white dark:bg-pulse-navy p-8 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-pulse-dark dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-pulse-cyan">waterfall_chart</span>
        Cash Flow Analysis
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area type="monotone" dataKey="net" stroke="#00C4B4" fill="#00C4B4" fillOpacity={0.3} />
            <Area type="monotone" dataKey="inflow" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>

    {/* Revenue Growth */}
    <motion.div 
      className="bg-white dark:bg-pulse-navy p-8 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="text-pulse-dark dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-pulse-pink">trending_up</span>
        Revenue Growth Trajectory
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="quarter" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="revenue" fill="#FF6B9D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>

    {/* Financial Metrics */}
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {[
        { label: 'Monthly Revenue', value: '₦650K', change: '+15%', color: 'green' },
        { label: 'Profit Margin', value: '28%', change: '+3%', color: 'blue' },
        { label: 'Debt-to-Equity', value: '0.35', change: '-5%', color: 'purple' }
      ].map((metric, index) => (
        <div key={metric.label} className="bg-white dark:bg-pulse-navy p-6 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-pulse-dark dark:text-white mb-1">{metric.value}</div>
          <div className="text-sm text-gray-500 mb-2">{metric.label}</div>
          <div className={`text-sm font-medium ${
            metric.color === 'green' ? 'text-green-600' : 
            metric.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
          }`}>
            {metric.change} vs last quarter
          </div>
        </div>
      ))}
    </motion.div>
  </div>
);

const VerificationTab = ({ sme }) => (
  <div className="space-y-8">
    {/* Pulse Score Breakdown */}
    <motion.div 
      className="bg-white dark:bg-pulse-navy p-8 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-pulse-dark dark:text-white text-xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-pulse-cyan">verified_user</span>
        Trust Verification Breakdown
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { label: 'Form Data Match', score: 95, icon: 'description', description: 'Business information consistency' },
          { label: 'CAC Verification', score: 88, icon: 'gavel', description: 'Corporate Affairs Commission validation' },
          { label: 'Video Verification', score: 92, icon: 'videocam', description: 'Live business operations proof' },
          { label: 'Bank Data Match', score: 85, icon: 'account_balance', description: 'Financial records alignment' }
        ].map((item, index) => (
          <motion.div 
            key={item.label}
            className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-pulse-cyan text-xl">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-pulse-dark dark:text-white">{item.label}</h4>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-pulse-cyan">{item.score}</div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-pulse-cyan h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Verification Timeline */}
    <motion.div 
      className="bg-white dark:bg-pulse-navy p-8 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-pulse-dark dark:text-white text-xl font-bold mb-6">Verification Timeline</h3>
      <div className="space-y-4">
        {[
          { step: 'Business Registration', date: '2023-08-15', status: 'completed', icon: 'check_circle' },
          { step: 'Document Verification', date: '2023-08-16', status: 'completed', icon: 'check_circle' },
          { step: 'Video Validation', date: '2023-08-17', status: 'completed', icon: 'check_circle' },
          { step: 'Bank Account Linking', date: '2023-08-18', status: 'completed', icon: 'check_circle' },
          { step: 'AI Analysis Complete', date: '2023-08-19', status: 'completed', icon: 'psychology' }
        ].map((item, index) => (
          <motion.div 
            key={item.step}
            className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="material-symbols-outlined text-green-600">{item.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-pulse-dark dark:text-white">{item.step}</p>
              <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              Verified
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
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