import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Process = () => {
  const processRef = useRef(null);
  const stepsRef = useRef(null);
  const videoRef = useRef(null);
  
  const isProcessInView = useInView(processRef, { once: true, threshold: 0.1 });
  const isStepsInView = useInView(stepsRef, { once: true, threshold: 0.1 });
  const isVideoInView = useInView(videoRef, { once: true, threshold: 0.1 });

  const processSteps = [
    { icon: "login", title: "SME Signs Up" },
    { icon: "verified", title: "Pulse Score" },
    { icon: "insights", title: "Profit Score" },
    { icon: "store", title: "Marketplace" }
  ];

  const investmentSteps = [
    {
      number: "01",
      title: "Verification",
      description: "Sign up and browse SMEs that have passed our rigorous, data-driven verification process."
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Review the Pulse and Profit scores to make informed decisions based on AI-powered insights."
    },
    {
      number: "03",
      title: "Invest",
      description: "Choose your investment amount and fund credible businesses with confidence."
    }
  ];

  return (
    <>
      <section className="py-16 sm:py-24 bg-white dark:bg-pulse-navy/30" ref={processRef}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isProcessInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-pulse-dark dark:text-gray-100 text-3xl font-bold leading-tight tracking-[-0.015em]">Our Solution: From Data to Deals</h2>
          </motion.div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            <motion.div 
              className="absolute top-1/4 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 hidden md:block"
              initial={{ scaleX: 0 }}
              animate={isProcessInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{ originX: 0 }}
            >
              <motion.div 
                className="h-1 pulse-gradient-bg w-full" 
                initial={{ scaleX: 0 }}
                animate={isProcessInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 2, delay: 1 }}
                style={{ originX: 0 }}
              />
            </motion.div>
            {processSteps.map((step, index) => (
              <motion.div 
                key={step.title}
                className="relative flex flex-col items-center text-center gap-4 z-10 w-full md:w-1/4"
                initial={{ opacity: 0, x: -50 }}
                animate={isProcessInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="flex items-center justify-center size-16 rounded-full bg-pulse-teal/20 dark:bg-pulse-teal/30 text-pulse-teal border-4 border-pulse-light dark:border-pulse-dark"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "rgba(0, 196, 180, 0.3)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.span 
                    className="material-symbols-outlined text-3xl"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ 
                      duration: 2, 
                      delay: index * 0.5,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    {step.icon}
                  </motion.span>
                </motion.div>
                <h3 className="text-lg font-bold mt-2 dark:text-white">{step.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 sm:py-24 bg-white dark:bg-pulse-navy/30" ref={stepsRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isStepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-pulse-dark dark:text-gray-100 text-3xl font-bold leading-tight tracking-[-0.015em]">Invest in 3 Simple Steps</h2>
          </motion.div>
          <div className="flex flex-col md:flex-row gap-12 md:gap-8">
            {investmentSteps.map((step, index) => (
              <motion.div 
                key={step.number}
                className="flex items-start gap-6"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isStepsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="text-5xl font-black pulse-gradient-text opacity-50"
                  whileHover={{ 
                    scale: 1.1,
                    opacity: 0.8,
                    transition: { duration: 0.2 }
                  }}
                >
                  {step.number}
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 sm:py-24 bg-pulse-light dark:bg-pulse-dark" ref={videoRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isVideoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-pulse-dark dark:text-gray-100 text-3xl font-bold leading-tight tracking-[-0.015em]">Hear Their Story</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">See the real-world impact of confident investing.</p>
          </motion.div>
          <motion.div 
            className="aspect-video bg-pulse-dark rounded-xl shadow-lg overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVideoInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/LSF3GjyQ2lY"
              title="PulseFi Success Story"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Process;