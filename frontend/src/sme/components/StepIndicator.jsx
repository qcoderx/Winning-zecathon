import { motion } from 'framer-motion';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                step.id <= currentStep
                  ? 'bg-pulse-cyan text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}
              animate={{
                scale: step.id === currentStep ? 1.1 : 1,
                backgroundColor: step.id <= currentStep ? '#00D1C5' : '#E5E7EB'
              }}
              transition={{ duration: 0.3 }}
            >
              {step.id <= currentStep ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                step.id
              )}
            </motion.div>
            <span className={`ml-3 text-sm font-medium ${
              step.id <= currentStep 
                ? 'text-pulse-navy dark:text-white' 
                : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 mx-4">
              <motion.div
                className="h-1 bg-gray-200 dark:bg-gray-700 rounded"
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: step.id < currentStep ? 1 : 0,
                  backgroundColor: step.id < currentStep ? '#00D1C5' : '#E5E7EB'
                }}
                transition={{ duration: 0.5 }}
                style={{ originX: 0 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;