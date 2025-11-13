import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AppNavigation from '../../components/AppNavigation';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import SMECard from '../components/SMECard';
import Pagination from '../components/Pagination';
import LoadingScreen from '../../components/LoadingScreen';
import { useMarketplace } from '../hooks/useMarketplace';

const MarketplacePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('profitScore'); // 'profitScore', 'pulseScore', 'loanAmount'
  const navigate = useNavigate();
  const { smes, stats, loading, filters, updateFilters, search } = useMarketplace();

  const handleSearch = (query) => {
    search(query);
  };

  const handleFiltersChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleViewDetails = (sme) => {
    navigate(`/marketplace/profile/${sme.id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    // Sort logic would be handled in useMarketplace hook
    console.log('Sorting by:', sortType);
  };

  const sortedSMEs = [...smes].sort((a, b) => {
    switch (sortBy) {
      case 'profitScore':
        return b.profitScore - a.profitScore;
      case 'pulseScore':
        return b.pulseScore - a.pulseScore;
      case 'loanAmount':
        return (b.loanAmount || 0) - (a.loanAmount || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-pulse-neutral-light dark:bg-pulse-dark text-pulse-dark dark:text-pulse-light">
      <AppNavigation userType="lender" />
      <Header onSearch={handleSearch} />
      
      <div className="flex flex-1">
        <Sidebar filters={filters} onFiltersChange={handleFiltersChange} />
        
        <motion.main 
          className="flex-1 p-6 lg:p-8 bg-pulse-neutral-light dark:bg-pulse-navy"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsCards stats={stats} />
          
          {/* Enhanced Header with Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 mt-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-pulse-dark dark:text-white">
                Investment Opportunities
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {smes.length} verified SMEs seeking funding
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-pulse-cyan"
                >
                  <option value="profitScore">Profit Score</option>
                  <option value="pulseScore">Pulse Score</option>
                  <option value="loanAmount">Loan Amount</option>
                </select>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-pulse-cyan shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="material-symbols-outlined text-sm">grid_view</span>
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-pulse-cyan shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="material-symbols-outlined text-sm">view_list</span>
                </motion.button>
              </div>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="py-20">
                <LoadingScreen variant="minimal" message="Loading marketplace data..." showLogo={false} />
              </div>
            ) : (
              <motion.div 
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                  : "space-y-4"
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {sortedSMEs.map((sme, index) => (
                  <motion.div
                    key={sme.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SMECard 
                      sme={sme} 
                      onViewDetails={handleViewDetails}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {!loading && smes.length > 0 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(smes.length / 8)}
              onPageChange={handlePageChange}
            />
          )}
        </motion.main>
      </div>
    </div>
  );
};

export default MarketplacePage;