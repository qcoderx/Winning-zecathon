import { motion } from 'framer-motion';

const Header = ({ onAuthClick }) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-pulse-light/80 dark:bg-pulse-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <motion.a 
              className="flex items-center gap-3" 
              href="#"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.img 
                src="/src/pulsi-logo-removebg-preview.png"
                alt="PulseFi Logo"
                className="h-48 w-48" 
                animate={{ 
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.a>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-9">
              {['How it Works', 'Marketplace', 'About Us'].map((item, index) => (
                <motion.a 
                  key={item}
                  className="text-pulse-dark dark:text-gray-300 text-sm font-medium hover:text-pulse-teal dark:hover:text-white" 
                  href="#"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -2,
                    transition: { duration: 0.2 } 
                  }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
            <motion.button 
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 pulse-gradient-bg text-white text-sm font-bold leading-normal tracking-[0.015em]"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0, 196, 180, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={onAuthClick}
            >
              <span className="truncate">Sign Up</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;