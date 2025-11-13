import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VerificationModal from './VerificationModal';

const SMEProfilePage = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [isEditing, setIsEditing] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationState, setVerificationState] = useState('unverified');
  const [pulseScore, setPulseScore] = useState(null);
  const [profitScore, setProfitScore] = useState(null);

  // Check verification status on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sme_verification_state');
    const savedPulseScore = localStorage.getItem('sme_pulse_score');
    const savedProfitScore = localStorage.getItem('sme_profit_score');
    
    if (savedState) {
      setVerificationState(savedState);
      if (savedPulseScore) setPulseScore(parseInt(savedPulseScore));
      if (savedProfitScore) setProfitScore(parseInt(savedProfitScore));
    }
  }, []);

  const handleVerificationComplete = () => {
    // Refresh verification status
    const savedState = localStorage.getItem('sme_verification_state');
    const savedPulseScore = localStorage.getItem('sme_pulse_score');
    const savedProfitScore = localStorage.getItem('sme_profit_score');
    
    if (savedState) {
      setVerificationState(savedState);
      if (savedPulseScore) setPulseScore(parseInt(savedPulseScore));
      if (savedProfitScore) setProfitScore(parseInt(savedProfitScore));
    }
  };

  const tabs = [
    { id: 'business', label: 'Business Info', icon: 'business' },
    { id: 'verification', label: 'Verification', icon: 'verified' },
    { id: 'financial', label: 'Financial Data', icon: 'account_balance' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-pulse-neutral-light dark:bg-pulse-dark">
      {/* Header */}
      <div className="bg-white dark:bg-pulse-navy shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-pulse-cyan/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-pulse-cyan text-3xl">business</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-pulse-navy dark:text-white">TechFlow Solutions</h1>
                <p className="text-gray-600 dark:text-gray-400">FinTech • Lagos, Nigeria</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      verificationState === 'verified' ? 'bg-green-500' :
                      verificationState === 'pending' ? 'bg-yellow-500' :
                      verificationState === 'failed' ? 'bg-red-500' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      verificationState === 'verified' ? 'text-green-600' :
                      verificationState === 'pending' ? 'text-yellow-600' :
                      verificationState === 'failed' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {verificationState === 'verified' ? 'Verified Business' :
                       verificationState === 'pending' ? 'Verification Pending' :
                       verificationState === 'failed' ? 'Verification Failed' : 'Unverified Business'}
                    </span>
                  </div>
                  {verificationState === 'verified' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Pulse Score:</span>
                        <span className="text-sm font-bold text-pulse-cyan">{pulseScore}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Profit Score:</span>
                        <span className="text-sm font-bold text-pulse-pink">{profitScore}</span>
                      </div>
                    </>
                  ) : (
                    <motion.button
                      onClick={() => setShowVerificationModal(true)}
                      className="text-sm text-pulse-cyan hover:text-pulse-cyan/80 font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      {verificationState === 'failed' ? 'Retry Verification' : 'Complete Verification'}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 pulse-gradient-bg text-white rounded-lg font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="material-symbols-outlined">{isEditing ? 'save' : 'edit'}</span>
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-pulse-navy border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-pulse-cyan text-pulse-cyan'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ y: -2 }}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'business' && <BusinessInfoTab isEditing={isEditing} />}
        {activeTab === 'verification' && (
          <VerificationTab 
            verificationState={verificationState}
            pulseScore={pulseScore}
            profitScore={profitScore}
            onStartVerification={() => setShowVerificationModal(true)}
          />
        )}
        {activeTab === 'financial' && <FinancialTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
      
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onComplete={handleVerificationComplete}
      />
    </div>
  );
};

const BusinessInfoTab = ({ isEditing }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-6">
      {/* Basic Information */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
            {isEditing ? (
              <input type="text" defaultValue="TechFlow Solutions" className="w-full px-3 py-2 border rounded-lg" />
            ) : (
              <p className="text-pulse-dark dark:text-white">TechFlow Solutions</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</label>
            {isEditing ? (
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>FinTech</option>
                <option>AgriTech</option>
                <option>HealthTech</option>
              </select>
            ) : (
              <p className="text-pulse-dark dark:text-white">FinTech</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
            {isEditing ? (
              <input type="text" defaultValue="Lagos, Nigeria" className="w-full px-3 py-2 border rounded-lg" />
            ) : (
              <p className="text-pulse-dark dark:text-white">Lagos, Nigeria</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Founded</label>
            {isEditing ? (
              <input type="text" defaultValue="2020" className="w-full px-3 py-2 border rounded-lg" />
            ) : (
              <p className="text-pulse-dark dark:text-white">2020</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Description */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Business Description</h3>
        {isEditing ? (
          <textarea 
            rows={4} 
            defaultValue="TechFlow Solutions is a leading FinTech company specializing in mobile payment solutions for underbanked populations in Nigeria."
            className="w-full px-3 py-2 border rounded-lg resize-none"
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            TechFlow Solutions is a leading FinTech company specializing in mobile payment solutions for underbanked populations in Nigeria. We provide innovative digital financial services that enable seamless transactions and financial inclusion.
          </p>
        )}
      </div>

      {/* Team Information */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Team & Leadership</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pulse-cyan/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-pulse-cyan">person</span>
            </div>
            <div>
              <h4 className="font-semibold text-pulse-dark dark:text-white">Adebayo Ogundimu</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Founder & CEO</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Team Size:</span>
              <span className="font-medium text-pulse-dark dark:text-white ml-2">45-60 employees</span>
            </div>
            <div>
              <span className="text-gray-500">Experience:</span>
              <span className="font-medium text-pulse-dark dark:text-white ml-2">4 years</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Sidebar */}
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Revenue (Annual)</span>
            <span className="font-bold text-pulse-green">₦2.5B</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Growth Rate</span>
            <span className="font-bold text-pulse-cyan">+35%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Funding Stage</span>
            <span className="font-bold text-pulse-pink">Series A</span>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Verification Status</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <span className="text-sm">Business Registration</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <span className="text-sm">Bank Account Verified</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <span className="text-sm">Video Verification</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <span className="text-sm">AI Analysis Complete</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const VerificationTab = ({ verificationState, pulseScore, profitScore, onStartVerification }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {verificationState === 'unverified' || verificationState === 'failed' ? (
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-pulse-navy rounded-xl p-8 shadow-soft text-center">
          <div className="w-20 h-20 pulse-gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-white text-3xl">shield</span>
          </div>
          <h3 className="text-2xl font-bold text-pulse-navy dark:text-white mb-2">
            {verificationState === 'failed' ? 'Verification Failed' : 'Complete Your Verification'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {verificationState === 'failed' 
              ? 'Your verification failed. Please review your information and try again.'
              : 'Generate your Pulse and Profit scores to unlock funding opportunities'}
          </p>
          <motion.button
            onClick={onStartVerification}
            className="px-6 py-3 pulse-gradient-bg text-white rounded-lg font-semibold"
            whileHover={{ scale: 1.02 }}
          >
            {verificationState === 'failed' ? 'Retry Verification' : 'Start Verification'}
          </motion.button>
        </div>
      </div>
    ) : verificationState === 'pending' ? (
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-pulse-navy rounded-xl p-8 shadow-soft text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-yellow-600 text-3xl">hourglass_empty</span>
          </div>
          <h3 className="text-2xl font-bold text-pulse-navy dark:text-white mb-2">Verification in Progress</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're analyzing your business data to generate your Pulse and Profit scores. This usually takes a few minutes.
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pulse-cyan"></div>
            <span className="text-pulse-cyan font-medium">Processing...</span>
          </div>
        </div>
      </div>
    ) : (
      <>
        <div className="space-y-6">
          {/* Pulse Score */}
          <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Pulse Score Breakdown</h3>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-pulse-cyan mb-2">{pulseScore}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Authenticity Score</div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Business Registration', score: 95, icon: 'description' },
                { label: 'Bank Verification', score: 88, icon: 'account_balance' },
                { label: 'Video Analysis', score: 94, icon: 'videocam' },
                { label: 'Data Consistency', score: 91, icon: 'fact_check' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-pulse-cyan">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm font-bold">{item.score}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-pulse-cyan h-2 rounded-full" 
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profit Score */}
          <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Profit Score Analysis</h3>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-pulse-pink mb-2">{profitScore}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Financial Health Score</div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Revenue Growth', score: 88, icon: 'trending_up' },
                { label: 'Cash Flow', score: 82, icon: 'account_balance_wallet' },
                { label: 'Profitability', score: 85, icon: 'payments' },
                { label: 'Market Position', score: 87, icon: 'business_center' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-pulse-pink">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm font-bold">{item.score}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-pulse-pink h-2 rounded-full" 
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )}
  </div>
);

const FinancialTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-6">
      {/* Financial Overview */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Financial Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-pulse-green">₦2.5B</div>
            <div className="text-sm text-gray-500">Annual Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pulse-cyan">₦450M</div>
            <div className="text-sm text-gray-500">Net Profit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pulse-pink">18%</div>
            <div className="text-sm text-gray-500">Profit Margin</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pulse-navy dark:text-white">₦1.2B</div>
            <div className="text-sm text-gray-500">Cash Flow</div>
          </div>
        </div>
      </div>

      {/* Bank Connection */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Connected Bank Accounts</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">account_balance</span>
              </div>
              <div>
                <h4 className="font-semibold">First Bank Nigeria</h4>
                <p className="text-sm text-gray-500">Business Account - ****1234</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Connected</span>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      {/* AI Insights */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">AI Financial Insights</h3>
        <div className="space-y-3">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-green-600 text-sm">trending_up</span>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">Strong Growth</span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">35% YoY revenue growth indicates healthy business expansion</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-blue-600 text-sm">lightbulb</span>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Opportunity</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">Consider expanding to new markets for accelerated growth</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" defaultValue="founder@techflow.ng" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input type="tel" defaultValue="+234 801 234 5678" className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Profile Visibility</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pulse-cyan"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Allow Direct Messages</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pulse-cyan"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Investment Offers</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pulse-cyan"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Score Updates</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pulse-cyan"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SMEProfilePage;