import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const AppNavigation = ({ userType = 'guest' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [verificationState, setVerificationState] = useState('unverified');
  const navigate = useNavigate();
  const location = useLocation();

  // Check verification status for SME users
  useEffect(() => {
    if (userType === 'sme') {
      const savedState = localStorage.getItem('sme_verification_state');
      if (savedState) {
        setVerificationState(savedState);
      }
    }
  }, [userType]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const getNavItems = () => {
    if (userType === 'sme') {
      return [
        { path: '/sme/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/sme/applications', label: 'Applications', icon: 'request_quote' },
        { path: '/sme/lenders', label: 'Find Lenders', icon: 'search' },
        { path: '/sme/offers', label: 'Investment Offers', icon: 'handshake' },
        { path: '/sme/escrow', label: 'Escrow Management', icon: 'account_balance' },
        { path: '/sme/messages', label: 'Messages', icon: 'chat' },
        { path: '/sme/profile', label: 'My Profile', icon: 'person' }
      ];
    } else if (userType === 'lender') {
      return [
        { path: '/lender/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/marketplace', label: 'SME Marketplace', icon: 'store' },
        { path: '/lender/applications', label: 'Applications', icon: 'inbox' },
        { path: '/lender/offers', label: 'My Offers', icon: 'handshake' },
        { path: '/lender/portfolio', label: 'Portfolio', icon: 'account_balance_wallet' },
        { path: '/lender/profile', label: 'My Profile', icon: 'person' }
      ];
    }
    return [
      { path: '/', label: 'Home', icon: 'home' },
      { path: '/auth', label: 'Login', icon: 'login' }
    ];
  };

  const navItems = getNavItems();
  const currentPath = location.pathname;

  if (userType === 'guest') {
    return null; // Don't show navigation for guests
  }

  return (
    <div className="bg-white dark:bg-pulse-navy shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavigation(userType === 'sme' ? '/sme/dashboard' : '/lender/dashboard')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8">
              <img src="/pulsi-logo-removebg-preview.png" alt="PulseFi" className="w-full h-full" />
            </div>
            <span className="text-xl font-bold text-pulse-navy dark:text-white">PulseFi</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === item.path || currentPath.startsWith(item.path)
                    ? 'bg-pulse-cyan/10 text-pulse-cyan'
                    : 'text-gray-600 dark:text-gray-300 hover:text-pulse-cyan hover:bg-pulse-cyan/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* User Type Badge with Verification Status */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-pulse-cyan/10 text-pulse-cyan rounded-full text-sm font-medium">
                <span className="material-symbols-outlined text-sm">
                  {userType === 'sme' ? 'business' : 'account_balance'}
                </span>
                {userType === 'sme' ? 'SME' : 'Lender'}
              </div>
              
              {/* Verification Badge for SME */}
              {userType === 'sme' && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  verificationState === 'verified' 
                    ? 'bg-green-100 text-green-700'
                    : verificationState === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : verificationState === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <span className="material-symbols-outlined text-xs">
                    {verificationState === 'verified' ? 'verified' : 
                     verificationState === 'pending' ? 'hourglass_empty' :
                     verificationState === 'failed' ? 'error' : 'shield'}
                  </span>
                  {verificationState === 'verified' ? 'Verified' :
                   verificationState === 'pending' ? 'Pending' :
                   verificationState === 'failed' ? 'Failed' : 'Unverified'}
                </div>
              )}
            </div>

            {/* Profile & Logout */}
            <motion.button
              onClick={() => handleNavigation(userType === 'sme' ? '/sme/profile' : '/lender/profile')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-pulse-cyan rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined">person</span>
            </motion.button>

            <motion.button
              onClick={handleLogout}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined">logout</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-pulse-cyan rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === item.path || currentPath.startsWith(item.path)
                      ? 'bg-pulse-cyan/10 text-pulse-cyan'
                      : 'text-gray-600 dark:text-gray-300 hover:text-pulse-cyan hover:bg-pulse-cyan/5'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AppNavigation;