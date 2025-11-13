import { useState } from 'react';
import { motion } from 'framer-motion';

const LoanApplicationForm = ({ onComplete, onBack, canGoBack }) => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    purpose: '',
    interestRate: '',
    tenureMonths: 24,
    businessUse: '',
    repaymentPlan: 'monthly'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.loanAmount || formData.loanAmount < 100000) {
      newErrors.loanAmount = 'Minimum loan amount is ₦100,000';
    }
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Please describe the purpose of this loan';
    }
    if (!formData.interestRate || formData.interestRate < 5 || formData.interestRate > 35) {
      newErrors.interestRate = 'Interest rate must be between 5% and 35%';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const applicationData = {
        ...formData,
        loanAmount: parseInt(formData.loanAmount),
        interestRate: parseFloat(formData.interestRate),
        id: Date.now(),
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      
      onComplete({ loanApplication: applicationData });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-pulse-dark rounded-xl shadow-soft p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-pulse-navy dark:text-white mb-2">
          Create Loan Application
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Define your funding requirements to approach the right lenders
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loan Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Amount Required (₦) *
            </label>
            <input
              type="number"
              min="100000"
              max="100000000"
              value={formData.loanAmount}
              onChange={(e) => handleChange('loanAmount', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan ${
                errors.loanAmount ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="5000000"
            />
            {errors.loanAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.loanAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Desired Interest Rate (%) *
            </label>
            <input
              type="number"
              min="5"
              max="35"
              step="0.1"
              value={formData.interestRate}
              onChange={(e) => handleChange('interestRate', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan ${
                errors.interestRate ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="15.5"
            />
            {errors.interestRate && (
              <p className="mt-1 text-sm text-red-600">{errors.interestRate}</p>
            )}
          </div>
        </div>

        {/* Tenure and Repayment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Tenure (Months)
            </label>
            <select
              value={formData.tenureMonths}
              onChange={(e) => handleChange('tenureMonths', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan"
            >
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
              <option value={18}>18 months</option>
              <option value={24}>24 months</option>
              <option value={36}>36 months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Repayment Schedule
            </label>
            <select
              value={formData.repaymentPlan}
              onChange={(e) => handleChange('repaymentPlan', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="bullet">Bullet Payment</option>
            </select>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Purpose of Loan *
          </label>
          <textarea
            rows={4}
            value={formData.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan resize-none ${
              errors.purpose ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Describe how you plan to use this funding (e.g., inventory expansion, equipment purchase, working capital, etc.)"
          />
          {errors.purpose && (
            <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
          )}
        </div>

        {/* Business Use Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detailed Business Use (Optional)
          </label>
          <textarea
            rows={3}
            value={formData.businessUse}
            onChange={(e) => handleChange('businessUse', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan resize-none"
            placeholder="Provide additional details about how this loan will impact your business growth..."
          />
        </div>

        {/* Expected Returns */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Loan Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 dark:text-blue-300">Monthly Payment:</span>
              <div className="font-bold text-blue-800 dark:text-blue-200">
                ₦{formData.loanAmount && formData.interestRate && formData.tenureMonths ? 
                  Math.round((parseInt(formData.loanAmount) * (1 + parseFloat(formData.interestRate)/100)) / parseInt(formData.tenureMonths)).toLocaleString() : 
                  '---'
                }
              </div>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-300">Total Interest:</span>
              <div className="font-bold text-blue-800 dark:text-blue-200">
                ₦{formData.loanAmount && formData.interestRate ? 
                  Math.round(parseInt(formData.loanAmount) * parseFloat(formData.interestRate)/100).toLocaleString() : 
                  '---'
                }
              </div>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-300">Total Repayment:</span>
              <div className="font-bold text-blue-800 dark:text-blue-200">
                ₦{formData.loanAmount && formData.interestRate ? 
                  Math.round(parseInt(formData.loanAmount) * (1 + parseFloat(formData.interestRate)/100)).toLocaleString() : 
                  '---'
                }
              </div>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-300">Duration:</span>
              <div className="font-bold text-blue-800 dark:text-blue-200">
                {formData.tenureMonths} months
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
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
            disabled={isSubmitting}
            className="ml-auto px-8 py-3 pulse-gradient-bg text-white font-semibold rounded-lg disabled:opacity-50"
            whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
            whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Application...
              </div>
            ) : (
              'Create Application'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default LoanApplicationForm;