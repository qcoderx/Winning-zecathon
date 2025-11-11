import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const footerSections = [
    {
      title: "Platform",
      links: ["How it Works", "Marketplace", "For SMEs"]
    },
    {
      title: "Company",
      links: ["About Us", "Contact", "Careers"]
    },
    {
      title: "Connect",
      links: ["Twitter", "LinkedIn"]
    }
  ];

  return (
    <motion.footer 
      className="bg-pulse-navy text-gray-300"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <motion.div 
            className="col-span-2 md:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <motion.img 
                src="/src/pulsi-logo-removebg-preview.png"
                alt="PulseFi Logo"
                className="h-48 w-48" 
                animate={{ 
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <motion.p 
              className="mt-4 text-sm"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Empowering investors with data. Fueling SME growth in Nigeria.
            </motion.p>
            <motion.div 
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-xs text-gray-500">A Zecathon Project</p>
              <motion.img 
                alt="Zecathon Logo" 
                className="h-5 w-5" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9BXqrztCh0-1TqYtput8Q4CO6E7zfc49s_P4mLmt4l0w7y7FLdoQfp73J1Lz-vtPyjbqHUXxXKDmQxnfiT622LvQRvSJcfMOaxWv_fYUDDoNF_iaXbzmYdngQrv9Bcmn1Hrseu3CJ8dTI0n4-JRGQLkPQjjD_rugvraxFU-gwzweUr6uWqWnzCY17uBKkNGGJkXoaTGYZjASLl0FjW-RlNW-xAtfqQ9M8dfBPg6VLVtpy5bMT2M9aiGMjUE2Klg8Ij5RSqKrCI1k"
                whileHover={{ 
                  scale: 1.2,
                  rotate: 360,
                  transition: { duration: 0.5 }
                }}
              />
            </motion.div>
          </motion.div>
          {footerSections.map((section, sectionIndex) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 + sectionIndex * 0.1 }}
            >
              <h3 className="text-sm font-semibold tracking-wider uppercase text-white">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.4 + sectionIndex * 0.1 + linkIndex * 0.05 }}
                  >
                    <motion.a 
                      className="text-base hover:text-white" 
                      href="#"
                      whileHover={{ 
                        x: 5,
                        color: "var(--pulse-teal)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="mt-12 border-t border-gray-700 pt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-sm text-gray-400">© 2024 PulseFi. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;