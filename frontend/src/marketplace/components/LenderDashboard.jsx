import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarketplacePage from '../pages/MarketplacePage';
import LenderProfilePage from './LenderProfilePage';

const LenderDashboard = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);

  const tabs = [
    { id: 'marketplace', label: 'SME Marketplace', icon: 'store' },
    { id: 'applications', label: 'Applications', icon: 'inbox' },
    { id: 'offers', label: 'My Offers', icon: 'handshake' },
    { id: 'portfolio', label: 'Portfolio', icon: 'account_balance_wallet' },
    { id: 'profile', label: 'My Profile', icon: 'person' }
  ];

  return (
    <div className="min-h-screen bg-pulse-neutral-light dark:bg-pulse-dark">
      {/* Header */}
      <div className="bg-white dark:bg-pulse-navy shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-pulse-navy dark:text-white">Lender Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Discover and invest in verified SMEs</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-500">Available Capital</div>
                <div className="text-2xl font-bold text-pulse-green">₦50M</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Active Investments</div>
                <div className="text-2xl font-bold text-pulse-cyan">12</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Portfolio ROI</div>
                <div className="text-2xl font-bold text-pulse-pink">18.5%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-pulse-navy border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-pulse-cyan text-pulse-cyan'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
                {tab.id === 'applications' && applications.length > 0 && (
                  <span className="bg-pulse-pink text-white text-xs rounded-full px-2 py-1">
                    {applications.length}
                  </span>
                )}
                {tab.id === 'offers' && offers.length > 0 && (
                  <span className="bg-pulse-cyan text-white text-xs rounded-full px-2 py-1">
                    {offers.length}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'marketplace' && <MarketplacePage />}
            {activeTab === 'applications' && <ApplicationsTab applications={applications} />}
            {activeTab === 'offers' && <OffersTab offers={offers} />}
            {activeTab === 'portfolio' && <PortfolioTab onViewInvestment={(id) => window.location.href = `/lender/investments/${id}`} />}
            {activeTab === 'profile' && <LenderProfilePage />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const ApplicationsTab = ({ applications }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-pulse-dark dark:text-white">Incoming Applications</h2>
    
    {applications.length === 0 ? (
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-12 text-center shadow-soft">
        <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">inbox</span>
        <h3 className="text-xl font-bold text-pulse-dark dark:text-white mb-2">No Applications Yet</h3>
        <p className="text-gray-500">SMEs will submit applications directly to you from the marketplace</p>
      </div>
    ) : (
      <div className="grid gap-6">
        {applications.map((app) => (
          <motion.div
            key={app.id}
            className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft"
            whileHover={{ y: -2 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-2">
                  {app.businessName} - ₦{app.amount.toLocaleString()}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{app.purpose}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-500">Pulse Score: <strong className="text-pulse-cyan">{app.pulseScore}</strong></span>
                  <span className="text-gray-500">Profit Score: <strong className="text-pulse-pink">{app.profitScore}</strong></span>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                >
                  Review
                </motion.button>
                <motion.button
                  className="px-4 py-2 pulse-gradient-bg text-white rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  Make Offer
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

const OffersTab = ({ offers }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-pulse-dark dark:text-white">My Investment Offers</h2>
    
    {offers.length === 0 ? (
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-12 text-center shadow-soft">
        <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">handshake</span>
        <h3 className="text-xl font-bold text-pulse-dark dark:text-white mb-2">No Offers Made</h3>
        <p className="text-gray-500">Start making offers to SMEs from the marketplace</p>
      </div>
    ) : (
      <div className="grid gap-6">
        {offers.map((offer) => (
          <motion.div
            key={offer.id}
            className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft"
            whileHover={{ y: -2 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-2">
                  Offer to {offer.businessName}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <div className="font-bold text-pulse-cyan">₦{offer.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Rate:</span>
                    <div className="font-bold text-pulse-pink">{offer.rate}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Tenure:</span>
                    <div className="font-bold text-pulse-green">{offer.tenure}m</div>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                offer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                offer.status === 'accepted' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {offer.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

const PortfolioTab = ({ onViewInvestment }) => {
  const investments = [
    { 
      id: 1, 
      name: 'Sade Fashion House', 
      amount: '₦5M', 
      roi: '22%', 
      status: 'Active',
      industry: 'Fashion',
      milestones: '2/4 completed',
      nextMilestone: 'Inventory Purchase',
      escrowBalance: '₦3M pending'
    },
    { 
      id: 2, 
      name: 'TechFlow Solutions', 
      amount: '₦8M', 
      roi: '18%', 
      status: 'Active',
      industry: 'FinTech',
      milestones: '3/5 completed',
      nextMilestone: 'Marketing Campaign',
      escrowBalance: '₦2.5M pending'
    },
    { 
      id: 3, 
      name: 'Green Agro Ltd', 
      amount: '₦3.5M', 
      roi: '25%', 
      status: 'Active',
      industry: 'AgriTech',
      milestones: '1/3 completed',
      nextMilestone: 'Equipment Purchase',
      escrowBalance: '₦2.8M pending'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-pulse-dark dark:text-white">Investment Portfolio</h2>
        <div className="text-sm text-gray-500">
          Click any investment to manage escrow & monitoring
        </div>
      </div>
      
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft"
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-pulse-green/10 rounded-lg">
              <span className="material-symbols-outlined text-pulse-green">account_balance_wallet</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Invested</p>
              <p className="text-2xl font-bold text-pulse-dark dark:text-white">₦16.5M</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft"
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-pulse-cyan/10 rounded-lg">
              <span className="material-symbols-outlined text-pulse-cyan">trending_up</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Returns</p>
              <p className="text-2xl font-bold text-pulse-dark dark:text-white">₦3.4M</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft"
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-pulse-pink/10 rounded-lg">
              <span className="material-symbols-outlined text-pulse-pink">business</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active SMEs</p>
              <p className="text-2xl font-bold text-pulse-dark dark:text-white">{investments.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft"
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <span className="material-symbols-outlined text-yellow-500">account_balance</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Escrow Balance</p>
              <p className="text-2xl font-bold text-pulse-dark dark:text-white">₦8.3M</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Portfolio Holdings */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Active Investments</h3>
        <div className="space-y-4">
          {investments.map((investment) => (
            <motion.div
              key={investment.id}
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ x: 4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onViewInvestment?.(investment.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pulse-cyan/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-pulse-cyan">business</span>
                </div>
                <div>
                  <h4 className="font-bold text-pulse-dark dark:text-white">{investment.name}</h4>
                  <p className="text-sm text-gray-500">
                    {investment.industry} • {investment.amount} • {investment.milestones}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-pulse-cyan font-medium">
                      Next: {investment.nextMilestone}
                    </span>
                    <span className="text-xs text-yellow-600">
                      {investment.escrowBalance}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-pulse-green text-lg">{investment.roi} ROI</div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  investment.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {investment.status}
                </span>
                <div className="text-xs text-pulse-cyan mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">manage_accounts</span>
                  Manage
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-600">info</span>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Investment Management Features</p>
              <p>Click any investment to access escrow management, pulse monitoring, milestone tracking, and communication tools.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LenderDashboard;