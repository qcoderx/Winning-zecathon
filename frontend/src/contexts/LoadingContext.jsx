import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '../components/LoadingScreen';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalMessage, setGlobalMessage] = useState('Loading...');

  const setLoading = useCallback((key, isLoading, message = 'Loading...') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
    
    if (isLoading && message) {
      setGlobalMessage(message);
    }
  }, []);

  const isLoading = useCallback((key) => {
    return Boolean(loadingStates[key]);
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const clearLoading = useCallback((key) => {
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  const value = {
    setLoading,
    isLoading,
    isAnyLoading,
    clearLoading,
    clearAllLoading,
    globalMessage
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isAnyLoading() && (
          <LoadingScreen 
            message={globalMessage}
            key="global-loading"
          />
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};