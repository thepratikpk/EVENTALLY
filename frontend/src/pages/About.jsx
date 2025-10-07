import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lanyard from '../components/Lanyard';

const About = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user prefers dark mode or if your app has dark mode enabled
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Modern professional background - Light Mode */}
      {!isDarkMode && (
        <motion.div 
          className="absolute inset-0 z-[-3] bg-gradient-to-br from-gray-50 via-slate-50 to-stone-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      )}
      
      {/* Modern professional background - Dark Mode */}
      {isDarkMode && (
        <motion.div 
          className="absolute inset-0 z-[-3] bg-gradient-to-br from-gray-900 via-slate-900 to-stone-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      )}
      
      {/* Top-left positioned typography */}
      <div className="absolute top-8 left-8 z-[-2] pointer-events-none about-top-left-text">
        <motion.div
          className="select-none"
          initial={{ opacity: 0, x: -50, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ 
            duration: 1.5,
            ease: "easeOut"
          }}
        >
          <motion.h1
            className="text-2xl md:text-3xl lg:text-4xl font-light leading-tight tracking-tight text-gray-400"
            animate={{ 
              y: [0, -2, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Made by
          </motion.h1>
          
          <motion.h2
            className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-wide mt-2 text-white"
            initial={{ opacity: 0, x: -30 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, -3, 0]
            }}
            transition={{ 
              opacity: { duration: 1.8, delay: 0.3, ease: "easeOut" },
              x: { duration: 1.8, delay: 0.3, ease: "easeOut" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }
            }}
            style={{ 
              fontFamily: "'Poppins', 'Montserrat', 'Oswald', sans-serif",
              fontWeight: 700,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 10px rgba(0, 0, 0, 0.2)'
            }}
          >
            Pratik Kochare
          </motion.h2>
        </motion.div>
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 z-[-1] about-gradient-overlay pointer-events-none"></div>
      
      {/* Subtle geometric elements - neutral colors */}
      <div className="absolute inset-0 z-[-2] pointer-events-none">
        <motion.div
          className={`absolute top-32 right-20 w-48 h-48 rounded-full blur-3xl ${
            isDarkMode ? 'bg-gray-400/10' : 'bg-gray-200/30'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
            x: [0, 15, 0],
            y: [0, -8, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute bottom-32 left-32 w-64 h-64 rounded-full blur-3xl ${
            isDarkMode ? 'bg-stone-400/8' : 'bg-stone-200/25'
          }`}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.04, 0.08, 0.04],
            x: [0, -10, 0],
            y: [0, 12, 0]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      {/* Lanyard component - kept exactly as it was */}
      <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
    </div>
  );
};

export default About;
