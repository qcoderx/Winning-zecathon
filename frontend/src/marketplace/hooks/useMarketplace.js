import { useState, useEffect } from 'react';
import { useLoading } from '../../contexts/LoadingContext';

// Mock API service
const mockAPI = {
  async fetchSMEs(filters = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allSMEs = [
      {
        id: 1,
        name: 'Naija Agri-Tech',
        industry: 'Agriculture',
        location: 'Lagos, Nigeria',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
        pulseScore: 92,
        profitScore: 88,
        isVerified: true,
        description: 'Innovative agricultural technology solutions for sustainable farming in Nigeria. We provide smart irrigation systems, crop monitoring tools, and data analytics to help farmers increase yield and reduce costs.',
        founder: 'Adebayo Ogundimu',
        founded: '2019',
        employees: '45-60',
        revenue: '₦2.5B',
        growth: '+35%',
        funding: 'Series A'
      },
      {
        id: 2,
        name: 'Kobo Retail',
        industry: 'Retail',
        location: 'Abuja, Nigeria',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop',
        pulseScore: 85,
        profitScore: 75,
        isVerified: true,
        description: 'Modern retail solutions connecting local businesses with customers across Nigeria. Our platform enables seamless inventory management, customer engagement, and digital payments for small and medium retailers.',
        founder: 'Fatima Abdullahi',
        founded: '2020',
        employees: '25-35',
        revenue: '₦1.8B',
        growth: '+28%',
        funding: 'Seed'
      },
      {
        id: 3,
        name: 'HealthBridge',
        industry: 'Healthcare',
        location: 'Port Harcourt, Nigeria',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
        pulseScore: 78,
        profitScore: 65,
        isVerified: true,
        description: 'Bridging healthcare gaps with innovative medical technology and telemedicine solutions. We connect patients with healthcare providers through our digital platform, making quality healthcare accessible to underserved communities.',
        founder: 'Dr. Chinedu Okwu',
        founded: '2018',
        employees: '35-50',
        revenue: '₦1.2B',
        growth: '+22%',
        funding: 'Pre-Series A'
      },
      {
        id: 4,
        name: 'BuildRight Ltd',
        industry: 'Construction',
        location: 'Kano, Nigeria',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop',
        pulseScore: 81,
        profitScore: 80,
        isVerified: true,
        description: 'Sustainable construction solutions with focus on affordable housing and infrastructure. We use innovative building materials and techniques to deliver cost-effective, environmentally friendly construction projects.',
        founder: 'Musa Ibrahim',
        founded: '2017',
        employees: '80-120',
        revenue: '₦4.2B',
        growth: '+18%',
        funding: 'Series A'
      },
      {
        id: 5,
        name: 'EduTech Nigeria',
        industry: 'Technology',
        location: 'Lagos, Nigeria',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop',
        pulseScore: 89,
        profitScore: 82,
        isVerified: true,
        description: 'Educational technology platform revolutionizing learning across Nigerian schools. Our AI-powered learning management system provides personalized education experiences and helps teachers track student progress effectively.',
        founder: 'Kemi Adeyemi',
        founded: '2019',
        employees: '55-75',
        revenue: '₦3.1B',
        growth: '+42%',
        funding: 'Series A'
      },
      {
        id: 6,
        name: 'GreenEnergy Solutions',
        industry: 'Manufacturing',
        location: 'Abuja, Nigeria',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=400&fit=crop',
        pulseScore: 76,
        profitScore: 71,
        isVerified: true,
        description: 'Renewable energy solutions and solar panel manufacturing for sustainable power. We design, manufacture, and install solar energy systems for residential, commercial, and industrial applications across West Africa.',
        founder: 'Amina Hassan',
        founded: '2016',
        employees: '90-150',
        revenue: '₦5.8B',
        growth: '+15%',
        funding: 'Series B'
      },
      {
        id: 7,
        name: 'FinFlow Nigeria',
        industry: 'FinTech',
        location: 'Lagos, Nigeria',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
        pulseScore: 94,
        profitScore: 91,
        isVerified: true,
        description: 'Digital financial services platform providing banking, lending, and investment solutions for SMEs. Our technology enables businesses to access credit, manage cash flow, and grow their operations efficiently.',
        founder: 'Olumide Soyombo',
        founded: '2018',
        employees: '120-180',
        revenue: '₦8.5B',
        growth: '+65%',
        funding: 'Series B'
      },
      {
        id: 8,
        name: 'LogiTrans',
        industry: 'Logistics',
        location: 'Ibadan, Nigeria',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=400&fit=crop',
        pulseScore: 83,
        profitScore: 77,
        isVerified: true,
        description: 'Smart logistics and supply chain management solutions for African businesses. We optimize delivery routes, manage inventory, and provide real-time tracking for efficient goods movement across Nigeria.',
        founder: 'Tunde Bakare',
        founded: '2020',
        employees: '65-85',
        revenue: '₦2.9B',
        growth: '+38%',
        funding: 'Series A'
      }
    ];

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
      stats: {
        totalSMEs: allSMEs.length.toLocaleString(),
        avgPulseScore: Math.round(allSMEs.reduce((sum, sme) => sum + sme.pulseScore, 0) / allSMEs.length),
        avgProfitScore: Math.round(allSMEs.reduce((sum, sme) => sum + sme.profitScore, 0) / allSMEs.length),
        topIndustries: 'FinTech, AgriTech'
      }
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