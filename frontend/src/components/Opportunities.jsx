import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Opportunities = ({ onAuthClick }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const smes = [
    {
      id: 1,
      name: "AgriCo Innovate",
      industry: "Agriculture Tech",
      description: "Sustainable farming solutions provider seeking to expand operations.",
      pulseScore: 85,
      profitScore: "A+",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmeP3pNaFo3NYZ31td_zbazwHc3fq_2O3-_9fhculoSYAAlUfjxKoek-6Ghhq6fZmR0xh4OWDQPhIr1zueOkAocelRlPgQ8A4aj6y7hm_bUQtI0HA97fD2o7GmEKU1QYVrAGpAUhBSxJ8ixvLMSjC_e582CDAUuj8-IPXgfwu2h7oJy6-FWPivvSO2sEYoK_8ClRYvQD3N1bomWZCqN3P9HBml_LzwFPt1l9cwZMqI_4Sk1yxHqMEVmfuUtAfByUMGdonOC-qwKNo"
    },
    {
      id: 2,
      name: "Lagos Fashion Hub",
      industry: "E-commerce",
      description: "Online marketplace for local designers to reach a global audience.",
      pulseScore: 92,
      profitScore: "A++",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzEB1yoTBpc8845wT7vOBzCGB0iT4jlXYHcLX9eE7G4cCBA9Aav_mdbOVmoeyHouVeKHUAEZQj6V32aE_fwl2XizuzCRANYA2KWknapgnQoaItrAJeJDhNrzifpP9EDS42LuMu8M4EZoJFKbb3-1XLWQT2VGyixz0sZERzYX7FyA8PstHKKpU9FFy5-ihC2Celez8W7xay3f-jhP6dWsJ9DYRZaE_Gk7_QuPEhLOtDkvMywwyEBjHx25iOb15dg79mJMwFCcul5tk"
    },
    {
      id: 3,
      name: "CleanPower NG",
      industry: "Renewable Energy",
      description: "Developing affordable solar power solutions for off-grid communities.",
      pulseScore: 78,
      profitScore: "B+",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJZAHyPURlo0zR8Wt-aUWkozlS1YO5Lme22SEgd6swHJBXrkwjOoFHNelOLiGH_XUddxMfzcqVji16YpJfHX0EHD6wJtHlOwUu-rVhd9K4NcxJ7uJueEZ54Zq9X_eqBFpbbHo11pyfhPTx028fo1avsChOZ-_dxu_x9RZ7dc2QCv87LfcMCd4WPmKgs-GIcI8wCwtEdfPa2zvw7iZfutt-OLtl7H3pjb6HRB2DUMqrS3myh0R959C_6Feyk_a1Q0uxL0pdzG_550I"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-pulse-light dark:bg-pulse-dark" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-pulse-dark dark:text-gray-100 text-3xl font-bold leading-tight tracking-[-0.015em]">Discover Vetted Opportunities</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Browse a curated selection of Nigerian SMEs, each backed by a transparent PulseFi score.</p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {smes.map((sme, index) => (
            <motion.div 
              key={sme.id} 
              className="bg-white dark:bg-pulse-navy/50 rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800"
              variants={cardVariants}
              whileHover={{ 
                y: -15,
                scale: 1.03,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-6">
                <motion.div 
                  className="flex items-center gap-4 mb-4"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.img 
                    className="h-12 w-12 rounded-full object-cover" 
                    alt={`Company Logo for ${sme.name}`} 
                    src={sme.logo}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.2 }
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-pulse-dark dark:text-gray-100">{sme.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{sme.industry}</p>
                  </div>
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 h-12">{sme.description}</p>
                <div className="flex justify-around gap-4 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pulse Score</p>
                    <motion.p 
                      className="text-2xl font-bold text-pulse-teal"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: index * 0.3,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      {sme.pulseScore}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit Score</p>
                    <motion.p 
                      className="text-2xl font-bold text-pulse-pink"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: index * 0.3 + 0.5,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      {sme.profitScore}
                    </motion.p>
                  </motion.div>
                </div>
              </div>
              <motion.div 
                className="mt-auto p-4 bg-gray-50 dark:bg-pulse-navy/30 text-center"
                whileHover={{ backgroundColor: "rgba(0, 196, 180, 0.1)" }}
              >
                <motion.a 
                  className="text-sm font-bold text-pulse-teal hover:underline" 
                  href="#"
                  whileHover={{ 
                    scale: 1.05,
                    color: "var(--pulse-cyan)",
                    transition: { duration: 0.2 }
                  }}
                >
                  View Details
                </motion.a>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 pulse-gradient-bg text-white text-base font-bold leading-normal tracking-[0.015em] mx-auto"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(0, 196, 180, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={onAuthClick}
          >
            <span className="truncate">See Verified SMEs</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Opportunities;