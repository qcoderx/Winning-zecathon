import { Routes, Route, useNavigate } from 'react-router-dom';
import AppNavigation from './components/AppNavigation';
import Breadcrumb from './components/Breadcrumb';
import QuickAccess from './components/QuickAccess';
import { SMEOnboardingPage } from './sme';
import SMEProfilePage from './sme/components/SMEProfilePage';
import LenderMarketplace from './sme/components/LenderMarketplace';
import LoanApplicationForm from './sme/components/LoanApplicationForm';
import SMEDashboard from './sme/components/SMEDashboard';

const SMEApp = () => {
  const navigate = useNavigate();

  const handleOnboardingComplete = (data) => {
    navigate('/sme/dashboard');
  };

  return (
    <div className="min-h-screen bg-pulse-neutral-light dark:bg-pulse-dark">
      <AppNavigation userType="sme" />
      <Breadcrumb userType="sme" />
      <Routes>
        <Route path="/onboarding" element={<SMEOnboardingPage onComplete={handleOnboardingComplete} />} />
        <Route path="/dashboard" element={<SMEDashboardWrapper />} />
        <Route path="/profile" element={<SMEProfilePage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/lenders" element={<LendersPage />} />
        <Route path="/pitches" element={<PitchesPage />} />
        <Route path="/" element={<SMEDashboardWrapper />} />
      </Routes>
    </div>
  );
};

// Individual page components
const SMEDashboardWrapper = () => <SMEDashboard />;

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

export default SMEApp;