import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AppNavigation from './components/AppNavigation';
import Breadcrumb from './components/Breadcrumb';
import QuickAccess from './components/QuickAccess';
import { SMEOnboardingPage } from './sme';
import SMEProfilePage from './sme/components/SMEProfilePage';
import LenderMarketplace from './sme/components/LenderMarketplace';
import LoanApplicationForm from './sme/components/LoanApplicationForm';
import SMEDashboard from './sme/components/SMEDashboard';
import OffersManagement from './sme/components/OffersManagement';
import SMEEscrowDashboard from './sme/components/SMEEscrowDashboard';
import CommunicationCenter from './sme/components/CommunicationCenter';
import SMEAuthPage from './auth/pages/SMEAuthPage';

const SMEApp = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('sme_token');
    const userData = localStorage.getItem('sme_user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Check if user needs onboarding
    if (!userData.verificationStatus || userData.verificationStatus === 'pending') {
      navigate('/sme/onboarding');
    } else {
      navigate('/sme/dashboard');
    }
  };

  const handleOnboardingComplete = (data) => {
    navigate('/sme/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('sme_token');
    localStorage.removeItem('sme_user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/sme');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pulse-neutral-light dark:bg-pulse-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pulse-cyan"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SMEAuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-pulse-neutral-light dark:bg-pulse-dark">
      <AppNavigation userType="sme" user={user} onLogout={handleLogout} />
      <Breadcrumb userType="sme" />
      <Routes>
        <Route path="/onboarding" element={<SMEOnboardingPage onComplete={handleOnboardingComplete} user={user} />} />
        <Route path="/dashboard" element={<SMEDashboardWrapper user={user} />} />
        <Route path="/profile" element={<SMEProfilePage user={user} />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/lenders" element={<LendersPage />} />
        <Route path="/pitches" element={<PitchesPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/escrow" element={<EscrowPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/" element={<SMEDashboardWrapper user={user} />} />
      </Routes>
    </div>
  );
};

// Individual page components
const SMEDashboardWrapper = ({ user }) => <SMEDashboard user={user} />;

const ApplicationsPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-pulse-navy dark:text-white">Loan Applications</h1>
      <button className="px-6 py-3 pulse-gradient-bg text-white rounded-lg font-semibold flex items-center gap-2">
        <span className="material-symbols-outlined">add</span>
        Create New Application
      </button>
    </div>
    <LoanApplicationForm onComplete={() => {}} />
  </div>
);

const LendersPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <LenderMarketplace loanApplications={[]} onPitchSubmitted={() => {}} />
  </div>
);

const PitchesPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-pulse-navy dark:text-white mb-8">My Pitches</h1>
    <div className="bg-white dark:bg-pulse-navy rounded-xl p-12 text-center shadow-soft">
      <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">send</span>
      <h3 className="text-xl font-bold text-pulse-dark dark:text-white mb-2">No Pitches Sent</h3>
      <p className="text-gray-500">Create a loan application and start pitching to lenders</p>
    </div>
  </div>
);

const OffersPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <OffersManagement />
  </div>
);

const EscrowPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <SMEEscrowDashboard />
  </div>
);

const MessagesPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <CommunicationCenter />
  </div>
);

export default SMEApp;