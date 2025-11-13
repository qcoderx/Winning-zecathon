import { useState } from 'react';
import { motion } from 'framer-motion';

const LenderProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'account_balance' },
    { id: 'investment', label: 'Investment Criteria', icon: 'filter_list' },
    { id: 'portfolio', label: 'Portfolio', icon: 'business_center' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-pulse-neutral-light dark:bg-pulse-dark">
      {/* Header */}
      <div className="bg-white dark:bg-pulse-navy shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop" 
                  alt="Pulse Capital"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-pulse-navy dark:text-white">Pulse Capital</h1>
                <p className="text-gray-600 dark:text-gray-400">Venture Capital • Lagos, Nigeria</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">Verified Lender</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Success Rate:</span>
                    <span className="text-sm font-bold text-pulse-green">78%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Total Deployed:</span>
                    <span className="text-sm font-bold text-pulse-cyan">₦2.8B</span>
                  </div>
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
        {activeTab === 'overview' && <OverviewTab isEditing={isEditing} />}
        {activeTab === 'investment' && <InvestmentTab isEditing={isEditing} />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

const OverviewTab = ({ isEditing }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-6">
      {/* Company Information */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
            {isEditing ? (
              <input type="text" defaultValue="Pulse Capital" className="w-full px-3 py-2 border rounded-lg" />
            ) : (
              <p className="text-pulse-dark dark:text-white">Pulse Capital</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lender Type</label>
            {isEditing ? (
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Venture Capital</option>
                <option>Private Equity</option>
                <option>Commercial Bank</option>
                <option>Impact Fund</option>
              </select>
            ) : (
              <p className="text-pulse-dark dark:text-white">Venture Capital</p>
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
              <input type="text" defaultValue="2018" className="w-full px-3 py-2 border rounded-lg" />
            ) : (
              <p className="text-pulse-dark dark:text-white">2018</p>
            )}
          </div>
        </div>
      </div>

      {/* Investment Thesis */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Investment Thesis</h3>
        {isEditing ? (
          <textarea 
            rows={4} 
            defaultValue="We fund post-revenue SMEs in the technology and healthcare space with proven market traction and strong growth potential."
            className="w-full px-3 py-2 border rounded-lg resize-none"
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We fund post-revenue SMEs in the technology and healthcare space with proven market traction and strong growth potential. Our focus is on businesses that demonstrate clear scalability and have the potential to create significant impact in their respective markets.
          </p>
        )}
      </div>

      {/* Team Information */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Leadership Team</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pulse-cyan/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-pulse-cyan">person</span>
            </div>
            <div>
              <h4 className="font-semibold text-pulse-dark dark:text-white">Alex Morgan</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Managing Partner</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pulse-pink/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-pulse-pink">person</span>
            </div>
            <div>
              <h4 className="font-semibold text-pulse-dark dark:text-white">Sarah Johnson</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Investment Director</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Sidebar */}
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Performance Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">SMEs Funded</span>
            <span className="font-bold text-pulse-cyan">45</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
            <span className="font-bold text-pulse-green">78%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Avg Response</span>
            <span className="font-bold text-pulse-pink">2 days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Deployed</span>
            <span className="font-bold text-pulse-navy dark:text-white">₦2.8B</span>
          </div>
        </div>
      </div>

      {/* Industry Focus */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Industry Focus</h3>
        <div className="flex flex-wrap gap-2">
          {['FinTech', 'AgriTech', 'HealthTech'].map((industry) => (
            <span key={industry} className="px-3 py-1 bg-pulse-cyan/10 text-pulse-cyan rounded-full text-sm font-medium">
              {industry}
            </span>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Contact</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-400">email</span>
            <span className="text-sm">invest@pulsecapital.ng</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-400">phone</span>
            <span className="text-sm">+234 901 234 5678</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-400">language</span>
            <span className="text-sm">www.pulsecapital.ng</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InvestmentTab = ({ isEditing }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="space-y-6">
      {/* Investment Terms */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Typical Investment Terms</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Loan Amount</label>
            {isEditing ? (
              <input type="text" defaultValue="₦1,000,000" className="w-full px-3 py-2 border rounded-lg" />
            ) : (
              <p className="text-pulse-dark dark:text-white">₦1,000,000</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Loan Amount</label>
            {isEditing ? (
              <input type="text" defaultValue="₦50,000,000" className="w-full px-3 py-2 border rounded-lg" />
            ) : (
              <p className="text-pulse-dark dark:text-white">₦50,000,000</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interest Range</label>
            {isEditing ? (
              <input type="text" defaultValue="12-25%" className="w-full px-3 py-2 border rounded-lg" />
            ) : (
              <p className="text-pulse-dark dark:text-white">12-25%</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tenure Range</label>
            {isEditing ? (
              <input type="text" defaultValue="6-24 months" className="w-full px-3 py-2 border rounded-lg" />
            ) : (
              <p className="text-pulse-dark dark:text-white">6-24 months</p>
            )}
          </div>
        </div>
      </div>

      {/* Investment Requirements */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Investment Requirements</h3>
        <div className="space-y-3">
          {[
            'Minimum 2 years in business',
            'Verified revenue streams',
            'Strong management team',
            'Clear growth strategy',
            'Market validation'
          ].map((requirement, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-pulse-green text-sm">check_circle</span>
              <span className="text-sm">{requirement}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="space-y-6">
      {/* Preferred Industries */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Preferred Industries</h3>
        <div className="space-y-3">
          {[
            { name: 'FinTech', percentage: 40 },
            { name: 'HealthTech', percentage: 30 },
            { name: 'AgriTech', percentage: 20 },
            { name: 'EdTech', percentage: 10 }
          ].map((industry, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{industry.name}</span>
                <span className="text-sm">{industry.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-pulse-cyan h-2 rounded-full" 
                  style={{ width: `${industry.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Focus */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Geographic Focus</h3>
        <div className="space-y-2">
          {['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'].map((location) => (
            <div key={location} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-pulse-pink text-sm">location_on</span>
              <span className="text-sm">{location}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PortfolioTab = () => (
  <div className="space-y-6">
    {/* Portfolio Overview */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft text-center">
        <div className="text-3xl font-bold text-pulse-cyan mb-2">45</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Investments</div>
      </div>
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft text-center">
        <div className="text-3xl font-bold text-pulse-green mb-2">₦2.8B</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Deployed</div>
      </div>
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft text-center">
        <div className="text-3xl font-bold text-pulse-pink mb-2">18.5%</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Avg ROI</div>
      </div>
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft text-center">
        <div className="text-3xl font-bold text-pulse-navy dark:text-white mb-2">12</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Active Investments</div>
      </div>
    </div>

    {/* Current Investments */}
    <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
      <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Current Portfolio</h3>
      <div className="space-y-4">
        {[
          { name: 'TechFlow Solutions', amount: '₦15M', roi: '22%', status: 'Performing', industry: 'FinTech' },
          { name: 'Green Agro Ltd', amount: '₦8M', roi: '18%', status: 'Performing', industry: 'AgriTech' },
          { name: 'HealthTech Innovations', amount: '₦12M', roi: '15%', status: 'Watch', industry: 'HealthTech' },
          { name: 'EduLearn Platform', amount: '₦6M', roi: '25%', status: 'Performing', industry: 'EdTech' }
        ].map((investment, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pulse-cyan/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-pulse-cyan text-sm">business</span>
              </div>
              <div>
                <h4 className="font-semibold text-pulse-dark dark:text-white">{investment.name}</h4>
                <p className="text-sm text-gray-500">{investment.industry} • {investment.amount}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-pulse-green">{investment.roi} ROI</div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                investment.status === 'Performing' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {investment.status}
              </span>
            </div>
          </div>
        ))}
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
            <input type="email" defaultValue="invest@pulsecapital.ng" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input type="tel" defaultValue="+234 901 234 5678" className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>
      </div>

      {/* Investment Preferences */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl p-6 shadow-soft">
        <h3 className="text-lg font-bold text-pulse-dark dark:text-white mb-4">Investment Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Auto-approve qualified SMEs</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pulse-cyan"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Receive pitch notifications</span>
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
            <span className="text-sm">New SME Applications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pulse-cyan"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Portfolio Updates</span>
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

export default LenderProfilePage;