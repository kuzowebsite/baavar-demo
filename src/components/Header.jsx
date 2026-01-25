import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Header = ({ onNavigate, selectedIndex, onMenuPressed }) => {
  const [tickerData, setTickerData] = useState([]);

  // --- TICKER DATA LOAD ---
  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem('baavar_tickets') || '[]');

    if (storedTickets.length > 0) {
        const latestTimestamp = Math.max(...storedTickets.map(t => t.timestamp));
        const latestBatch = storedTickets.filter(t => t.timestamp === latestTimestamp);

        const formattedData = latestBatch.map(t => ({
            maskedPhone: t.phoneNumber ? t.phoneNumber.substring(0, 4) : 'xxxx', 
            title: t.title,
            code: t.code,
        }));

        setTickerData(formattedData);
    } else {
        setTickerData([]);
    }

  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');
          
          /* Ticker Animation */
          @keyframes ticker {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-ticker {
            display: inline-block;
            white-space: nowrap;
            animation: ticker 60s linear infinite; 
          }
          .ticker-container:hover .animate-ticker {
             animation-play-state: paused;
          }
        `}
      </style>

      {/* --- ҮНДСЭН HEADER --- */}
      {/* ЗАСВАР: motion.header байсныг энгийн header болгож, animation тохиргоог хасав */}
      <header 
        className="fixed top-0 z-50 w-full shadow-sm flex flex-col"
      >
        {/* BACKGROUND LAYER */}
        <div className="absolute inset-0 z-0">
            <img 
                src="/assets/background.jpg" 
                alt="Header Background" 
                className="w-full h-full object-cover"
            />
        </div>

        {/* CONTENT LAYER */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto h-[80px] md:h-[100px] flex items-center justify-between
                        px-5 md:px-8 xl:px-[120px]">
          
          {/* --- ЗҮҮН ТАЛ: Лого --- */}
          <div 
            className="cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => onNavigate(0)}
          >
              <img 
                src="/assets/logo.png" 
                alt="Baavar Logo" 
                className="w-[120px] md:w-[160px] xl:w-[190px] h-auto object-contain drop-shadow-lg" 
              />
          </div>

          {/* --- БАРУУН ТАЛ: Цэс --- */}
          <nav className="hidden md:flex items-center gap-5 xl:gap-[35px]">
              <NavButton 
                  text="Баавар Сугалаа" 
                  active={selectedIndex === 0} 
                  onClick={() => onNavigate(0)} 
                  width={120} 
              />
              <NavButton 
                  text="Сугалаа шалгах" 
                  active={selectedIndex === 1} 
                  onClick={() => onNavigate(1)} 
                  width={125} 
              />
              <NavButton 
                  text="Ялагчид" 
                  active={selectedIndex === 2} 
                  onClick={() => onNavigate(2)} 
                  width={65} 
              />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden text-white">
            <button onClick={onMenuPressed}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
          </div>

        </div>

        {/* --- TICKER SECTION --- */}
        {tickerData.length > 0 && (
            <div className="w-full bg-black/40 border-t border-white/10 overflow-hidden py-1 relative z-10 ticker-container">
                <div className="w-full overflow-hidden relative flex items-center min-h-[16px]">
                    <div className="animate-ticker pl-[100%] flex items-center gap-16">
                        {tickerData.map((item, index) => (
                            <span 
                                key={index} 
                                className="text-[8px] font-sans uppercase tracking-wider inline-flex items-center gap-2 whitespace-nowrap text-[#CBB373]"
                            >
                                <span className="w-1 h-1 rounded-full bg-[#c0c0c0] animate-pulse box-shadow-gold"></span>
                                <span>
                                    <span className="text-[#c0c0c0] font-bold mx-1">{item.maskedPhone}****</span> 
                                    дугаартай хэрэглэгч 
                                    <span className="text-white border-b border-[#FFD700]/30 mx-1">{item.title}</span> 
                                    сугалааг авлаа. 
                                    <span className="opacity-70 ml-1">({item.code})</span>
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </header>
    </>
  );
};

// --- NavButton Component ---
const NavButton = ({ text, active, onClick, width }) => (
  <button 
    onClick={onClick} 
    style={{ width: width ? `${width}px` : 'auto' }}
    className="relative group py-1 flex justify-center" 
  >
    <span 
      className={`
        uppercase font-normal text-[11px] md:text-[12px] xl:text-[14px] transition-all duration-300 font-['Play'] whitespace-nowrap
        ${active ? 'text-white' : 'text-white/80 hover:text-white'}
      `}
    >
      {text}
    </span>
    {active && (
        <motion.div 
            layoutId="underline"
            className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
    )}
  </button>
);

export default Header;