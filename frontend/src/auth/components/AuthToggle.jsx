import { motion } from 'framer-motion';

const AuthToggle = ({ activeTab, onTabChange }) => {
  return (
    <motion.div 
      className="flex px-4 py-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-neutral-light dark:bg-primary/20 p-1">
        <motion.label 
          className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all duration-200 ${
            activeTab === 'signup' 
              ? 'bg-background-light dark:bg-background-dark shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-primary dark:text-neutral-light' 
              : 'text-neutral-dark dark:text-neutral-light/70 hover:text-primary dark:hover:text-neutral-light'
          }`}
          whileHover={{ scale: activeTab !== 'signup' ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="truncate">Create Account</span>
          <input 
            checked={activeTab === 'signup'} 
            className="invisible w-0" 
            name="auth-toggle" 
            type="radio" 
            value="signup"
            onChange={() => onTabChange('signup')}
          />
        </motion.label>
        <motion.label 
          className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all duration-200 ${
            activeTab === 'login' 
              ? 'bg-background-light dark:bg-background-dark shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-primary dark:text-neutral-light' 
              : 'text-neutral-dark dark:text-neutral-light/70 hover:text-primary dark:hover:text-neutral-light'
          }`}
          whileHover={{ scale: activeTab !== 'login' ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="truncate">Login</span>
          <input 
            checked={activeTab === 'login'} 
            className="invisible w-0" 
            name="auth-toggle" 
            type="radio" 
            value="login"
            onChange={() => onTabChange('login')}
          />
        </motion.label>
      </div>
    </motion.div>
  );
};

export default AuthToggle;