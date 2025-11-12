import { motion } from 'framer-motion';

const UserTypeSelector = ({ onUserTypeSelect }) => {
  return (
    <div className="min-h-screen bg-pulse-light dark:bg-pulse-dark flex items-center justify-center">
      <motion.div
        className="max-w-2xl mx-auto p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-pulse-navy dark:text-white mb-4">
            Welcome to PulseFi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose your account type to get started
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, staggerChildren: 0.2 }}
        >
          <motion.button
            onClick={() => onUserTypeSelect('sme')}
            className="p-8 bg-white dark:bg-pulse-dark rounded-xl shadow-soft border-2 border-transparent hover:border-pulse-cyan transition-all"
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-pulse-cyan/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-pulse-cyan text-3xl">
                  business
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-pulse-navy dark:text-white mb-2">
                  SME Owner
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Get verified and access funding opportunities for your business
                </p>
              </div>
              <div className="flex items-center gap-2 text-pulse-cyan text-sm font-medium">
                <span>Get Started</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => onUserTypeSelect('investor')}
            className="p-8 bg-white dark:bg-pulse-dark rounded-xl shadow-soft border-2 border-transparent hover:border-pulse-pink transition-all"
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-pulse-pink/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-pulse-pink text-3xl">
                  trending_up
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-pulse-navy dark:text-white mb-2">
                  Investor/Lender
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Discover and invest in verified, high-potential SMEs
                </p>
              </div>
              <div className="flex items-center gap-2 text-pulse-pink text-sm font-medium">
                <span>Get Started</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserTypeSelector;