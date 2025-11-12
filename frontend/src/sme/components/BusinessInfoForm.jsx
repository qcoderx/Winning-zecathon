import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BusinessInfoForm = ({ data, onComplete, onBack, canGoBack }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    location: '',
    description: '',
    yearEstablished: '',
    employeeCount: '',
    ...data.businessInfo
  });

  const [errors, setErrors] = useState({});

  const industries = [
    'Technology', 'Agriculture', 'Retail', 'Healthcare', 
    'Manufacturing', 'Education', 'Finance', 'Other'
  ];

  const locations = [
    'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 
    'Ibadan', 'Kaduna', 'Jos', 'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Business description is required';
    if (!formData.yearEstablished) newErrors.yearEstablished = 'Year established is required';
    if (!formData.employeeCount) newErrors.employeeCount = 'Employee count is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete({ businessInfo: formData });
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-pulse-dark rounded-xl shadow-soft p-8"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-pulse-navy dark:text-white mb-2">
          Tell us about your business
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Provide basic information about your business to get started
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan ${
                errors.businessName 
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
              placeholder="Enter your business name"
            />
            <AnimatePresence>
              {errors.businessName && (
                <motion.p 
                  className="mt-1 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.businessName}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industry *
            </label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan ${
                errors.industry 
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
            >
              <option value="">Select industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <AnimatePresence>
              {errors.industry && (
                <motion.p 
                  className="mt-1 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.industry}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location *
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan ${
                errors.location 
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
            >
              <option value="">Select location</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <AnimatePresence>
              {errors.location && (
                <motion.p 
                  className="mt-1 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.location}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year Established *
            </label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.yearEstablished}
              onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan ${
                errors.yearEstablished 
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
              placeholder="e.g. 2020"
            />
            <AnimatePresence>
              {errors.yearEstablished && (
                <motion.p 
                  className="mt-1 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.yearEstablished}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Employee Count *
          </label>
          <select
            value={formData.employeeCount}
            onChange={(e) => handleInputChange('employeeCount', e.target.value)}
            className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan ${
              errors.employeeCount 
                ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            }`}
          >
            <option value="">Select employee count</option>
            <option value="1-5">1-5 employees</option>
            <option value="6-20">6-20 employees</option>
            <option value="21-50">21-50 employees</option>
            <option value="51-100">51-100 employees</option>
            <option value="100+">100+ employees</option>
          </select>
          {errors.employeeCount && (
            <p className="mt-1 text-sm text-red-600">{errors.employeeCount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan ${
              errors.description 
                ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            }`}
            placeholder="Describe what your business does..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <motion.div 
          className="flex justify-between pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
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
            type="submit"
            className="ml-auto px-8 py-3 pulse-gradient-bg text-white font-semibold rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default BusinessInfoForm;