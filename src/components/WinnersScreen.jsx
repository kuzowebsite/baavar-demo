import React, { useRef, useState } from 'react';
import Footer from './Footer';

const WINNERS_DATA = [1, 2, 3, 4, 5, 6, 7, 8];

const WinnersScreen = () => {
  return (
    <div className="h-screen w-full bg-[#E0E0E0] flex flex-col font-sans overflow-y-auto overflow-x-hidden">
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');
          .font-play { font-family: 'Play', sans-serif; }

          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {/* --- CONTENT AREA --- */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto pt-35 pb-24 space-y-4">
        <WinnerSection title="Баавар ялагчид" />
        <WinnerSection title="Нүнжиг ялагчид" />
        <WinnerSection title="Сүншиг ялагчид" />
      </main>

      <Footer />
    </div>
  );
};

// --- DRAG TO SCROLL LOGIC ---
const useDraggableScroll = () => {
    const ref = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX) * 1.5; 
        ref.current.scrollLeft = scrollLeft - walk;
    };

    return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove };
};

// --- SECTION COMPONENT ---
const WinnerSection = ({ title }) => {
  const { ref, ...events } = useDraggableScroll();

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Гарчигны ирмэг px-6 md:px-10 */}
      <h2 className="font-play font-bold text-xl md:text-[30px] text-black leading-none px-6 md:px-10">
        {title}
      </h2>

      {/* 2. Гадна талын контейнерт гарчигтай ижил padding (px-6 md:px-10) өгч, 
          overflow-hidden болгосноор зураг зүүн тийш гарахдаа энэ шугамаар тасарна. */}
      <div className="overflow-hidden px-6 md:px-10">
        <div 
          ref={ref}
          {...events}
          /* 3. Дотор талын scroll-д нэмэлт padding-г 'clip' хийхгүйн тулд 
             padding-г нь хасаж, зөвхөн overflow-x-auto-г үлдээв. */
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none touch-pan-y pointer-events-auto"
        >
          {WINNERS_DATA.map((_, index) => (
            <WinnerCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- CARD COMPONENT ---
const WinnerCard = () => {
  return (
    <div 
        className="relative overflow-hidden group shrink-0 shadow-md hover:shadow-xl transition-shadow duration-300"
        style={{
            width: '200px',
            aspectRatio: '222/268', 
            borderRadius: '12px',
            backgroundColor: '#d1d1d1' 
        }}
    >
        <img 
            src="/win/win1.jpg" 
            draggable={false} 
            alt="Winner" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
    </div>
  );
};

export default WinnersScreen;