// Demo data for the marketplace
export const demoSMEs = [
  {
    id: 1,
    name: 'TechFlow Solutions',
    industry: 'FinTech',
    location: 'Lagos, Nigeria',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    pulseScore: 92,
    profitScore: 85,
    loanAmount: 15000000,
    interestRate: 18,
    tenureMonths: 24,
    purpose: 'Expanding our mobile payment platform to reach 500,000 new users across West Africa. This funding will enable us to enhance our technology infrastructure and scale our operations.',
    description: 'TechFlow Solutions is a leading FinTech company specializing in mobile payment solutions for underbanked populations in Nigeria.',
    founder: 'Adebayo Ogundimu',
    yearsInBusiness: 4,
    isVerified: true
  },
  {
    id: 2,
    name: 'Green Agro Enterprises',
    industry: 'AgriTech',
    location: 'Kano, Nigeria',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    pulseScore: 88,
    profitScore: 78,
    loanAmount: 8500000,
    interestRate: 16,
    tenureMonths: 18,
    purpose: 'Purchasing modern farming equipment and expanding our organic vegetable production to supply major supermarket chains in Northern Nigeria.',
    description: 'Green Agro Enterprises focuses on sustainable agriculture and organic food production using innovative farming techniques.',
    founder: 'Fatima Abdullahi',
    yearsInBusiness: 3,
    isVerified: true
  },
  {
    id: 3,
    name: 'Urban Retail Co',
    industry: 'Retail',
    location: 'Abuja, Nigeria',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    pulseScore: 85,
    profitScore: 82,
    loanAmount: 12000000,
    interestRate: 20,
    tenureMonths: 30,
    purpose: 'Opening 3 new retail locations in high-traffic areas and upgrading our inventory management system to improve customer experience.',
    description: 'Urban Retail Co operates a chain of modern convenience stores focusing on quality products and excellent customer service.',
    founder: 'Chinedu Okwu',
    yearsInBusiness: 5,
    isVerified: true
  },
  {
    id: 4,
    name: 'HealthTech Innovations',
    industry: 'HealthTech',
    location: 'Port Harcourt, Nigeria',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    pulseScore: 90,
    profitScore: 75,
    loanAmount: 20000000,
    interestRate: 17,
    tenureMonths: 36,
    purpose: 'Developing and deploying telemedicine platform to connect rural communities with healthcare professionals across Nigeria.',
    description: 'HealthTech Innovations creates digital health solutions to improve healthcare access in underserved communities.',
    founder: 'Dr. Amina Hassan',
    yearsInBusiness: 2,
    isVerified: true
  },
  {
    id: 5,
    name: 'EduLearn Platform',
    industry: 'EdTech',
    location: 'Ibadan, Nigeria',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    pulseScore: 87,
    profitScore: 80,
    loanAmount: 6500000,
    interestRate: 19,
    tenureMonths: 24,
    purpose: 'Scaling our online learning platform to serve 50,000 students and developing mobile apps for offline learning capabilities.',
    description: 'EduLearn Platform provides affordable online education and skill development courses for Nigerian students and professionals.',
    founder: 'Olumide Adeyemi',
    yearsInBusiness: 3,
    isVerified: true
  },
  {
    id: 6,
    name: 'Solar Energy Solutions',
    industry: 'CleanTech',
    location: 'Kaduna, Nigeria',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
    pulseScore: 91,
    profitScore: 83,
    loanAmount: 25000000,
    interestRate: 15,
    tenureMonths: 48,
    purpose: 'Installing solar power systems for 200 rural communities and establishing a local manufacturing facility for solar components.',
    description: 'Solar Energy Solutions provides clean, affordable solar power systems to rural and urban communities across Nigeria.',
    founder: 'Ibrahim Musa',
    yearsInBusiness: 4,
    isVerified: true
  }
];

export const demoLenders = [
  {
    id: 1,
    name: 'Pulse Capital',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    type: 'Venture Capital',
    industryFocus: ['FinTech', 'AgriTech', 'HealthTech'],
    investmentThesis: 'We fund post-revenue SMEs in the technology and healthcare space with proven market traction.',
    typicalTerms: {
      interestRange: '12-25%',
      tenureRange: '6-24 months',
      minLoan: 1000000,
      maxLoan: 50000000
    },
    stats: {
      loansfunded: 45,
      avgResponseTime: '2 days',
      successRate: '78%',
      totalDeployed: '₦2.8B'
    },
    requirements: ['Minimum 2 years in business', 'Verified revenue streams', 'Strong management team']
  },
  {
    id: 2,
    name: 'Growth Partners Nigeria',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
    type: 'Private Equity',
    industryFocus: ['Retail', 'Manufacturing', 'Logistics'],
    investmentThesis: 'Focused on traditional businesses with strong fundamentals and expansion opportunities.',
    typicalTerms: {
      interestRange: '15-28%',
      tenureRange: '12-36 months',
      minLoan: 2000000,
      maxLoan: 100000000
    },
    stats: {
      loansfunded: 32,
      avgResponseTime: '3 days',
      successRate: '85%',
      totalDeployed: '₦5.2B'
    },
    requirements: ['Established market presence', 'Collateral backing', 'Clear expansion plan']
  }
];

export const demoMarketplaceStats = {
  totalSMEs: 847,
  verifiedSMEs: 623,
  totalFunding: '₦45.2B',
  avgPulseScore: 84,
  avgProfitScore: 79,
  successfulMatches: 234
};