import { motion } from 'framer-motion';

const Hero = ({ onAuthClick }) => {
  return (
    <section className="relative py-24 sm:py-32 bg-pulse-navy">
      <motion.div 
        className="absolute inset-0 bg-cover bg-center opacity-30" 
        style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBm1JEjgdQV-sEuCBLuGu6moJAeBPd0Kuqa7xBh_n1wSgt1hXLZrw6rCevXanwicJNgb0bEiXwWHSeMD78-q9mcjkfozmc_WX6dB8g_LgaFZFKViI8u205_osoS8DKWlozcxn_1RfUjt7Ue-KoUALAaKsCg8iit9jWDtYX7wYJfTPul3xoBR6I-OFYknE2Dfq1_vdRLsZKBTzQUwudwS8ASBdyIeoHds3L_R3FV_o0lCp8YxAxoy4yWm2cyXxqaSxxSZUZepeW5aQw')"}} 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 560" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            className="pulse-heartbeat" 
            d="M0 280 L200 280 L240 220 L280 340 L320 180 L360 280 L1440 280" 
            fill="none" 
            stroke="url(#line-gradient)" 
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ 
              duration: 2, 
              delay: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut" 
            }}
          />
          <defs>
            <linearGradient id="line-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" style={{stopColor: "var(--pulse-cyan)"}} />
              <stop offset="100%" style={{stopColor: "var(--pulse-pink)"}} />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div 
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h1 
            className="text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            PulseFi: Verifying the{' '}
            <motion.span 
              className="pulse-gradient-text"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Heartbeat
            </motion.span>{' '}
            of Nigerian Businesses
          </motion.h1>
          <motion.h2 
            className="text-gray-200 text-lg font-normal leading-normal sm:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Unlock capital for credible SMEs. Invest with certainty.
          </motion.h2>
        </motion.div>
        <motion.div 
          className="mt-10 flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <motion.button 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 pulse-gradient-bg text-white text-base font-bold leading-normal tracking-[0.015em]"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(0, 196, 180, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={onAuthClick}
          >
            <span className="truncate">Sign Up as Investor</span>
          </motion.button>
          <motion.button 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white/10 text-white text-base font-bold leading-normal tracking-[0.015em] border border-white/20"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span className="truncate">Learn More</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;