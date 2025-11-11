import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const features = [
    {
      icon: "manage_search",
      title: "Lack of Verified Data",
      description: "Struggling with unreliable or non-existent financial records from SMEs."
    },
    {
      icon: "warning",
      title: "High-Risk Environment",
      description: "Without proper vetting, investing in small businesses is a significant gamble."
    },
    {
      icon: "visibility_off",
      title: "Opaque Operations",
      description: "Limited visibility into an SME's day-to-day health makes investment difficult."
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
          <h2 className="text-pulse-dark dark:text-gray-100 text-3xl font-bold leading-tight tracking-[-0.015em]">The SME Funding Gap: A Challenge for Investors</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Investors face significant hurdles in identifying and verifying credible small and medium-sized enterprises in Nigeria.</p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="flex flex-col gap-4 text-center items-center p-6 bg-white dark:bg-pulse-navy/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800"
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.span 
                className="material-symbols-outlined text-pulse-teal text-5xl"
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {feature.icon}
              </motion.span>
              <h3 className="text-pulse-dark dark:text-gray-100 text-xl font-bold leading-tight">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;