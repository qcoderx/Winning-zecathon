import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({ type = 'success', message, onClose, show }) => {
  const alertStyles = {
    success: {
      bg: 'bg-accent-green/20 dark:bg-accent-green/30',
      text: 'text-primary dark:text-neutral-light',
      icon: 'check',
      iconBg: 'bg-green-100 dark:bg-green-800',
      iconColor: 'text-accent-green dark:text-green-200'
    },
    error: {
      bg: 'bg-red-100/80 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-200',
      icon: 'error',
      iconBg: 'bg-red-100 dark:bg-red-800',
      iconColor: 'text-red-500 dark:text-red-200'
    },
    warning: {
      bg: 'bg-yellow-100/80 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: 'warning',
      iconBg: 'bg-yellow-100 dark:bg-yellow-800',
      iconColor: 'text-yellow-500 dark:text-yellow-200'
    }
  };

  const style = alertStyles[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed top-6 right-6 flex items-center w-full max-w-xs p-4 space-x-4 rounded-lg shadow z-50 ${style.bg} ${style.text}`}
          role="alert"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div 
            className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${style.iconBg}`}
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className={`material-symbols-outlined text-base ${style.iconColor}`}>
              {style.icon}
            </span>
          </motion.div>
          <div className="text-sm font-normal flex-1">
            {message}
          </div>
          {onClose && (
            <motion.button 
              aria-label="Close"
              className="ms-auto -mx-1.5 -my-1.5 bg-transparent hover:bg-gray-100/50 dark:hover:bg-white/10 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors"
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Close</span>
              <span className="material-symbols-outlined text-lg">close</span>
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;