import { useState } from 'react';
import { motion } from 'framer-motion';

const MonoConnection = ({ data, onComplete, onBack, canGoBack }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState(null);
  const [error, setError] = useState('');

  // Mock Mono Connect integration - replace with actual Mono SDK
  const handleConnectBank = async () => {
    setIsConnecting(true);
    setError('');

    try {
      // Simulate Mono connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const mockMonoData = {
        accountId: 'mono_acc_' + Math.random().toString(36).substr(2, 9),
        accountName: data.businessInfo?.businessName || 'Business Account',
        accountNumber: '0123456789',
        bankName: 'First Bank of Nigeria',
        balance: Math.floor(Math.random() * 1000000) + 50000,
        connectedAt: new Date().toISOString()
      };

      setConnectionResult({
        success: true,
        data: mockMonoData
      });
    } catch (err) {
      setError('Failed to connect bank account. Please try again.');
      setConnectionResult({ success: false, data: null });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleContinue = () => {
    if (!connectionResult?.success) {
      setError('Please connect your bank account to continue.');
      return;
    }

    onComplete({ 
      monoData: connectionResult.data 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <motion.div
      className="bg-white dark:bg-pulse-dark rounded-xl shadow-soft p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-pulse-navy dark:text-white mb-2">
          Connect Your Bank Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Securely connect your business bank account to verify financial data
        </p>
      </div>

      <div className="space-y-6">
        {/* Security Notice */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-green-600 mt-0.5">security</span>
            <div className="text-sm text-green-800 dark:text-green-200">
              <p className="font-medium mb-1">Bank-Level Security</p>
              <p>We use Mono's secure API to connect your bank account. Your login credentials are never stored, and all data is encrypted end-to-end.</p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {!connectionResult && (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-pulse-cyan/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-pulse-cyan text-3xl">
                account_balance
              </span>
            </div>
            <h3 className="text-lg font-semibold text-pulse-navy dark:text-white mb-2">
              Ready to Connect Your Bank
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click below to securely link your business bank account
            </p>
            
            <motion.button
              onClick={handleConnectBank}
              disabled={isConnecting}
              className="px-8 py-3 pulse-gradient-bg text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: !isConnecting ? 1.05 : 1 }}
              whileTap={{ scale: !isConnecting ? 0.95 : 1 }}
            >
              {isConnecting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                'Connect Bank Account'
              )}
            </motion.button>
          </div>
        )}

        {/* Connection Success */}
        {connectionResult?.success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-green-600 text-2xl">
                check_circle
              </span>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Bank Account Connected Successfully!
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-green-700 dark:text-green-300 font-medium">Account Name</p>
                <p className="text-green-800 dark:text-green-200">{connectionResult.data.accountName}</p>
              </div>
              <div>
                <p className="text-green-700 dark:text-green-300 font-medium">Bank</p>
                <p className="text-green-800 dark:text-green-200">{connectionResult.data.bankName}</p>
              </div>
              <div>
                <p className="text-green-700 dark:text-green-300 font-medium">Account Number</p>
                <p className="text-green-800 dark:text-green-200">***{connectionResult.data.accountNumber.slice(-4)}</p>
              </div>
              <div>
                <p className="text-green-700 dark:text-green-300 font-medium">Current Balance</p>
                <p className="text-green-800 dark:text-green-200 font-semibold">
                  {formatCurrency(connectionResult.data.balance)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Connection Failed */}
        {connectionResult?.success === false && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center"
          >
            <span className="material-symbols-outlined text-red-600 text-3xl mb-3 block">
              error
            </span>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Connection Failed
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">
              We couldn't connect to your bank account. Please try again.
            </p>
            <motion.button
              onClick={handleConnectBank}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}

        {/* What happens next */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• We'll analyze your transaction history and cash flow patterns</li>
            <li>• Your financial data will be cross-checked with your business information</li>
            <li>• A Pulse Score and Profit Score will be generated based on our analysis</li>
            <li>• You'll receive personalized recommendations to improve your scores</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600">error</span>
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between pt-8">
        {canGoBack && (
          <motion.button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
        )}
        
        <motion.button
          type="button"
          onClick={handleContinue}
          disabled={!connectionResult?.success}
          className="ml-auto px-8 py-3 pulse-gradient-bg text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: connectionResult?.success ? 1.02 : 1 }}
          whileTap={{ scale: connectionResult?.success ? 0.98 : 1 }}
        >
          Complete Setup
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MonoConnection;