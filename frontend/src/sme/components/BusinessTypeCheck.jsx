import { useState } from 'react';
import { motion } from 'framer-motion';

const BusinessTypeCheck = ({ data, onComplete, onBack, canGoBack }) => {
  const [isSaaS, setIsSaaS] = useState(data.isSaaS || false);

  const handleContinue = () => {
    onComplete({ isSaaS });
  };

  return (
    <motion.div
      className="bg-white dark:bg-pulse-dark rounded-xl shadow-soft p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-pulse-navy dark:text-white mb-2">
          Business Type Classification
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help us understand your business model to customize the verification process
        </p>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-pulse-navy dark:text-white mb-4">
            Is your business a Software as a Service (SaaS) company?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <motion.button
              type="button"
              onClick={() => setIsSaaS(false)}
              className={`p-6 rounded-xl border-2 transition-all ${
                !isSaaS
                  ? 'border-pulse-cyan bg-pulse-cyan/10 text-pulse-navy dark:text-white'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-3xl">
                  storefront
                </span>
                <div>
                  <h4 className="font-semibold">Physical/Traditional Business</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Retail, manufacturing, services with physical presence
                  </p>
                </div>
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setIsSaaS(true)}
              className={`p-6 rounded-xl border-2 transition-all ${
                isSaaS
                  ? 'border-pulse-cyan bg-pulse-cyan/10 text-pulse-navy dark:text-white'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-3xl">
                  cloud
                </span>
                <div>
                  <h4 className="font-semibold">SaaS Business</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Software, digital services, online platforms
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {isSaaS && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">SaaS Business Detected</p>
                <p>Since you're a SaaS business, we'll skip the video recording step and focus on your digital presence and financial data for verification.</p>
              </div>
            </div>
          </motion.div>
        )}

        {!isSaaS && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-green-600 mt-0.5">videocam</span>
              <div className="text-sm text-green-800 dark:text-green-200">
                <p className="font-medium mb-1">Video Verification Required</p>
                <p>Next, you'll record a short video of your business location and operations to help verify your physical presence.</p>
              </div>
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
          className="ml-auto px-8 py-3 pulse-gradient-bg text-white font-semibold rounded-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BusinessTypeCheck;