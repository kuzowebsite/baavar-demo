import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Header = ({ onNavigate, selectedIndex, onMenuPressed }) => {
  const [tickerData, setTickerData] = useState([]);

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
    }
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');
          
          /* Бүрэлзэлтийг арилгах үндсэн тохиргоо */
          header, img, span, button {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            backface-visibility: hidden;
            transform: translateZ(0); /* GPU acceleration идэвхжүүлж бүрэлзэлтийг багасгана */
          }

          @keyframes ticker {
            0% { transform: translate3d(100%, 0, 0); }
            100% { transform: translate3d(-100%, 0, 0); }
          }
          .animate-ticker {
            display: inline-block;
            white-space: nowrap;
            animation: ticker 60s linear infinite; 
            will-change: transform;
          }
        `}
      </style>

      {/* header дэх "flex flex-col"-ийг "block"-оор сольж үзэх (бүрэлзэлт арилах магадлалтай) */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-sm overflow-hidden">
        
        {/* BACKGROUND LAYER - Зургийг арай тод, цэвэрхэн харагдуулах */}
        <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
                src="/assets/background.jpg" 
                alt="Header Background" 
                className="w-full h-full object-cover scale-105" /* Ирмэг бүрэлзэхээс сэргийлж бага зэрэг томруулав */
                loading="eager"
            />
            {/* Бага зэрэг хар туяа нэмж лого болон бичвэрийг тодруулж өгөх */}
            <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* CONTENT LAYER */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto h-[70px] md:h-[100px] flex items-center justify-between px-5 md:px-8 xl:px-[120px]">
          
          {/* LOGO - Дүрсний чанарыг сайжруулах */}
          <div 
            className="cursor-pointer active:scale-95 transition-transform" 
            onClick={() => onNavigate(0)}
          >
              <img 
                src="/assets/logo.png" 
                alt="Baavar Logo" 
                className="w-[110px] md:w-[160px] xl:w-[190px] h-auto object-contain drop-shadow-2xl"
                style={{ imageRendering: 'auto' }} 
              />
          </div>

          {/* NAV BUTTONS */}
          <nav className="hidden md:flex items-center gap-5 xl:gap-[35px]">
              <NavButton text="Баавар Сугалаа" active={selectedIndex === 0} onClick={() => onNavigate(0)} width={120} />
              <NavButton text="Сугалаа шалгах" active={selectedIndex === 1} onClick={() => onNavigate(1)} width={125} />
              <NavButton text="Ялагчид" active={selectedIndex === 2} onClick={() => onNavigate(2)} width={65} />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden pr-2"> {/* pr-2 эсвэл pr-4 нэмж зүүн тийш нь түлхэнэ */}
  <button 
    onClick={onMenuPressed}
    className="p-2 text-white flex flex-col items-center gap-[5px] bg-transparent border-none outline-none group"
    style={{ WebkitTapHighlightColor: 'transparent' }}
  >
    {/* Дээд талын богино зураас */}
    <span className="w-3 h-[2px] bg-white rounded-full transition-all duration-300 group-hover:w-5"></span>
    
    {/* Голын урт зураас */}
    <span className="w-5 h-[1.5px] bg-white rounded-full transition-all duration-300"></span>
    
    {/* Доод талын богино зураас */}
    <span className="w-3 h-[2px] bg-white rounded-full transition-all duration-300 group-hover:w-5"></span>
  </button>
</div>
        </div>

        {/* TICKER SECTION */}
        {tickerData.length > 0 && (
            <div className="w-full bg-black/60 border-t border-white/10 overflow-hidden py-1.5 relative z-10 ticker-container backdrop-blur-md">
                <div className="animate-ticker flex items-center gap-16">
                    {tickerData.map((item, index) => (
                        <span key={index} className="text-[10px] font-sans uppercase tracking-wider flex items-center gap-2 text-[#FAD766]">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            <span className="text-white/90">
                                <b className="text-white">{item.maskedPhone}****</b> дугаартай хэрэглэгч 
                                <span className="mx-1 text-[#FAD766]">{item.title}</span> авлаа.
                            </span>
                        </span>
                    ))}
                </div>
            </div>
        )}
      </header>
    </>
  );
};

const NavButton = ({ text, active, onClick, width }) => (
  <button 
    onClick={onClick} 
    style={{ width: width ? `${width}px` : 'auto' }}
    className="relative py-1 flex justify-center" 
  >
    <span className={`uppercase font-normal text-[11px] md:text-[14px] font-['Play'] ${active ? 'text-white' : 'text-white/70'}`}>
      {text}
    </span>
    {active && (
        <motion.div layoutId="underline" className="absolute -bottom-1 left-0 w-full h-[2px] bg-white shadow-[0_0_10px_white]" />
    )}
  </button>
);

export default Header;