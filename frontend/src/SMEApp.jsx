import { useState } from 'react';
import { SMEOnboardingPage, SMEDashboardPage } from './sme';

const SMEApp = () => {
  const [currentView, setCurrentView] = useState('onboarding'); // 'onboarding' | 'dashboard'
  const [smeData, setSmeData] = useState(null);

  const handleOnboardingComplete = (data) => {
    setSmeData(data);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'onboarding' && (
        <SMEOnboardingPage onComplete={handleOnboardingComplete} />
      )}
      {currentView === 'dashboard' && (
        <SMEDashboardPage smeData={smeData} />
      )}
    </div>
  );
};

export default SMEApp;