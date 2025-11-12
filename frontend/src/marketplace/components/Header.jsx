import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <motion.header 
      className="sticky top-0 z-20 flex h-[68px] w-full items-center justify-between border-b border-pulse-neutral-dark/70 dark:border-gray-800 bg-white/80 dark:bg-pulse-dark/80 backdrop-blur-sm px-4 md:px-8"
      initial={{ y: -68, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-pulse-navy dark:text-white">
          <div className="size-8 text-pulse-cyan">
            <svg fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96v96a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Zm32-84H96V56a32,32,0,0,1,64,0Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">PulseFi</h1>
        </div>
        <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700" />
        <h2 className="hidden md:block text-lg font-medium text-gray-600 dark:text-gray-300">Marketplace</h2>
      </div>
      
      <div className="flex-1 max-w-xl mx-8 hidden lg:block">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <motion.input 
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-pulse-neutral-light dark:bg-gray-700 py-2.5 pl-10 pr-4 text-sm focus:border-pulse-cyan focus:ring-1 focus:ring-pulse-cyan" 
            placeholder="Search by business name or industry" 
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <motion.button 
          className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-pulse-navy dark:hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="material-symbols-outlined">search</span>
        </motion.button>
        
        <motion.button 
          className="relative text-gray-500 dark:text-gray-400 hover:text-pulse-navy dark:hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="material-symbols-outlined">
            notifications
          </span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pulse-pink text-xs font-medium text-white">3</span>
        </motion.button>
        
        <div className="group relative">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer ring-2 ring-offset-2 dark:ring-offset-pulse-dark ring-pulse-cyan/50" 
            style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPmO60YKBzDkKa76DAURYsBWZ5xQ1slr1iOtNYFocjQqHAygxEkgK9v9gTKZaaLlBT0Wl2vJfQAkWLwu4vbqhz_UpHSTuyX6qKw-eTDj6CyJj4eggggWhZX3Lfv-vg2OZomdhXIUsF3zsCirNGzxSKiAW5e1CYu2edIuAEvoWNybmIGYGRXndFdKvWTEyt_QEXNhqHetmsLGpGpOcmwUti_PcCOw5StlLuK6aKTG2Uq5aIachbOx3lBhVKgH0upfUeglluIfBf0Ao")'}}
            onClick={() => setShowUserMenu(!showUserMenu)}
          />
          <AnimatePresence>
            {showUserMenu && (
              <motion.div 
                className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-lift ring-1 ring-black ring-opacity-5 p-2"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
              >
            <div className="px-2 py-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Alex Morgan</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">alex.morgan@investor.com</p>
            </div>
            <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                <motion.a 
                  className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" 
                  href="#"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="material-symbols-outlined text-base">logout</span> Logout
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;