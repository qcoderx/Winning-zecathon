import { useState } from 'react';
import { motion } from 'framer-motion';

const BusinessTypeCheck = ({ data, onComplete, onBack, canGoBack }) => {
  const [businessType, setBusinessType] = useState('');
  const [error, setError] = useState('');

  const businessTypes = [
    {
      id: 'physical',
      title: 'Physical Business',
      description: 'Retail store, restaurant, manufacturing, etc.',
      icon: 'storefront',
      requiresVideo: true
    },
    {
      id: 'service',
      title: 'Service Business',
      description: 'Consulting, repair services, professional services',
      icon: 'handyman',
      requiresVideo: true
    },
    {
      id: 'saas',
      title: 'Software/SaaS',
      description: 'Software development, digital products, apps',
      icon: 'computer',
      requiresVideo: false
    },
    {
      id: 'ecommerce',
      title: 'E-commerce',
      description: 'Online retail, dropshipping, digital marketplace',
      icon: 'shopping_cart',
      requiresVideo: true
    }
  ];

  const handleContinue = () => {
    if (!businessType) {
      setError('Please select your business type to continue.');
      return;
    }

    const selectedType = businessTypes.find(type => type.id === businessType);
    onComplete({ 
      businessType,
      isSaaS: businessType === 'saas',
      requiresVideo: selectedType?.requiresVideo || true
    });
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
          What type of business do you operate?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This helps us customize the verification process for your business model
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {businessTypes.map((type) => (
          <motion.button
            key={type.id}
            onClick={() => {
              setBusinessType(type.id);
              setError('');
            }}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              businessType === type.id
                ? 'border-pulse-cyan bg-pulse-cyan/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                businessType === type.id 
                  ? 'bg-pulse-cyan text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                <span className="material-symbols-outlined text-xl">{type.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-pulse-navy dark:text-white mb-1">
                  {type.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {type.description}
                </p>
                {!type.requiresVideo && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                    <span className="text-xs text-green-600 font-medium">Video recording optional</span>
                  </div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {businessType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Next Steps</p>
              <p>
                {businessType === 'saas' 
                  ? 'As a software business, you can skip the video recording step and proceed directly to bank connection.'
                  : 'You\'ll need to record a short video showing your business operations and location.'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600">error</span>
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between pt-6">
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