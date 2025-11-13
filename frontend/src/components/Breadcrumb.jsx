import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const Breadcrumb = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    const breadcrumbs = [
      { label: 'Home', path: userType === 'sme' ? '/sme/dashboard' : '/lender/dashboard', icon: 'home' }
    ];

    if (userType === 'sme') {
      if (path.includes('/profile')) {
        breadcrumbs.push({ label: 'My Profile', path: '/sme/profile', icon: 'person' });
      } else if (path.includes('/applications')) {
        breadcrumbs.push({ label: 'Loan Applications', path: '/sme/applications', icon: 'request_quote' });
      } else if (path.includes('/lenders')) {
        breadcrumbs.push({ label: 'Find Lenders', path: '/sme/lenders', icon: 'search' });
      } else if (path.includes('/pitches')) {
        breadcrumbs.push({ label: 'My Pitches', path: '/sme/pitches', icon: 'send' });
      } else if (path.includes('/onboarding')) {
        breadcrumbs.push({ label: 'Onboarding', path: '/sme/onboarding', icon: 'how_to_reg' });
      }
    } else if (userType === 'lender') {
      if (path.includes('/profile')) {
        breadcrumbs.push({ label: 'My Profile', path: '/lender/profile', icon: 'person' });
      } else if (path.includes('/applications')) {
        breadcrumbs.push({ label: 'Applications', path: '/lender/applications', icon: 'inbox' });
      } else if (path.includes('/offers')) {
        breadcrumbs.push({ label: 'My Offers', path: '/lender/offers', icon: 'handshake' });
      } else if (path.includes('/portfolio')) {
        breadcrumbs.push({ label: 'Portfolio', path: '/lender/portfolio', icon: 'account_balance_wallet' });
      } else if (path.includes('/marketplace')) {
        breadcrumbs.push({ label: 'SME Marketplace', path: '/marketplace', icon: 'store' });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-pulse-navy border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center">
              {index > 0 && (
                <span className="material-symbols-outlined text-gray-400 mx-2">
                  chevron_right
                </span>
              )}
              <motion.button
                onClick={() => navigate(crumb.path)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                  index === breadcrumbs.length - 1
                    ? 'text-pulse-cyan font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:text-pulse-cyan'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined text-sm">{crumb.icon}</span>
                {crumb.label}
              </motion.button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;