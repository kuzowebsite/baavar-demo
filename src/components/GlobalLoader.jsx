// src/components/GlobalLoader.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';

const GlobalLoader = () => {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <>
         {/* 'Play' фонтыг импортлох */}
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');
            `}
          </style>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                // Арын дэвсгэр зураг. public/assets/background.jpg байх ёстой.
                backgroundImage: "url('assets/background.jpg')",
                backgroundColor: '#003026' 
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
              // ӨӨРЧЛӨЛТ: -mt-24 (дээшээ татах), mb-12 (доороосоо зай авах)
              className="mb-12 -mt-24 relative"
            >
              {/* public/assets/logo2.png байх ёстой */}
              <img 
                src="assets/logo2.png" 
                alt="Baavar Suglaa Logo" 
                // ӨӨРЧЛӨЛТ: w-60 (mobile), md:w-96 (desktop) болгож томруулсан
                className="w-60 md:w-96 object-contain drop-shadow-lg" 
              />
            </motion.div>

            {/* Round Rotating Loading Spinner (Логоны доор) */}
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { delay: 0.3 },
                rotate: { repeat: Infinity, duration: 1, ease: "linear" } 
              }}
              className="mb-8 w-12 h-12 rounded-full border-4 border-t-[#FAD766] border-r-[#FAD766]/30 border-b-[#FAD766]/10 border-l-[#FAD766]/50"
            />

            {/* Text with Specific Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
              className="text-center px-4"
            >
               <p 
                style={{
                    fontFamily: "'Play', sans-serif",
                    fontWeight: 400,
                    fontSize: '24px',
                    lineHeight: '100%',
                    letterSpacing: '0.21em', // 21%
                    color: '#FAD766',
                    textTransform: 'uppercase',
                    maxWidth: '520px', 
                    margin: '0 auto' 
                }}
               >
                Цорын ганц ялагчтай<br />хонжворт сугалаа
               </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;