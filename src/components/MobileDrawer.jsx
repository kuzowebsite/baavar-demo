import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SVG ICONS (Footer.jsx-ээс авсан) ---
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

// Сошиал иконы дугуй хүрээний загвар
const DrawerSocialIcon = ({ icon }) => (
    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-sm">
        <div className="w-4 h-4">
            {icon}
        </div>
    </div>
);

const MobileDrawer = ({ isOpen, onClose, onSelect, selectedIndex }) => {
  
  const navItems = [
    { id: 0, title: "БААВАР СУГАЛАА" },
    { id: 1, title: "СУГАЛАА ШАЛГАХ" },
    { id: 2, title: "ЯЛАГЧИД" },
  ];

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
          <style>
            {`@import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');`}
          </style>

          {/* 1. BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* 2. MAIN DRAWER PANEL */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            className="fixed top-0 right-0 h-full w-[85%] max-w-[380px] z-[70] flex flex-col shadow-2xl overflow-hidden border-l border-white/20"
            style={{ fontFamily: "'Play', sans-serif" }}
          >
            
            <div 
                className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: "url('/assets/background.jpg')" }}
            />
            
            <div className="relative z-10 flex flex-col h-full px-8 py-10">

                {/* A. HEADER */}
                <motion.div variants={linkVariants} className="flex justify-between items-center mb-12 border-b border-white/50 pb-6">
                    <img 
                        src="/assets/logo.png" 
                        alt="Logo" 
                        className="h-10 w-auto object-contain drop-shadow-lg" 
                    />
                    
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/40 text-white hover:bg-black/40 transition-all duration-300"
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
                                className="group relative text-left w-full flex items-center justify-between"
                            >
                                <span className={`
                                    block text-2xl font-bold uppercase tracking-[0.1em] transition-all duration-300 text-white
                                    ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}
                                `}
                                style={{ 
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                                    fontFamily: "'Play', sans-serif" 
                                }}
                                >
                                    {item.title}
                                </span>

                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -10, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="text-white"
                                        >
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        );
                    })}
                </div>


                {/* C. FOOTER - Сошиал иконууд нэмэгдсэн */}
                <motion.div variants={linkVariants} className="mt-auto flex flex-col items-center gap-6">
                    
                    {/* Social Icons Container */}
                    <div className="flex gap-4">
                        <DrawerSocialIcon icon={<FacebookIcon />} />
                        <DrawerSocialIcon icon={<InstagramIcon />} />
                        <DrawerSocialIcon icon={<XIcon />} />
                    </div>

                    <div className="text-center opacity-60">
                        <p className="text-white text-[10px] uppercase tracking-[0.3em] font-medium" 
                           style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)', fontFamily: "'Play', sans-serif" }}>
                            © 2026 BaavarSugalaa. All Rights Reserved.
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