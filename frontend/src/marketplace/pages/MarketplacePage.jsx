import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import SMECard from '../components/SMECard';
import Pagination from '../components/Pagination';
import LoadingScreen from '../../components/LoadingScreen';
import { useMarketplace } from '../hooks/useMarketplace';

const MarketplacePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
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
    // Here you would typically fetch new data for the page
    console.log('Page changed to:', page);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-pulse-neutral-light dark:bg-pulse-dark text-pulse-dark dark:text-pulse-light">
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
          
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="py-20">
                <LoadingScreen variant="minimal" message="Loading marketplace data..." showLogo={false} />
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {smes.map((sme, index) => (
                  <motion.div
                    key={sme.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SMECard 
                      sme={sme} 
                      onViewDetails={handleViewDetails}
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