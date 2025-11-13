import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const PulseMonitoring = ({ smeId, loanId }) => {
  const [monitoringData, setMonitoringData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonitoringData();
  }, [smeId]);

  const fetchMonitoringData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        currentPulseScore: 87,
        previousPulseScore: 85,
        trend: 'improving',
        lastUpdated: '2024-11-12T10:30:00Z',
        businessHealth: {
          revenue: { current: 2800000, previous: 2500000, trend: 'up' },
          expenses: { current: 1900000, previous: 2000000, trend: 'down' },
          cashFlow: { current: 900000, previous: 500000, trend: 'up' },
          transactions: { current: 1250, previous: 1100, trend: 'up' }
        },
        riskFactors: [
          { factor: 'Payment Delays', level: 'low', score: 15 },
          { factor: 'Cash Flow Volatility', level: 'medium', score: 35 },
          { factor: 'Market Competition', level: 'low', score: 20 }
        ],
        recentActivities: [
          {
            id: 1,
            type: 'transaction',
            description: 'Large payment received from major client',
            amount: 450000,
            timestamp: '2024-11-12T08:15:00Z',
            impact: 'positive'
          },
          {
            id: 2,
            type: 'expense',
            description: 'Equipment purchase for expansion',
            amount: 280000,
            timestamp: '2024-11-11T14:30:00Z',
            impact: 'neutral'
          },
          {
            id: 3,
            type: 'milestone',
            description: 'Inventory milestone completed ahead of schedule',
            timestamp: '2024-11-10T16:45:00Z',
            impact: 'positive'
          }
        ]
      };

      const mockAlerts = [
        {
          id: 1,
          type: 'warning',
          title: 'Unusual Spending Pattern',
          description: 'Higher than normal expenses detected in the last 7 days',
          timestamp: '2024-11-12T09:00:00Z',
          severity: 'medium'
        },
        {
          id: 2,
          type: 'info',
          title: 'Revenue Growth',
          description: 'Monthly revenue increased by 12% compared to last month',
          timestamp: '2024-11-11T15:30:00Z',
          severity: 'low'
        }
      ];

      setMonitoringData(mockData);
      setAlerts(mockAlerts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'financial', label: 'Financial Health', icon: 'account_balance' },
    { id: 'activities', label: 'Recent Activities', icon: 'history' },
    { id: 'alerts', label: 'Alerts', icon: 'notifications' }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  // Mock chart data
  const pulseScoreHistory = [
    { month: 'Jul', score: 78 },
    { month: 'Aug', score: 82 },
    { month: 'Sep', score: 79 },
    { month: 'Oct', score: 85 },
    { month: 'Nov', score: 87 }
  ];

  const financialData = [
    { month: 'Jul', revenue: 2200000, expenses: 1800000 },
    { month: 'Aug', revenue: 2400000, expenses: 1900000 },
    { month: 'Sep', revenue: 2300000, expenses: 1850000 },
    { month: 'Oct', revenue: 2500000, expenses: 2000000 },
    { month: 'Nov', revenue: 2800000, expenses: 1900000 }
  ];

  const riskDistribution = monitoringData?.riskFactors.map(factor => ({
    name: factor.factor,
    value: factor.score,
    color: factor.level === 'high' ? '#ef4444' : factor.level === 'medium' ? '#f59e0b' : '#10b981'
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-pulse-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-pulse-cyan text-2xl">monitoring</span>
            <div>
              <h3 className="text-lg font-bold text-pulse-dark dark:text-white">
                Pulse Monitoring Dashboard
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time business health tracking and risk assessment
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Last Updated</div>
            <div className="text-sm font-medium text-pulse-dark dark:text-white">
              {new Date(monitoringData.lastUpdated).toLocaleString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-pulse-cyan text-pulse-cyan'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.id === 'alerts' && alerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Current Pulse Score */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-pulse-cyan mb-2">
                        {monitoringData.currentPulseScore}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Current Pulse Score</div>
                      <div className={`flex items-center justify-center gap-1 mt-1 ${
                        monitoringData.currentPulseScore > monitoringData.previousPulseScore 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span className="material-symbols-outlined text-sm">
                          {monitoringData.currentPulseScore > monitoringData.previousPulseScore 
                            ? 'trending_up' : 'trending_down'}
                        </span>
                        <span className="text-xs">
                          {Math.abs(monitoringData.currentPulseScore - monitoringData.previousPulseScore)} pts
                        </span>
                      </div>
                    </div>
                    
                    {Object.entries(monitoringData.businessHealth).map(([key, data]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-pulse-dark dark:text-white mb-1">
                          {key === 'transactions' 
                            ? data.current.toLocaleString()
                            : `₦${(data.current / 1000000).toFixed(1)}M`
                          }
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div className={`flex items-center justify-center gap-1 mt-1 ${getTrendColor(data.trend)}`}>
                          <span className="material-symbols-outlined text-sm">
                            {getTrendIcon(data.trend)}
                          </span>
                          <span className="text-xs">
                            {Math.abs(((data.current - data.previous) / data.previous * 100)).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pulse Score Trend */}
                  <div>
                    <h4 className="text-lg font-semibold text-pulse-dark dark:text-white mb-4">
                      Pulse Score Trend
                    </h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={pulseScoreHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[70, 100]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#00c4b4" 
                            strokeWidth={3}
                            dot={{ fill: '#00c4b4', strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financial' && (
                <div className="space-y-6">
                  {/* Revenue vs Expenses */}
                  <div>
                    <h4 className="text-lg font-semibold text-pulse-dark dark:text-white mb-4">
                      Revenue vs Expenses
                    </h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financialData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                          <Bar dataKey="revenue" fill="#00c4b4" name="Revenue" />
                          <Bar dataKey="expenses" fill="#ff6b9d" name="Expenses" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Risk Distribution */}
                  <div>
                    <h4 className="text-lg font-semibold text-pulse-dark dark:text-white mb-4">
                      Risk Factor Distribution
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={riskDistribution}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                            >
                              {riskDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3">
                        {monitoringData.riskFactors.map((factor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="font-medium text-pulse-dark dark:text-white">
                                {factor.factor}
                              </p>
                              <p className={`text-sm capitalize ${
                                factor.level === 'high' ? 'text-red-600' :
                                factor.level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {factor.level} risk
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-pulse-cyan">
                                {factor.score}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activities' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-pulse-dark dark:text-white">
                    Recent Business Activities
                  </h4>
                  {monitoringData.recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.impact === 'positive' ? 'bg-green-100 dark:bg-green-900/20' :
                        activity.impact === 'negative' ? 'bg-red-100 dark:bg-red-900/20' :
                        'bg-blue-100 dark:bg-blue-900/20'
                      }`}>
                        <span className={`material-symbols-outlined ${
                          activity.impact === 'positive' ? 'text-green-600' :
                          activity.impact === 'negative' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {activity.type === 'transaction' ? 'payments' :
                           activity.type === 'expense' ? 'shopping_cart' :
                           'flag'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-pulse-dark dark:text-white">
                          {activity.description}
                        </p>
                        {activity.amount && (
                          <p className="text-sm text-pulse-cyan font-medium">
                            ₦{activity.amount.toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-pulse-dark dark:text-white">
                    Active Alerts & Notifications
                  </h4>
                  {alerts.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-gray-400 text-4xl mb-2 block">
                        notifications_off
                      </span>
                      <p className="text-gray-500">No active alerts</p>
                    </div>
                  ) : (
                    alerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined">
                            {getAlertIcon(alert.type)}
                          </span>
                          <div className="flex-1">
                            <h5 className="font-semibold mb-1">{alert.title}</h5>
                            <p className="text-sm mb-2">{alert.description}</p>
                            <p className="text-xs opacity-75">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PulseMonitoring;