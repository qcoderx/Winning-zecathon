import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from './StepIndicator';
import BusinessInfoForm from './BusinessInfoForm';
import CACUpload from './CACUpload';
import BusinessTypeCheck from './BusinessTypeCheck';
import VideoRecorder from './VideoRecorder';
import MonoConnection from './MonoConnection';

const OnboardingWizard = ({ onComplete, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessInfo: {},
    cacData: null,
    isSaaS: false,
    videoData: null,
    monoData: null
  });

  const steps = [
    { id: 1, title: 'Business Info', component: BusinessInfoForm },
    { id: 2, title: 'CAC Upload', component: CACUpload },
    { id: 3, title: 'Business Type', component: BusinessTypeCheck },
    { id: 4, title: 'Video Recording', component: VideoRecorder },
    { id: 5, title: 'Bank Connection', component: MonoConnection }
  ];

  const handleStepComplete = (stepData) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (currentStep === 3 && stepData.isSaaS) {
      // Skip video step for SaaS businesses
      setCurrentStep(5);
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Update user verification status
      const updatedUser = {
        ...user,
        verificationStatus: 'processing',
        pulseScore: null,
        profitScore: null
      };
      localStorage.setItem('sme_user', JSON.stringify(updatedUser));
      
      // Simulate AI processing
      setTimeout(() => {
        const verifiedUser = {
          ...updatedUser,
          verificationStatus: 'verified',
          pulseScore: 87,
          profitScore: 74
        };
        localStorage.setItem('sme_user', JSON.stringify(verifiedUser));
      }, 3000);
      
      onComplete?.(updatedData);
    }
  };

  const handleBack = () => {
    if (currentStep === 5 && formData.isSaaS) {
      // Skip back to business type for SaaS
      setCurrentStep(3);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentComponent = () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step) return null;

    const Component = step.component;
    return (
      <Component
        data={formData}
        onComplete={handleStepComplete}
        onBack={handleBack}
        canGoBack={currentStep > 1}
      />
    );
  };

  return (
    <motion.div 
      className="min-h-full bg-pulse-light dark:bg-pulse-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <StepIndicator 
            steps={steps.filter(s => !formData.isSaaS || s.id !== 4)} 
            currentStep={currentStep} 
          />
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            transition={{ 
              duration: 0.4,
              ease: "easeInOut"
            }}
            className="mt-8"
          >
            {getCurrentComponent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingWizard;