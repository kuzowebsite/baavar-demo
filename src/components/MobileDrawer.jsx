import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileDrawer = ({ isOpen, onClose, onSelect, selectedIndex }) => {
  
  const navItems = [
    { id: 0, title: "БААВАР СУГАЛАА" },
    { id: 2, title: "ЯЛАГЧИД" },
  ];

  // ANIMATION VARIANTS
  const drawerVariants = {
    closed: { 
        x: "100%",
        transition: { type: "spring", stiffness: 300, damping: 35 }
    },
    open: { 
        x: "0%",
        transition: { type: "spring", stiffness: 300, damping: 35, staggerChildren: 0.1 }
    }
  };

  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />

          {/* 2. MAIN DRAWER PANEL */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            className="fixed top-0 right-0 h-full w-[85%] max-w-[380px] z-[70] flex flex-col shadow-2xl overflow-hidden border-l border-white/10"
          >
            
            {/* --- BACKGROUND DESIGN --- */}
            <div 
                className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: "url('/assets/background.jpg')" }}
            >
                {/* Overlay to make text readable */}
                <div className="absolute inset-0 bg-black/70 backdrop-brightness-50"></div>
            </div>
            
            {/* Rotating Decoration */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute -right-20 -bottom-20 w-[300px] h-[300px] opacity-10 pointer-events-none"
                style={{
                    backgroundImage: "url('/assets/ymbuu.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat"
                }}
            />

            {/* --- CONTENT WRAPPER --- */}
            <div className="relative z-10 flex flex-col h-full px-8 py-10">

                {/* A. HEADER */}
                <motion.div variants={linkVariants} className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <img 
                        src="/assets/Baavar_logo.png" 
                        alt="Logo" 
                        className="h-10 w-auto object-contain brightness-0 invert" 
                    />
                    
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                </motion.div>


                {/* B. MENU LINKS */}
                <div className="flex-1 flex flex-col gap-10 justify-start pt-4">
                    {navItems.map((item) => {
                        const isSelected = selectedIndex === item.id;
                        return (
                            <motion.button
                                key={item.id}
                                variants={linkVariants}
                                onClick={() => onSelect(item.id)}
                                className="group relative text-left w-fit"
                            >
                                <span className={`
                                    block text-2xl font-['Cinzel'] font-bold uppercase tracking-[0.15em] transition-all duration-300 text-white
                                    ${isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}
                                `}>
                                    {item.title}
                                </span>

                                {/* Underline Indicator - Сонгогдсон үед гарч ирэх цагаан зураас */}
                                {isSelected && (
                                    <motion.div 
                                        layoutId="activeUnderline"
                                        className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>


                {/* C. BOTTOM CTA */}
                <motion.div variants={linkVariants} className="mt-auto space-y-8">
                    <button 
                        onClick={() => onSelect(1)}
                        className={`
                            relative w-full py-4 rounded-lg border border-white/20 group overflow-hidden transition-all duration-300 bg-white/5 hover:bg-white/10
                            ${selectedIndex === 1 ? 'border-white' : ''}
                        `}
                    >
                        <div className="relative z-10 flex items-center justify-between px-6 text-white">
                            <span className="font-['Cinzel'] font-bold text-[13px] tracking-[0.2em] uppercase">
                                Сугалаа шалгах
                            </span>
                            
                            <svg 
                                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                className="transform transition-transform duration-300 group-hover:translate-x-1"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </div>

                        {/* Button Underline if selected */}
                        {selectedIndex === 1 && (
                            <motion.div 
                                layoutId="activeUnderline"
                                className="absolute bottom-0 left-0 right-0 h-[3px] bg-white"
                            />
                        )}
                    </button>
                    
                    <div className="text-center opacity-40">
                        <p className="text-white text-[9px] uppercase tracking-[0.5em] font-sans font-medium">
                            © 2026 Baavar Luxury
                        </p>
                    </div>
                </motion.div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;