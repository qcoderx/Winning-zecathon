import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Process from './components/Process';
import Opportunities from './components/Opportunities';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { AuthPage } from './auth';
import { MarketplacePage, SMEProfilePage } from './marketplace';
import { LoadingProvider } from './contexts/LoadingContext';
import './App.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/auth');
  };

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
};

const AuthPageWrapper = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/marketplace');
  };

  window.onLoginSuccess = handleLoginSuccess;

  return <AuthPage />;
};

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingProvider>
      <AnimatePresence mode="wait">
        {isInitialLoading ? (
          <LoadingScreen 
            variant="splash"
            message="Initializing PulseFi..."
            key="splash"
          />
        ) : (
          <Router key="app">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPageWrapper />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/profile/:id" element={<SMEProfilePage />} />
            </Routes>
          </Router>
        )}
      </AnimatePresence>
    </LoadingProvider>
  );
}

export default App;