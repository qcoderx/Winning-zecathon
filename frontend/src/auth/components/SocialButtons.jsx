import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';

const SocialButtons = () => {
  const handleGoogleAuth = () => {
    // Implement Google OAuth
    console.log('Google authentication');
  };

  const handleLinkedInAuth = () => {
    // Implement LinkedIn OAuth
    console.log('LinkedIn authentication');
  };

  return (
    <motion.div 
      className="flex flex-col px-4 pt-4 pb-2 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-neutral-dark/50" />
        </div>
        <div className="relative bg-background-light dark:bg-background-dark px-2 text-sm text-neutral-dark dark:text-neutral-light/80">
          Or continue with
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button 
          type="button"
          className="flex-1 flex h-12 items-center justify-center rounded-lg bg-white dark:bg-primary/20 border border-gray-300 dark:border-neutral-dark/50 text-primary dark:text-neutral-light font-medium text-base leading-normal transition-all duration-200 hover:bg-neutral-light/50 dark:hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 dark:focus:ring-offset-background-dark"
          onClick={handleGoogleAuth}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <FcGoogle className="w-5 h-5 mr-3" />
          <span>Google</span>
        </motion.button>
        <motion.button 
          type="button"
          className="flex-1 flex h-12 items-center justify-center rounded-lg bg-white dark:bg-primary/20 border border-gray-300 dark:border-neutral-dark/50 text-primary dark:text-neutral-light font-medium text-base leading-normal transition-all duration-200 hover:bg-neutral-light/50 dark:hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 dark:focus:ring-offset-background-dark"
          onClick={handleLinkedInAuth}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaLinkedin className="w-5 h-5 mr-3 text-blue-600" />
          <span>LinkedIn</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SocialButtons;