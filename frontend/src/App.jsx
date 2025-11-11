import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Process from './components/Process';
import Opportunities from './components/Opportunities';
import Footer from './components/Footer';
import { AuthPage } from './auth';
import './App.css';

function App() {
  const [showAuth, setShowAuth] = useState(false);

  const handleAuthClick = () => {
    console.log('Auth button clicked!');
    setShowAuth(true);
  };

  if (showAuth) {
    return <AuthPage />;
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