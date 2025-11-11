import { useState } from 'react';
import { motion } from 'framer-motion';
import { validatePassword } from '../utils/validation';

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "Enter your password", 
  showStrength = false,
  showForgotPassword = false,
  onForgotPassword,
  error 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = showStrength ? validatePassword(value) : null;

  return (
    <motion.div 
      className="flex flex-col flex-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex w-full justify-between items-center pb-2">
        <p className="text-primary dark:text-neutral-light text-sm font-medium leading-normal">Password</p>
        {showForgotPassword && (
          <motion.button
            type="button"
            className="text-primary dark:text-neutral-light text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            onClick={onForgotPassword}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Forgot Password?
          </motion.button>
        )}
      </div>
      <div className="flex w-full flex-1 items-stretch rounded-lg">
        <input 
          className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-primary dark:text-neutral-light focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent-green/50 border bg-background-light dark:bg-transparent h-12 placeholder:text-neutral-dark dark:placeholder:text-neutral-dark/80 p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal transition-all duration-200 ${
            error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-neutral-dark/50'
          }`}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <motion.button 
          type="button"
          aria-label="Toggle password visibility"
          className={`text-neutral-dark flex border bg-background-light dark:bg-transparent items-center justify-center pr-[15px] rounded-r-lg border-l-0 transition-all duration-200 ${
            error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-neutral-dark/50'
          }`}
          onClick={() => setShowPassword(!showPassword)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="material-symbols-outlined">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </motion.button>
      </div>
      {error && (
        <motion.p 
          className="text-red-500 dark:text-red-400 text-sm mt-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
      {showStrength && value && passwordStrength && (
        <motion.div 
          className="flex items-center pt-2 space-x-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-1 h-1 bg-gray-200 dark:bg-neutral-dark/30 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full transition-all duration-300 ${
                passwordStrength.color === 'green' ? 'bg-green-500' :
                passwordStrength.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: passwordStrength.width }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className={`text-sm font-medium ${
            passwordStrength.color === 'green' ? 'text-green-600 dark:text-green-400' :
            passwordStrength.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {passwordStrength.strength}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PasswordInput;