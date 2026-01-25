import React, { useRef, useEffect, useState } from 'react';

const WINNERS_DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const WinnersScreen = () => {
  return (
    <div className="w-full flex flex-col pt-28 md:pt-32 pb-20 space-y-6 md:space-y-6 overflow-x-hidden">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          
          @media (max-width: 767px) {
            .snap-container {
              scroll-snap-type: x mandatory;
              scroll-behavior: smooth;
            }
            .snap-item {
              scroll-snap-align: center;
            }
          }

          @media (min-width: 768px) {
            .snap-container {
              scroll-snap-type: none !important;
              scroll-behavior: auto !important;
            }
          }
        `}
      </style>

      <WinnerSection title="Баавар ялагчид" />
      <WinnerSection title="Нүнжиг ялагчид" />
      <WinnerSection title="Сүншиг ялагчид" />
    </div>
  );
};

const WinnerSection = ({ title }) => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      // Зөвхөн Desktop дээр чирэх логик ажиллана
      if (window.innerWidth < 768) return;
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.clientX;
      scrollLeft = slider.scrollLeft;
      slider.style.userSelect = 'none';
    };

    const onMouseLeave = () => {
      isDown = false;
      slider.style.cursor = 'grab';
    };

    const onMouseUp = () => {
      isDown = false;
      slider.style.cursor = 'grab';
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.clientX;
      const walk = (x - startX) * 2.5; 
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mouseleave', onMouseLeave);
    slider.addEventListener('mouseup', onMouseUp);
    slider.addEventListener('mousemove', onMouseMove);

    return () => {
      slider.removeEventListener('mousedown', onMouseDown);
      slider.removeEventListener('mouseleave', onMouseLeave);
      slider.removeEventListener('mouseup', onMouseUp);
      slider.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const itemWidth = container.querySelector('.snap-item').offsetWidth + 16;
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-3 md:gap-4 relative">
      <h2 className="font-bold text-xl md:text-2xl pl-8 md:pl-[232px] text-black leading-none">
        {title}
      </h2>
      
      <div className="relative w-full md:px-[232px] group">
        
        {/* Зүүн сум: Mobile дээр харагдана, Desktop дээр hover үед тодорно */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 md:left-[242px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all md:opacity-0 md:group-hover:opacity-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div 
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 pb-4 px-8 md:px-0 scrollbar-hide snap-container select-none cursor-grab active:cursor-grabbing"
        >
          {WINNERS_DATA.map((_, i) => (
            <div 
              key={i} 
              className="snap-item relative shrink-0 shadow-xl rounded-2xl overflow-hidden bg-[#d1d1d1] w-[160px] md:w-[220px]" 
              style={{ aspectRatio: '222/268' }}
            >
              <img 
                src="/win/win1.jpg" 
                alt="Winner" 
                className="w-full h-full object-cover pointer-events-none"
                draggable="false"
              />
            </div>
          ))}
        </div>

        {/* Баруун сум: Mobile дээр харагдана, Desktop дээр hover үед тодорно */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 md:right-[242px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all md:opacity-0 md:group-hover:opacity-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WinnersScreen;