import { motion } from 'framer-motion';

const PulsefiLogo = ({ size = 80, className = "" }) => (
  <motion.img 
    src="/pulsi-logo-removebg-preview.png"
    alt="PulseFi Logo"
    className={className}
    style={{ width: size, height: size }}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  />
);

const LoadingScreen = ({ 
  message = "Loading your experience...", 
  showLogo = true,
  variant = "default" // "default", "minimal", "splash"
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.1,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (variant === "minimal") {
    return (
      <motion.div
        className="flex items-center justify-center p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div 
          className="w-8 h-8 border-3 border-pulse-cyan border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pulse-light via-white to-pulse-neutral-light dark:from-pulse-dark dark:via-pulse-navy dark:to-pulse-dark"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,196,180,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,107,107,0.1),transparent_50%)]" />
      </div>

      <motion.div
        className="flex flex-col items-center justify-center text-center"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {showLogo && (
          <motion.div
            className="mb-8"
            variants={pulseVariants}
            animate="pulse"
          >
            <PulsefiLogo size={variant === "splash" ? 360 : 240} />
          </motion.div>
        )}

        {variant === "splash" && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Empowering SME Growth Through Smart Investment
            </p>
          </motion.div>
        )}

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: variant === "splash" ? 0.5 : 0.3 }}
        >
          <motion.div 
            className="w-12 h-12 border-3 border-pulse-cyan border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: variant === "splash" ? 0.7 : 0.5 }}
          >
            {message}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
export { PulsefiLogo };