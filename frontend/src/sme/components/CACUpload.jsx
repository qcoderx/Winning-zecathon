import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { verifyCompany } from 'cac-verify';

const CACUpload = ({ data, onComplete, onBack, canGoBack }) => {
  const [hasCAC, setHasCAC] = useState(null);
  const [file, setFile] = useState(null);
  const [rcNumber, setRcNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/'))) {
      setFile(selectedFile);
      setErrors(prev => ({ ...prev, file: '' }));
    } else {
      setErrors(prev => ({ ...prev, file: 'Please select a PDF or image file' }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleVerifyCAC = async () => {
    if (!rcNumber.trim()) {
      setErrors(prev => ({ ...prev, rcNumber: 'RC Number is required for verification' }));
      return;
    }

    setIsVerifying(true);
    setErrors({});

    try {
      const { data: cacData, error } = await verifyCompany(rcNumber.trim());
      
      if (error) {
        setVerificationResult({
          success: false,
          message: error,
          data: null
        });
      } else {
        setVerificationResult({
          success: true,
          message: 'CAC verification successful',
          data: cacData
        });
      }
    } catch (err) {
      setVerificationResult({
        success: false,
        message: 'Verification failed. Please check your RC number and try again.',
        data: null
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    if (hasCAC === null) {
      setErrors({ hasCAC: 'Please select whether your business has CAC registration' });
      return;
    }

    if (hasCAC) {
      const newErrors = {};
      
      if (!file) {
        newErrors.file = 'Please upload your CAC certificate';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    const cacData = {
      hasCAC,
      file: hasCAC ? file : null,
      rcNumber: hasCAC ? rcNumber.trim() : '',
      verificationResult: hasCAC ? verificationResult : null,
      isVerified: hasCAC ? (verificationResult?.success || false) : false
    };

    onComplete({ cacData });
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
          Upload CAC Certificate
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your Certificate of Incorporation and verify your business registration
        </p>
      </div>

      <div className="space-y-6">
        {/* CAC Status Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Does your business have CAC registration? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              type="button"
              onClick={() => {
                setHasCAC(true);
                setErrors(prev => ({ ...prev, hasCAC: '' }));
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                hasCAC === true
                  ? 'border-pulse-cyan bg-pulse-cyan/10 text-pulse-navy dark:text-white'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-600">
                  check_circle
                </span>
                <div className="text-left">
                  <h4 className="font-semibold">Yes, I have CAC</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Higher Pulse Score potential
                  </p>
                </div>
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => {
                setHasCAC(false);
                setErrors(prev => ({ ...prev, hasCAC: '' }));
                setFile(null);
                setRcNumber('');
                setVerificationResult(null);
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                hasCAC === false
                  ? 'border-pulse-cyan bg-pulse-cyan/10 text-pulse-navy dark:text-white'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-yellow-600">
                  info
                </span>
                <div className="text-left">
                  <h4 className="font-semibold">No, not yet registered</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Lower Pulse Score impact
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
          {errors.hasCAC && (
            <motion.p 
              className="mt-2 text-sm text-red-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {errors.hasCAC}
            </motion.p>
          )}
        </div>

        {/* Pulse Score Impact Notice */}
        {hasCAC !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              hasCAC
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`material-symbols-outlined mt-0.5 ${
                hasCAC ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {hasCAC ? 'trending_up' : 'trending_down'}
              </span>
              <div className={`text-sm ${
                hasCAC 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}>
                <p className="font-medium mb-1">Pulse Score Impact</p>
                <p>
                  {hasCAC 
                    ? 'Having CAC registration significantly boosts your Pulse Score and credibility with investors.'
                    : 'Not having CAC registration will lower your Pulse Score, but you can still apply and work on registration later.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* CAC Upload Section - Only show if user has CAC */}
        {hasCAC && (
          <>
        {/* RC Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            RC Number (Optional - for verification)
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={rcNumber}
              onChange={(e) => {
                setRcNumber(e.target.value);
                setErrors(prev => ({ ...prev, rcNumber: '' }));
                setVerificationResult(null);
              }}
              className={`flex-1 rounded-lg border px-4 py-3 focus:ring-2 focus:ring-pulse-cyan focus:border-pulse-cyan ${
                errors.rcNumber 
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
              placeholder="Enter RC number (e.g. RC123456)"
            />
            <motion.button
              type="button"
              onClick={handleVerifyCAC}
              disabled={isVerifying || !rcNumber.trim()}
              className="px-6 py-3 bg-pulse-teal text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: !isVerifying && rcNumber.trim() ? 1.02 : 1 }}
              whileTap={{ scale: !isVerifying && rcNumber.trim() ? 0.98 : 1 }}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </motion.button>
          </div>
          {errors.rcNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.rcNumber}</p>
          )}
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              verificationResult.success 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined ${
                verificationResult.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {verificationResult.success ? 'check_circle' : 'error'}
              </span>
              <p className={`font-medium ${
                verificationResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}>
                {verificationResult.message}
              </p>
            </div>
            {verificationResult.success && verificationResult.data && (
              <div className="mt-3 text-sm text-green-700 dark:text-green-300">
                <p><strong>Company:</strong> {verificationResult.data.name}</p>
                <p><strong>Registration Date:</strong> {verificationResult.data.dateOfRegistration}</p>
                <p><strong>Address:</strong> {verificationResult.data.address}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CAC Certificate *
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              errors.file
                ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-pulse-cyan dark:hover:border-pulse-cyan bg-gray-50 dark:bg-gray-800/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            
            {file ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-pulse-cyan text-2xl">
                  description
                </span>
                <div>
                  <p className="font-medium text-pulse-navy dark:text-white">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-red-500 hover:text-red-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="material-symbols-outlined">close</span>
                </motion.button>
              </motion.div>
            ) : (
              <div>
                <span className="material-symbols-outlined text-gray-400 text-4xl mb-4 block">
                  cloud_upload
                </span>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drop your CAC certificate here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF and image files (max 10MB)
                </p>
              </div>
            )}
          </div>
          {errors.file && (
            <p className="mt-1 text-sm text-red-600">{errors.file}</p>
          )}
        </div>

          </>
        )}

        {/* No CAC Notice */}
        {hasCAC === false && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">No Problem!</p>
                <p>You can still proceed with your application. We recommend starting your CAC registration process to improve your Pulse Score for future funding opportunities.</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between pt-8">
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
          type="button"
          onClick={handleContinue}
          className="ml-auto px-8 py-3 pulse-gradient-bg text-white font-semibold rounded-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CACUpload;