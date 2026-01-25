// src/components/BodyContent.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay, Navigation } from 'swiper/modules';
import PurchaseDialog from './PurchaseDialog'; 

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const BodyContent = ({ onLottoClick }) => { 
  const [swiperRef, setSwiperRef] = useState(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false); 
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedLotto, setSelectedLotto] = useState(null);

  // Дэлгэцийн хэмжээнээс хамаарч утгуудыг динамикаар тооцоолох
  const [mobileSlideSize, setMobileSlideSize] = useState({ width: 340, height: 500 });

  useEffect(() => {
    const handleResize = () => {
      const designWidth = 1920;
      const designHeight = 1080;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const mobileCheck = windowWidth < 1024;
      setIsMobile(mobileCheck);

      if (mobileCheck) {
        // MOBILE & TABLET LOGIC
        setScale(1); 
        
        // ---------------------------------------------------------
        // ӨӨРЧЛӨЛТ ХИЙСЭН ХЭСЭГ (ДАХИН ЖИЖИГРҮҮЛЭВ):
        // Хуучин: Math.min(windowWidth * 0.75, 380);
        // Шинэ: Math.min(windowWidth * 0.65, 300); -> 65% болгож, max хэмжээг 300px болгов
        // ---------------------------------------------------------
        
        // Энд 0.65 гэдэг нь дэлгэцийн өргөний 65% гэсэн үг.
        // Хэрэв бүр жижиг болгомоор байвал 0.60 болгож болно.
        const mWidth = Math.min(windowWidth * 0.60, 300); 
        
        // Өндрийн харьцаа (Width x 1.45) хэвээр үлдээв
        const mHeight = mWidth * 1.45; 
        
        setMobileSlideSize({ width: mWidth, height: mHeight });

      } else {
        // DESKTOP LOGIC
        const widthScale = windowWidth / designWidth;
        const heightScale = windowHeight / designHeight;
        const finalScale = Math.min(widthScale, heightScale) * 0.9; 
        setScale(finalScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const baseLottoList = [
    { 
        id: 1, 
        title: "lexus RX 2026", 
        price: "30,000₮", 
        displayPrice: "30,000₮", 
        imageUrl: "/suglaa/1.png", 
        code: "AZ001", 
        fillPercent: 90 
    },
    { 
        id: 2, 
        title: "Iphone 17 Pro", 
        price: "5,000₮", 
        displayPrice: "5,000₮", 
        imageUrl: "/suglaa/2.png", 
        code: "AZ002", 
        fillPercent: 45 
    },
    { 
        id: 3, 
        title: "LAND CRUISER 300", 
        price: "20,000₮", 
        displayPrice: "20,000₮", 
        imageUrl: "/suglaa/3.jpeg", 
        code: "AZ003", 
        fillPercent: 70 
    },
    { 
        id: 4, 
        title: "Apartment 3 Rooms", 
        price: "50,000₮", 
        displayPrice: "50,000₮", 
        imageUrl: "/suglaa/4.jpeg", 
        code: "AZ004", 
        fillPercent: 20 
    },
    { 
        id: 5, 
        title: "BONUS SUGLAA", 
        price: "0₮",          
        displayPrice: "Үнэгүй", 
        imageUrl: "/suglaa/1.png", 
        code: "FR001", 
        fillPercent: 10 
    },
  ];

  const displayList = useMemo(() => {
    return [...baseLottoList, ...baseLottoList, ...baseLottoList].map((item, index) => ({
        ...item,
        uniqueId: `${item.id}-${index}`
      }));
  }, []);

  // DESKTOP CONFIG
  const DESKTOP_SLIDE_WIDTH = 540;
  const DESKTOP_SLIDE_HEIGHT = 680;
  
  // Dynamic Sizes based on Device
  const SLIDE_WIDTH_ACTIVE = isMobile ? mobileSlideSize.width : DESKTOP_SLIDE_WIDTH;
  const SLIDE_HEIGHT_ACTIVE = isMobile ? mobileSlideSize.height : DESKTOP_SLIDE_HEIGHT;
  
  // Mobile дээр зургийн өндрийг арай багасгаж контентод зай гаргах
  const IMAGE_HEIGHT_ACTIVE = Math.round(SLIDE_HEIGHT_ACTIVE * (isMobile ? 0.75 : 0.80)); 
  const CONTENT_HEIGHT = SLIDE_HEIGHT_ACTIVE - IMAGE_HEIGHT_ACTIVE; 
  const CONTAINER_HEIGHT = 760;

  const handlePurchaseClick = (item) => {
      setSelectedLotto(item);
      setShowPurchaseDialog(true);
  };

  const closePurchaseDialog = () => {
      setShowPurchaseDialog(false);
      setSelectedLotto(null);
  };

  return (
    <>
      <style>
        {`
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');
            
            header, .header-container {
                animation: none !important;
                transform: none !important;
                top: 0 !important;
            }

            .custom-swiper { width: 100%; height: 100%; padding-top: 20px; padding-bottom: 20px; overflow: visible !important; }
            .swiper-wrapper { 
                align-items: center; 
                transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1) !important;
            }
            
            .swiper-slide { 
                /* Mobile дээр идэвхгүй слайд арай жижиг */
                width: ${isMobile ? mobileSlideSize.width * 0.85 : 420}px !important; 
                height: ${isMobile ? mobileSlideSize.height * 0.85 : 420}px !important; 
                transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease, filter 0.8s ease; 
                filter: blur(4px); 
                opacity: 0.8; 
                border-radius: ${isMobile ? '30px' : '70px'} !important; 
                overflow: hidden; 
                user-select: none; 
                background-color: white; 
                z-index: 10; 
                cursor: default; 
            }
            .swiper-slide img { 
                width: 100%; 
                height: 100%; 
                object-fit: cover; 
                border-radius: ${isMobile ? '30px' : '70px'} !important; 
            }
            
            .swiper-slide-active { 
                width: ${SLIDE_WIDTH_ACTIVE}px !important; 
                height: ${SLIDE_HEIGHT_ACTIVE}px !important; 
                filter: blur(0px) !important; 
                opacity: 1 !important; 
                z-index: 50 !important; 
                background-color: transparent; 
                box-shadow: 0 15px 40px rgba(0,0,0,0.25); 
                border-radius: ${isMobile ? '30px' : '70px'} !important;
            }
            
            .swiper-slide-active img { 
                height: ${IMAGE_HEIGHT_ACTIVE}px !important; 
                border-bottom-left-radius: 0 !important; 
                border-bottom-right-radius: 0 !important; 
                border-top-left-radius: ${isMobile ? '30px' : '70px'} !important; 
                border-top-right-radius: ${isMobile ? '30px' : '70px'} !important; 
            }
            
            .nav-btn { 
                width: 56px; 
                height: 56px; 
                border-radius: 50%; 
                border: 2px solid #5F7D74; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                cursor: pointer; 
                transition: all 0.2s; 
                background: rgba(255,255,255,0.1); 
            }
            .nav-btn:hover { background: #5F7D74; border-color: #5F7D74; }
            .nav-btn:hover svg { stroke: white; }
            .nav-btn svg { stroke: #2F4F4F; stroke-width: 2.5; }

            /* MOBILE SPECIFIC OVERRIDES */
            @media (max-width: 1024px) {
                .swiper-slide-active img {
                    border-top-left-radius: 30px !important;
                    border-top-right-radius: 30px !important;
                }
                .mobile-title {
                    font-size: 24px !important;
                    margin-bottom: 20px;
                    margin-top: 10px;
                }
            }
        `}
      </style>

      {/* Main Container */}
      <div className="w-full relative overflow-hidden flex justify-center items-center" 
           style={{ 
               height: '100%', 
               minHeight: isMobile ? 'auto' : '600px', 
               flexGrow: 1,
               flexDirection: 'column', 
               paddingTop: isMobile ? '80px' : '0' 
           }}>
          
          <div className="relative" 
               style={{ 
                   width: isMobile ? '100%' : '1920px', 
                   height: isMobile ? 'auto' : `${CONTAINER_HEIGHT}px`, 
                   transform: isMobile ? 'none' : `scale(${scale})`, 
                   transformOrigin: 'center center',
                   display: 'flex',
                   flexDirection: isMobile ? 'column' : 'block',
                   alignItems: 'center'
               }}>
            
            {/* ГАРЧИГ */}
            <div className={isMobile ? "w-full flex justify-center z-10 px-4 mb-4" : "absolute w-full flex justify-center z-10"} 
                 style={{ top: isMobile ? '40' : '50px' }}>
                <h1 className="mobile-title"
                    style={{ 
                        fontFamily: 'Roboto, sans-serif', 
                        fontWeight: 900, 
                        fontSize: '36px', 
                        textTransform: 'uppercase', 
                        color: '#000000', 
                        letterSpacing: '1px', 
                        margin: 0,
                        textAlign: 'center',
                        lineHeight: 1.2
                    }}>
                    Монголын хамгийн том хонжворт сугалаа
                </h1>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
                <div className="absolute top-[55px] right-[150px] flex gap-4 z-40">
                    <div className="nav-btn prev-btn swiper-button-prev-custom">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </div>
                    <div className="nav-btn next-btn swiper-button-next-custom">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                </div>
            )}

            {/* Host Image */}
            {!isMobile && (
                <div className="absolute z-20 pointer-events-none" style={{ left: '80px', bottom: '-30px', height: 'auto', top: '140px'}}>
                    <img src="/assets/mongolian-woman.png" alt="Host" style={{ height: '780px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(10px 10px 20px rgba(0,0,0,0.3))' }} />
                </div>
            )}

            {/* SWIPER CONTAINER */}
            <div className={isMobile ? "w-full relative" : "absolute w-full"} 
                 style={{ 
                     top: isMobile ? '0' : '120px', 
                     height: isMobile ? `${mobileSlideSize.height + 60}px` : '700px',
                     marginTop: isMobile ? '20px' : '0'
                 }}>
                <Swiper
                    onSwiper={setSwiperRef}
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    centeredSlidesBounds={true}
                    slidesPerView={'auto'}
                    loop={true}
                    speed={1000}
                    spaceBetween={isMobile ? 15 : 60} // Mobile зайг багасгав
                    slideToClickedSlide={true}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }}
                    coverflowEffect={{ 
                        rotate: 0, 
                        stretch: 0, 
                        depth: isMobile ? 80 : 150, 
                        modifier: 1.5, 
                        slideShadows: false 
                    }}
                    modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
                    className="custom-swiper"
                >
                    {displayList.map((item) => (
                        <SwiperSlide key={item.uniqueId}>
                            {({ isActive }) => (
                                <div 
                                    className="relative w-full h-full bg-white transition-all duration-500" 
                                    style={{ borderRadius: isMobile ? '30px' : '70px' }} 
                                >
                                    <div style={{ height: isActive ? `${IMAGE_HEIGHT_ACTIVE}px` : '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-all duration-500" />
                                    </div>

                                    {isActive && (
                                        <div className="relative w-full bg-white flex flex-col items-center" 
                                             style={{ 
                                                 height: `${CONTENT_HEIGHT}px`, 
                                                 borderBottomLeftRadius: isMobile ? '30px' : '70px', 
                                                 borderBottomRightRadius: isMobile ? '30px' : '70px', 
                                                 paddingBottom: '20px' 
                                             }}>
                                            <div className="w-full relative h-[10px] bg-[#E0E0E0]">
                                                <div style={{ width: `${item.fillPercent}%` }} className="h-full bg-[#BAD301] relative">
                                                    <div className="absolute shadow-sm" style={{ width: '42px', height: '24px', backgroundColor: '#BAD301', borderRadius: '4px', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold', fontSize: '12px', right: '0', top: '50%', transform: 'translate(50%, -50%)', zIndex: 10 }}>
                                                        {item.fillPercent}%
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="w-full px-4 md:px-12 flex flex-col items-center mt-2">
                                                <h3 style={{ 
                                                    fontFamily: 'Roboto, sans-serif', 
                                                    fontWeight: 900, 
                                                    fontSize: isMobile ? '20px' : '32px', // Mobile font арай багасгав
                                                    color: '#000000', 
                                                    margin: '0', 
                                                    textTransform: 'uppercase', 
                                                    lineHeight: '1.2',
                                                    textAlign: 'center'
                                                }}>{item.title}</h3>
                                                
                                                <div style={{ width: '80%', height: '1px', backgroundColor: '#E0E0E0', marginTop: '8px', marginBottom: '12px' }}></div>
                                                
                                                <div className="w-full flex justify-between items-center gap-2">
                                                    <div className="flex items-center gap-2 flex-wrap justify-center">
                                                        <div className="flex items-center justify-center shadow-sm" style={{ backgroundColor: '#F8BE53', borderRadius: '6px', padding: '4px 10px' }}>
                                                            <span className="font-bold text-black text-[11px] md:text-[12px]">{item.displayPrice}</span>
                                                        </div>
                                                        <div className="flex items-center justify-center shadow-sm" style={{ backgroundColor: '#A6ECFF', borderRadius: '6px', padding: '4px 10px' }}>
                                                            <span className="font-bold text-black text-[11px] md:text-[12px]">{item.code}</span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePurchaseClick(item); 
                                                        }}
                                                        className="flex items-center justify-center shadow-md hover:opacity-90 transition-opacity" 
                                                        style={{ backgroundColor: '#FF6060', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', border: 'none', minWidth: '70px' }}
                                                    >
                                                        <span className="font-bold text-white text-[11px] md:text-[12px] uppercase whitespace-nowrap">Оролцох</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
          </div>

          {/* MOBILE NAV BUTTONS */}
          {isMobile && (
             <div className="flex gap-4 z-40 my-6 pb-8">
                <div className="nav-btn prev-btn swiper-button-prev-custom" style={{ borderColor: '#ccc' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </div>
                <div className="nav-btn next-btn swiper-button-next-custom" style={{ borderColor: '#ccc' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
            </div>
          )}

          {/* PURCHASE DIALOG */}
          {showPurchaseDialog && selectedLotto && (
              <PurchaseDialog 
                  title={selectedLotto.title}
                  basePrice={parseInt(selectedLotto.price.replace(/[^0-9]/g, '')) || 0} 
                  onClose={closePurchaseDialog}
              />
          )}

      </div>
    </>
  );
};

export default BodyContent;