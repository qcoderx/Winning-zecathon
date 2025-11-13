import { useState, useEffect } from 'react';
import { useLoading } from '../../contexts/LoadingContext';
import { demoSMEs, demoMarketplaceStats } from '../../data/demoData';

// Mock API service
const mockAPI = {
  async fetchSMEs(filters = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allSMEs = demoSMEs;

    // Apply search filter
    let filteredSMEs = allSMEs;
    
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredSMEs = filteredSMEs.filter(sme => 
        sme.name.toLowerCase().includes(searchTerm) ||
        sme.industry.toLowerCase().includes(searchTerm) ||
        sme.location.toLowerCase().includes(searchTerm) ||
        sme.description.toLowerCase().includes(searchTerm) ||
        sme.founder.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.industry && filters.industry !== 'All Industries') {
      filteredSMEs = filteredSMEs.filter(sme => sme.industry === filters.industry);
    }
    
    if (filters.location && filters.location !== 'All Locations (Nigeria)') {
      filteredSMEs = filteredSMEs.filter(sme => sme.location.includes(filters.location));
    }
    
    if (filters.profitScore) {
      filteredSMEs = filteredSMEs.filter(sme => sme.profitScore >= filters.profitScore);
    }

    // Apply sorting
    if (filters.sortBy === 'Highest Pulse Score') {
      filteredSMEs.sort((a, b) => b.pulseScore - a.pulseScore);
    } else if (filters.sortBy === 'Highest Profit Score') {
      filteredSMEs.sort((a, b) => b.profitScore - a.profitScore);
    }

    return {
      data: filteredSMEs,
      total: filteredSMEs.length,
      stats: demoMarketplaceStats
    };
  },

  async getSMEById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = await this.fetchSMEs();
    return result.data.find(sme => sme.id === parseInt(id));
  }
};

export const useMarketplace = () => {
  const [smes, setSMEs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    industry: 'All Industries',
    location: 'All Locations (Nigeria)',
    profitScore: 0,
    sortBy: 'Highest Pulse Score'
  });
  const { setLoading: setGlobalLoading } = useLoading();

  const fetchData = async (newFilters = filters) => {
    setLoading(true);
    setGlobalLoading('marketplace', true, 'Loading marketplace data...');
    
    try {
      const result = await mockAPI.fetchSMEs(newFilters);
      setSMEs(result.data);
      setStats(result.stats);
    } catch (err) {
      console.error('Marketplace error:', err);
    } finally {
      setLoading(false);
      setGlobalLoading('marketplace', false);
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchData(updatedFilters);
  };

  const search = (query) => {
    updateFilters({ search: query });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    smes,
    stats,
    loading,
    filters,
    updateFilters,
    search
  };
};

export const useSMEProfile = (id) => {
  const [sme, setSME] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    const fetchSME = async () => {
      setLoading(true);
      setGlobalLoading('sme-profile', true, 'Loading company profile...');
      try {
        const result = await mockAPI.getSMEById(id);
        setSME(result);
      } catch (err) {
        console.error('SME Profile error:', err);
      } finally {
        setLoading(false);
        setGlobalLoading('sme-profile', false);
      }
    };

    if (id) {
      fetchSME();
    }
  }, [id, setGlobalLoading]);

  return { sme, loading };
};