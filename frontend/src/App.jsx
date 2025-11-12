import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Process from './components/Process';
import Opportunities from './components/Opportunities';
import Footer from './components/Footer';
import UserTypeSelector from './components/UserTypeSelector';
import { AuthPage } from './auth';
import { MarketplacePage } from './marketplace';
import SMEApp from './SMEApp';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'userType', 'auth', 'marketplace', 'sme'
  const [selectedUserType, setSelectedUserType] = useState(null);

  const handleAuthClick = (userType = null) => {
    if (userType === 'sme') {
      setCurrentView('sme');
    } else if (userType) {
      setSelectedUserType(userType);
      setCurrentView('auth');
    } else {
      setCurrentView('userType');
    }
  };

  const handleMarketplaceClick = () => {
    console.log('Marketplace button clicked!');
    setCurrentView('marketplace');
  };

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType);
    if (userType === 'sme') {
      setCurrentView('sme');
    } else {
      setCurrentView('auth');
    }
  };

  const handleLoginSuccess = () => {
    console.log('Login successful, redirecting to marketplace');
    if (selectedUserType === 'sme') {
      setCurrentView('sme');
    } else {
      setCurrentView('marketplace');
    }
  };

  // Set global login success handler
  window.onLoginSuccess = handleLoginSuccess;

  if (currentView === 'userType') {
    return <UserTypeSelector onUserTypeSelect={handleUserTypeSelect} />;
  }

  if (currentView === 'auth') {
    return <AuthPage />;
  }

  if (currentView === 'marketplace') {
    return <MarketplacePage />;
  }

  if (currentView === 'sme') {
    return <SMEApp />;
  }

  return (
    <div className="relative w-full overflow-x-hidden">
      <Header onAuthClick={handleAuthClick} />
      <main>
        <Hero onAuthClick={handleAuthClick} />
        <Features />
        <Process />
        <Opportunities onAuthClick={handleAuthClick} />
      </main>
      <Footer />
    </div>
  );
}

export default App;