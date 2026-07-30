import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full mb-4"
      />
      <motion.p 
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        className="text-slate-500 font-medium tracking-wide"
      >
        Loading module...
      </motion.p>
    </div>
  );
};

export default PageLoader;
