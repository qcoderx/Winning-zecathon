import { motion } from 'framer-motion';
import { useState } from 'react';

const SMECard = ({ sme, onViewDetails, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    id,
    name,
    industry,
    location,
    image,
    pulseScore,
    profitScore,
    loanAmount = 2500000,
    isVerified = true
  } = sme;

  const handleViewDetails = () => {
    onViewDetails?.(sme);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        className="bg-white dark:bg-pulse-navy rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer group p-6"
        whileHover={{ 
          x: 4,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
        }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
        onClick={handleViewDetails}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pulse-light dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                {image ? (
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-gray-400">business</span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-pulse-dark dark:text-white text-lg">{name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{industry} • {location}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pulse-cyan">{pulseScore}</div>
                <div className="text-xs text-gray-500">Pulse Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pulse-pink">{profitScore}</div>
                <div className="text-xs text-gray-500">Profit Score</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-pulse-dark dark:text-white">
                ₦{loanAmount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Seeking</div>
            </div>
          </div>
          
          <motion.button
            className="px-6 py-2 pulse-gradient-bg text-white rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Business Profile
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col rounded-xl bg-white dark:bg-pulse-dark shadow-soft overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-32 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <motion.img 
          alt={`${name} business image`} 
          className="object-cover w-full h-full" 
          src={image}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="absolute inset-0 bg-pulse-cyan/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="absolute bottom-2 left-2">
          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
            ₦{loanAmount.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-base font-bold text-pulse-navy dark:text-white pr-2">
            {name}
          </h4>
          {isVerified && (
            <div className="flex-shrink-0 flex items-center gap-1.5 text-pulse-green bg-pulse-green/10 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span className="text-xs font-semibold">Verified</span>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {industry} • {location}
        </p>
        
        <div className="mt-4 flex items-center justify-around gap-4">
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Pulse Score</p>
            <motion.p 
              className="text-2xl font-bold text-pulse-cyan"
              animate={{ 
                scale: isHovered ? [1, 1.1, 1] : 1,
                color: isHovered ? "#00D1C5" : "#00C4B4"
              }}
              transition={{ duration: 0.5 }}
            >
              {pulseScore}
            </motion.p>
          </motion.div>
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Profit Score</p>
            <motion.p 
              className="text-2xl font-bold text-pulse-green"
              animate={{ 
                scale: isHovered ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.5 }}
            >
              {profitScore}
            </motion.p>
          </motion.div>
        </div>
      </div>
      
      <motion.button 
        className="block w-full text-center bg-pulse-neutral-light dark:bg-pulse-dark/50 px-4 py-2.5 text-sm font-semibold text-pulse-navy dark:text-pulse-cyan transition-colors"
        onClick={handleViewDetails}
        whileHover={{ 
          backgroundColor: "rgba(0, 196, 180, 0.1)",
          color: "#00C4B4"
        }}
        whileTap={{ scale: 0.98 }}
        animate={{ 
          backgroundColor: isHovered ? "rgba(0, 196, 180, 0.05)" : "rgba(0, 0, 0, 0)"
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          View Business Profile
        </motion.span>
      </motion.button>
    </motion.div>
  );
};

export default SMECard;