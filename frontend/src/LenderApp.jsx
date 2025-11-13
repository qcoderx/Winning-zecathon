import { Routes, Route } from 'react-router-dom';
import AppNavigation from './components/AppNavigation';
import Breadcrumb from './components/Breadcrumb';
import QuickAccess from './components/QuickAccess';
import { MarketplacePage } from './marketplace';
import LenderDashboard from './marketplace/components/LenderDashboard';
import LenderProfilePage from './marketplace/components/LenderProfilePage';
import InvestmentManagement from './marketplace/components/InvestmentManagement';

const LenderApp = () => {
  return (
    <div className="min-h-screen bg-pulse-neutral-light dark:bg-pulse-dark">
      <AppNavigation userType="lender" />
      <Breadcrumb userType="lender" />
      <Routes>
        <Route path="/dashboard" element={<LenderDashboardPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/profile" element={<LenderProfilePage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/investments/:id" element={<InvestmentManagementPage />} />
        <Route path="/" element={<LenderDashboardPage />} />
      </Routes>
    </div>
  );
};

// Individual page components
const ApplicationsPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-pulse-navy dark:text-white mb-8">Incoming Applications</h1>
    <div className="bg-white dark:bg-pulse-navy rounded-xl p-12 text-center shadow-soft">
      <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">inbox</span>
      <h3 className="text-xl font-bold text-pulse-dark dark:text-white mb-2">No Applications Yet</h3>
      <p className="text-gray-500">SMEs will submit applications directly to you from the marketplace</p>
    </div>
  </div>
);

const OffersPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-pulse-navy dark:text-white mb-8">My Investment Offers</h1>
    <div className="bg-white dark:bg-pulse-navy rounded-xl p-12 text-center shadow-soft">
      <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">handshake</span>
      <h3 className="text-xl font-bold text-pulse-dark dark:text-white mb-2">No Offers Made</h3>
      <p className="text-gray-500">Start making offers to SMEs from the marketplace</p>
    </div>
  </div>
);

const PortfolioPage = () => {
  const investments = [
    { 
      id: 1, 
      name: 'Sade Fashion House', 
      amount: 5000000, 
      currentROI: 22, 
      status: 'Active', 
      industry: 'Fashion',
      startDate: '2024-08-15',
      remainingMonths: 18,
      totalReturns: 1100000,
      riskLevel: 'Low',
      completedMilestones: 2,
      totalMilestones: 4
    },
    { 
      id: 2, 
      name: 'TechFlow Solutions', 
      amount: 8000000, 
      currentROI: 18, 
      status: 'Active', 
      industry: 'FinTech',
      startDate: '2024-06-10',
      remainingMonths: 14,
      totalReturns: 1440000,
      riskLevel: 'Medium',
      completedMilestones: 3,
      totalMilestones: 5
    },
    { 
      id: 3, 
      name: 'Green Agro Ltd', 
      amount: 3500000, 
      currentROI: 25, 
      status: 'Active', 
      industry: 'AgriTech',
      startDate: '2024-09-01',
      remainingMonths: 20,
      totalReturns: 875000,
      riskLevel: 'Low',
      completedMilestones: 1,
      totalMilestones: 3
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-pulse-navy dark:text-white mb-8">Investment Portfolio</h1>
      
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft text-center">
          <div className="text-3xl font-bold text-pulse-cyan mb-2">{investments.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Investments</div>
        </div>
        <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft text-center">
          <div className="text-3xl font-bold text-pulse-green mb-2">
            ₦{(investments.reduce((sum, inv) => sum + inv.amount, 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Deployed</div>
        </div>
        <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft text-center">
          <div className="text-3xl font-bold text-pulse-pink mb-2">
            {(investments.reduce((sum, inv) => sum + inv.currentROI, 0) / investments.length).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg ROI</div>
        </div>
        <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft text-center">
          <div className="text-3xl font-bold text-pulse-navy dark:text-white mb-2">
            ₦{(investments.reduce((sum, inv) => sum + inv.totalReturns, 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Returns</div>
        </div>
      </div>

      {/* Current Investments */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Active Investments</h3>
        <div className="space-y-4">
          {investments.map((investment) => (
            <div key={investment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                 onClick={() => window.location.href = `/lender/investments/${investment.id}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pulse-cyan/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-pulse-cyan">business</span>
                </div>
                <div>
                  <h4 className="font-semibold text-pulse-dark dark:text-white">{investment.name}</h4>
                  <p className="text-sm text-gray-500">
                    {investment.industry} • ₦{(investment.amount / 1000000).toFixed(1)}M • {investment.remainingMonths} months left
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {investment.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {investment.completedMilestones}/{investment.totalMilestones} milestones
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-pulse-green text-lg">{investment.currentROI}% ROI</div>
                <div className="text-sm text-gray-500">₦{(investment.totalReturns / 1000).toFixed(0)}K returns</div>
                <div className="text-xs text-pulse-cyan mt-1">Click to manage →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Lender Dashboard Page
const LenderDashboardPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-pulse-navy dark:text-white mb-8">Lender Dashboard</h1>
    
    {/* Quick Access */}
    <QuickAccess userType="lender" />
    
    {/* Performance Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <div className="flex items-center">
          <div className="p-2 bg-pulse-green/10 rounded-lg">
            <span className="material-symbols-outlined text-pulse-green">account_balance_wallet</span>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Available Capital</p>
            <p className="text-2xl font-bold text-pulse-dark dark:text-white">₦50M</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <div className="flex items-center">
          <div className="p-2 bg-pulse-cyan/10 rounded-lg">
            <span className="material-symbols-outlined text-pulse-cyan">business</span>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Investments</p>
            <p className="text-2xl font-bold text-pulse-dark dark:text-white">12</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <div className="flex items-center">
          <div className="p-2 bg-pulse-pink/10 rounded-lg">
            <span className="material-symbols-outlined text-pulse-pink">trending_up</span>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio ROI</p>
            <p className="text-2xl font-bold text-pulse-dark dark:text-white">18.5%</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <span className="material-symbols-outlined text-yellow-500">inbox</span>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">New Applications</p>
            <p className="text-2xl font-bold text-pulse-dark dark:text-white">3</p>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
      <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="material-symbols-outlined text-pulse-cyan">business</span>
          <div>
            <p className="font-medium text-pulse-dark dark:text-white">New SME application from TechFlow Solutions</p>
            <p className="text-sm text-gray-500">1 day ago</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="material-symbols-outlined text-pulse-green">handshake</span>
          <div>
            <p className="font-medium text-pulse-dark dark:text-white">Investment offer accepted by Green Agro Ltd</p>
            <p className="text-sm text-gray-500">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Investment Management Page
const InvestmentManagementPage = () => {
  // Mock investment data - in real app, fetch based on route params
  const investment = {
    id: 1,
    smeName: 'Sade Fashion House',
    smeId: 'sme_12345',
    lenderId: 'lender_67890',
    loanId: 'loan_12345',
    industry: 'Fashion',
    location: 'Lagos Island, Lagos',
    amount: 5000000,
    currentROI: 22,
    totalReturns: 1100000,
    riskLevel: 'Low',
    startDate: '2024-08-15',
    remainingMonths: 18,
    completedMilestones: 2,
    totalMilestones: 4
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <InvestmentManagement investment={investment} />
    </div>
  );
};

export default LenderApp;