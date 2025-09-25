import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const logoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cbdd395e9cf2fa12b9fc9c/8dda194f6_WhatsAppImage2025-09-18at160440_b448282fe.jpg";

const texts = [
  "Connecting Citizens",
  "Building Solutions", 
  "Transforming Communities"
];

export default function SplashScreen() {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 0.95,
        filter: "blur(10px)",
        transition: { duration: 1, ease: "easeInOut" } 
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Gradient Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #fbbf24 0%, #f97316 25%, #ea580c 50%, #16a34a 75%, #15803d 100%)'
        }}
      />
      
      {/* Animated Mesh Gradient Overlay */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(251, 191, 36, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 60%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(251, 191, 36, 0.3) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      />

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large decorative circles */}
        <motion.div
          initial={{ scale: 0, x: -100, y: -100 }}
          animate={{ 
            scale: [0, 1.2, 1], 
            x: [-100, 50],
            y: [-100, 100],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
          className="absolute top-1/4 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'linear-gradient(45deg, #ffffff, transparent)' }}
        />
        
        <motion.div
          initial={{ scale: 0, x: 100, y: 100 }}
          animate={{ 
            scale: [0, 1.5, 1], 
            x: [100, -50],
            y: [100, -100],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 3.5, delay: 0.7, ease: "easeOut" }}
          className="absolute bottom-1/4 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'linear-gradient(135deg, #ffffff, transparent)' }}
        />

        {/* Bridge illustrations */}
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.15 }}
          transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-96 h-32 text-white"
          viewBox="0 0 400 100"
        >
          <motion.path
            d="M0,80 Q100,20 200,80 T400,80"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.2 }}
          />
          {/* Animated Bridge Towers */}
          {[90, 110, 290, 310].map((x, i) => (
            <motion.rect
              key={i}
              x={x}
              y="30"
              width="6"
              height="50"
              fill="currentColor"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
            />
          ))}
        </motion.svg>

        {/* Handshake Symbol */}
        <motion.div
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ 
            scale: [0, 1.3, 1], 
            rotate: 0, 
            opacity: 0.12 
          }}
          transition={{ delay: 1.8, duration: 1.5, ease: "easeOut" }}
          className="absolute bottom-24 left-16 w-40 h-40 text-white"
        >
          <svg viewBox="0 0 100 100" fill="currentColor">
            <motion.path
              d="M20,45 Q30,25 50,45 Q70,25 80,45 Q75,65 50,50 Q25,65 20,45 Z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 2, duration: 1 }}
            />
            <motion.circle cx="35" cy="40" r="4" 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.5, duration: 0.3 }}
            />
            <motion.circle cx="65" cy="40" r="4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.7, duration: 0.3 }}
            />
          </svg>
        </motion.div>

        {/* Particle System */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              scale: 0, 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{ 
              scale: [0, Math.random() * 1.5 + 0.5, 0], 
              y: [null, -200 - Math.random() * 200],
              x: [null, (Math.random() - 0.5) * 100],
              opacity: [0, 0.6, 0],
              rotate: [0, Math.random() * 360]
            }}
            transition={{ 
              delay: Math.random() * 2,
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              background: `linear-gradient(45deg, 
                ${Math.random() > 0.5 ? '#fbbf24' : '#22c55e'}, 
                ${Math.random() > 0.5 ? '#f97316' : '#16a34a'})`,
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
            }}
          />
        ))}

        {/* Grid Pattern with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ delay: 0.5, duration: 2 }}
          className="absolute inset-0"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="animatedGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <motion.path 
                  d="M 60 0 L 0 0 0 60" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  opacity="0.4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#animatedGrid)" />
          </svg>
        </motion.div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Glowing Aura */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 1.2], 
            opacity: [0, 0.3, 0.2] 
          }}
          transition={{ delay: 0.3, duration: 2, ease: "easeOut" }}
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
            transform: 'scale(1.8)'
          }}
        />
        
        {/* Rotating Rings */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-white/20"
            style={{ transform: 'scale(1.3)' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-white/30"
            style={{ transform: 'scale(1.15)' }}
          />
        </motion.div>

        {/* Main Logo */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0, y: 200 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 100,
            delay: 0.8,
            duration: 1.5
          }}
          whileHover={{ 
            scale: 1.05,
            rotate: [0, -2, 2, 0],
            transition: { duration: 0.5 }
          }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 40px rgba(255, 255, 255, 0.3)",
                "0 0 80px rgba(249, 115, 22, 0.4)", 
                "0 0 40px rgba(34, 197, 94, 0.3)",
                "0 0 40px rgba(255, 255, 255, 0.3)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full"
          >
            <img 
              src={logoUrl} 
              alt="Samadhan Setu Logo" 
              className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-full border-8 border-white/60 shadow-2xl"
            />
          </motion.div>
          
          {/* Pulsing Glow Effect */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 rounded-full border-4 border-white/50 blur-sm"
          />
        </motion.div>

        {/* App Title with Typewriter Effect */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)',
              background: 'linear-gradient(45deg, #ffffff, #f0f9ff, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Samadhan Setu
          </motion.h1>
          
          {/* Animated Subtitle */}
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-white/90 text-xl md:text-2xl font-medium"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
              >
                {texts[currentText]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Loading Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="flex items-center space-x-2"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.2, 0.8, 1],
                backgroundColor: [
                  "rgba(255, 255, 255, 0.8)",
                  "rgba(249, 115, 22, 0.8)",
                  "rgba(34, 197, 94, 0.8)",
                  "rgba(255, 255, 255, 0.8)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 rounded-full shadow-lg"
            />
          ))}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "200px", opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="mt-6 h-1 bg-white/20 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 3.2, duration: 0.8, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-orange-400 to-green-400 rounded-full"
          />
        </motion.div>
      </div>

      {/* Bottom Wave Animation */}
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 0.15 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-0 left-0 w-full h-40 overflow-hidden"
      >
        <motion.svg
          animate={{ 
            x: [-50, 50, -50],
            y: [-10, 10, -10]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-0 w-[120%] h-full text-white"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 Q300,20 600,80 T1200,80 L1200,160 L0,160 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M0,100 Q200,40 400,100 T800,100 T1200,100 L1200,160 L0,160 Z"
            fill="currentColor"
            opacity="0.3"
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}
