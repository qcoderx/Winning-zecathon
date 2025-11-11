import { motion } from 'framer-motion';
import { validateEmail } from '../utils/validation';

const EmailInput = ({ value, onChange, error, placeholder = "Enter your work email address" }) => {
  const isValid = value && validateEmail(value);
  
  return (
    <motion.label 
      className="flex flex-col flex-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-primary dark:text-neutral-light text-sm font-medium leading-normal pb-2">
        Work Email
      </p>
      <div className="relative">
        <input 
          className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-primary dark:text-neutral-light focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:focus:ring-accent-green/50 border bg-background-light dark:bg-transparent h-12 placeholder:text-neutral-dark dark:placeholder:text-neutral-dark/80 p-[15px] text-base font-normal leading-normal transition-all duration-200 ${
            error ? 'border-red-500 dark:border-red-400' : 
            isValid ? 'border-green-500 dark:border-green-400' :
            'border-gray-300 dark:border-neutral-dark/50'
          }`}
          placeholder={placeholder}
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {isValid && (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
          </motion.div>
        )}
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
    </motion.label>
  );
};

export default EmailInput;