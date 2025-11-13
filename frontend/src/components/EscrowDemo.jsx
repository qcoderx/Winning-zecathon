import { useState } from 'react';
import { motion } from 'framer-motion';
import EscrowDashboard from '../marketplace/components/EscrowDashboard';
import PulseMonitoring from '../marketplace/components/PulseMonitoring';
import InvestmentManagement from '../marketplace/components/InvestmentManagement';

const EscrowDemo = () => {
  const [activeDemo, setActiveDemo] = useState('investment');

  const demos = [
    { 
      id: 'investment', 
      label: 'Complete Investment Management', 
      icon: 'account_balance',
      description: 'Full investment dashboard with escrow, monitoring & communication'
    },
    { 
      id: 'escrow', 
      label: 'Escrow Management', 
      icon: 'account_balance_wallet',
      description: 'Milestone-based fund releases with evidence tracking'
    },
    { 
      id: 'monitoring', 
      label: 'Pulse Monitoring', 
      icon: 'monitoring',
      description: 'Real-time business health tracking and risk assessment'
    }
  ];

  // Mock investment data
  const mockInvestment = {
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
    <div className="min-h-screen bg-pulse-neutral-light dark:bg-pulse-dark">
      {/* Header */}
      <div className="bg-white dark:bg-pulse-navy shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-pulse-navy dark:text-white mb-2">
              PulseFi Escrow & Monitoring Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience our complete investment management ecosystem with secure escrow, 
              real-time monitoring, and milestone-based fund releases.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Navigation */}
      <div className="bg-white dark:bg-pulse-navy border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-8">
            {demos.map((demo) => (
              <motion.button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`flex flex-col items-center gap-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeDemo === demo.id
                    ? 'border-pulse-cyan text-pulse-cyan'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="material-symbols-outlined text-2xl">{demo.icon}</span>
                <div className="text-center">
                  <div className="font-semibold">{demo.label}</div>
                  <div className="text-xs text-gray-500 max-w-32">{demo.description}</div>
                </div>
              </motion.button>
            ))}
          </nav>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeDemo === 'investment' && (
            <InvestmentManagement investment={mockInvestment} />
          )}
          
          {activeDemo === 'escrow' && (
            <EscrowDashboard 
              loanId="loan_12345"
              smeId="sme_12345"
              lenderId="lender_67890"
            />
          )}
          
          {activeDemo === 'monitoring' && (
            <PulseMonitoring 
              smeId="sme_12345"
              loanId="loan_12345"
            />
          )}
        </motion.div>
      </div>

      {/* Features Highlight */}
      <div className="bg-white dark:bg-pulse-navy border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-pulse-navy dark:text-white mb-4">
              Complete Risk Mitigation Ecosystem
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform provides comprehensive tools for secure lending with milestone-based releases, 
              real-time monitoring, and transparent communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6"
              whileHover={{ y: -4 }}
            >
              <div className="w-16 h-16 bg-pulse-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-pulse-cyan text-2xl">
                  account_balance_wallet
                </span>
              </div>
              <h3 className="text-lg font-semibold text-pulse-dark dark:text-white mb-2">
                Secure Escrow
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Milestone-based fund releases with evidence verification and approval workflows
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              whileHover={{ y: -4 }}
            >
              <div className="w-16 h-16 bg-pulse-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-pulse-pink text-2xl">
                  monitoring
                </span>
              </div>
              <h3 className="text-lg font-semibold text-pulse-dark dark:text-white mb-2">
                Real-time Monitoring
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Continuous business health tracking with AI-powered risk assessment and alerts
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              whileHover={{ y: -4 }}
            >
              <div className="w-16 h-16 bg-pulse-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-pulse-green text-2xl">
                  chat
                </span>
              </div>
              <h3 className="text-lg font-semibold text-pulse-dark dark:text-white mb-2">
                Direct Communication
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Structured feedback loops and milestone-based communication between lenders and SMEs
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowDemo;