import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';

// forceShow prop-ийг нэмж өгсөн (Refresh үед App.jsx-ээс удирдана)
const GlobalLoader = ({ forceShow }) => {
  const { isLoading } = useLoading();

  // isLoading (цэсийн шилжилт) эсвэл forceShow (анхны ачаалалт) аль нэг нь true бол харуулна
  const shouldShow = isLoading || forceShow;

  return (
    <AnimatePresence>
      {shouldShow && (
        <>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');
            `}
          </style>

          <motion.div
            key="global-loader" // AnimatePresence зөв ажиллахад key чухал
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/assets/background.jpg')", // Зам дээр '/' нэмсэн нь илүү найдвартай
                backgroundColor: '#003026' 
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
              className="mb-12 -mt-24 relative"
            >
              <img 
                src="/assets/logo2.png" // '/' нэмэв
                alt="Baavar Suglaa Logo" 
                className="w-60 md:w-96 object-contain drop-shadow-lg" 
              />
            </motion.div>

            {/* Spinner */}
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { delay: 0.2 },
                rotate: { repeat: Infinity, duration: 1, ease: "linear" } 
              }}
              className="mb-8 w-12 h-12 rounded-full border-4 border-t-[#FAD766] border-r-[#FAD766]/30 border-b-[#FAD766]/10 border-l-[#FAD766]/50"
            />

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
              className="text-center px-4"
            >
                <p 
                style={{
                    fontFamily: "'Play', sans-serif",
                    fontWeight: 400,
                    fontSize: '24px',
                    lineHeight: '130%', // Бага зэрэг нэмэв (текст давхардахаас сэргийлнэ)
                    letterSpacing: '0.21em',
                    color: '#FAD766',
                    textTransform: 'uppercase',
                    maxWidth: '520px', 
                    margin: '0 auto',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)' // Уншигдацыг сайжруулах сүүдэр
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