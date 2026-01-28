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
  const [isPhone, setIsPhone] = useState(false);

  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedLotto, setSelectedLotto] = useState(null);

  const [mobileSlideSize, setMobileSlideSize] = useState({ width: 340, height: 500 });

  useEffect(() => {
    const handleResize = () => {
      const designWidth = 1920;
      const designHeight = 1080;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const mobileCheck = windowWidth <= 1024;
      setIsMobile(mobileCheck);

      const phoneCheck = windowWidth < 740;
      setIsPhone(phoneCheck);

      if (mobileCheck) {
        setScale(1); 
        
        if (windowWidth >= 740) {
            setMobileSlideSize({ width: 330, height: 420 });
        } else {
            const mWidth = Math.min(windowWidth * 0.70, 270); 
            const mHeight = mWidth * 1.25; 
            setMobileSlideSize({ width: mWidth, height: mHeight });
        }

      } else {
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
    { id: 1, title: "lexus RX 2026", price: "30,000₮", displayPrice: "30,000₮", imageUrl: "/suglaa/1.png", code: "BS001", type: "Баавар сугалаа", fillPercent: 90 },
    { id: 2, title: "Iphone 17 Pro", price: "5,000₮", displayPrice: "5,000₮", imageUrl: "/suglaa/2.png", code: "NS001", type: "Нүнжиг сугалаа", fillPercent: 45 },
    { id: 3, title: "LAND CRUISER 300", price: "20,000₮", displayPrice: "20,000₮", imageUrl: "/suglaa/3.jpeg", code: "SS001", type: "Сүншиг сугалаа", fillPercent: 70 },
    { id: 4, title: "Apartment 3 Rooms", price: "50,000₮", displayPrice: "50,000₮", imageUrl: "/suglaa/4.jpeg", code: "BS002", type: "Баавар сугалаа", fillPercent: 20 },
    { id: 5, title: "BONUS SUGLAA", price: "0₮", displayPrice: "Үнэгүй", imageUrl: "/suglaa/1.png", code: "FR001", type: "Үнэгүй сугалаа", fillPercent: 10 },
  ];

  const displayList = useMemo(() => {
    return [...baseLottoList, ...baseLottoList, ...baseLottoList].map((item, index) => ({
        ...item,
        uniqueId: `${item.id}-${index}`
      }));
  }, []);

  const DESKTOP_SLIDE_WIDTH = 540;
  const DESKTOP_SLIDE_HEIGHT = 680;
  
  const SLIDE_WIDTH_ACTIVE = isMobile ? mobileSlideSize.width : DESKTOP_SLIDE_WIDTH;
  const SLIDE_HEIGHT_ACTIVE = isMobile ? mobileSlideSize.height : DESKTOP_SLIDE_HEIGHT;
  
  const RATIO = isMobile ? 0.79 : 0.80; 
  const SHIFT_DOWN = isMobile ? 0 : 0; 

  const IMAGE_HEIGHT_ACTIVE = Math.round(SLIDE_HEIGHT_ACTIVE * RATIO) - SHIFT_DOWN; 
  const CONTENT_HEIGHT = SLIDE_HEIGHT_ACTIVE - Math.round(SLIDE_HEIGHT_ACTIVE * RATIO); 
  
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
              width: ${isMobile ? mobileSlideSize.width * 0.85 : 420}px !important; 
              height: ${isMobile ? mobileSlideSize.height * 0.85 : 420}px !important; 
              transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease, filter 0.8s ease; 
              filter: blur(4px); 
              opacity: 0.8; 
              border-radius: ${isMobile ? '20px' : '70px'} !important; 
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
              border-radius: ${isMobile ? '20px' : '70px'} !important; 
          }
          
          .swiper-slide-active { 
              width: ${SLIDE_WIDTH_ACTIVE}px !important; 
              height: ${SLIDE_HEIGHT_ACTIVE}px !important; 
              filter: blur(0px) !important; 
              opacity: 1 !important; 
              z-index: 50 !important; 
              background-color: transparent; 
              box-shadow: 0 15px 40px rgba(0,0,0,0.25); 
              border-radius: ${isMobile ? '20px' : '70px'} !important;
          }
          
          .swiper-slide-active img { 
              height: ${IMAGE_HEIGHT_ACTIVE}px !important; 
              border-bottom-left-radius: 0 !important; 
              border-bottom-right-radius: 0 !important; 
              border-top-left-radius: ${isMobile ? '20px' : '70px'} !important; 
              border-top-right-radius: ${isMobile ? '20px' : '70px'} !important; 
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

          /* TABLET SPECIFIC */
          @media (min-width: 740px) and (max-width: 1023px) {
              .mobile-title {
                  margin-top: 50px !important; 
                  font-size: 27px !important; 
                  margin-bottom: 25px !important;
              }
              .mobile-subtitle {
                  margin-top: 10px !important;
                  margin-bottom: 30px !important;
                  font-size: 26px !important;
              }
              .mobile-host-container img {
                  height: 620px !important; 
                  transform: translateY(0px) scale(1.1) !important; 
              }
              .mobile-host-container {
                    margin-left: -10px !important; 
                    margin-top: -130px !important; 
              }
              .nav-btn { width: 56px !important; height: 56px !important; }
          }

          /* IPAD PRO SPECIFIC */
          @media (min-width: 1024px) and (max-width: 1024px) {
               .mobile-title {
                  margin-top: 80px !important; 
                  font-size: 32px !important; 
                  margin-bottom: 30px !important;
              }
              .mobile-subtitle {
                  margin-top: 15px !important;
                  margin-bottom: 40px !important;
                  font-size: 28px !important;
              }
              .mobile-host-container img {
                  height: 600px !important; 
                  transform: translateY(0px) scale(1.1) !important; 
              }
              .mobile-host-container {
                    margin-left: -80px !important; 
                    margin-top: -30px !important; 
              }
              .nav-btn { width: 64px !important; height: 64px !important; }
              .swiper-container-wrapper { margin-top: 40px !important; }
          }

          /* STANDARD MOBILE */
          @media (max-width: 739px) {
              .custom-swiper {
                  padding-top: 10px !important; 
                  padding-bottom: 10px !important; 
              }
              .mobile-title {
                  font-size: 24px !important;
                  margin-bottom: 0px; 
                  margin-top: 0px; 
              }
              .mobile-main-container {
                  padding-top: 80px !important;
                  height: auto !important; /* Allow growing */
                  overflow-y: auto !important; /* Enable Native Scroll */
              }
          }
        `}
      </style>

      {/* Main Container */}
      <div className={`w-full relative flex ${isMobile ? 'mobile-main-container' : 'overflow-hidden'}`} 
           style={{ 
               height: isPhone ? 'auto' : '100%', 
               minHeight: isMobile ? '100vh' : '600px', 
               flexGrow: 1,
               flexDirection: 'column', 
               justifyContent: isMobile ? 'flex-start' : 'center', 
               alignItems: 'center',
               paddingTop: isMobile ? '100px' : '0',
               overflowY: isPhone ? 'auto' : 'hidden'
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
            <div className={isMobile ? "w-full flex flex-col items-center justify-center z-10 px-4 mb-2" : "absolute w-full flex justify-center z-10"} 
                 style={{ top: isMobile ? '0' : '50px' }}>
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
                
                {isMobile && !isPhone && (
                    <h2 className="mobile-subtitle" style={{
                        fontFamily: 'Roboto, sans-serif', fontWeight: 900, fontSize: '20px',
                        color: '#333333', textTransform: 'uppercase', margin: '60px 0 0 0', textAlign: 'center'
                    }}>
                        Сугалаанууд:
                    </h2>
                )}
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
                <div className="absolute top-[55px] right-[150px] flex gap-4 z-40">
                    <div className="nav-btn prev-btn" onClick={() => swiperRef?.slidePrev()}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </div>
                    <div className="nav-btn next-btn" onClick={() => swiperRef?.slideNext()}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                </div>
            )}

            {/* Host Image - DESKTOP ONLY */}
            {!isMobile && (
                <div className="absolute z-20 pointer-events-none" style={{ left: '80px', bottom: '-30px', height: 'auto', top: '140px'}}>
                    <img src="/assets/mongolian-woman.png" alt="Host" style={{ height: '780px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(10px 10px 20px rgba(0,0,0,0.3))' }} />
                </div>
            )}

            {/* ========================================================= */}
            {/* SWIPER CONTAINER (Only for Desktop and Tablets)           */}
            {/* ========================================================= */}
            {!isPhone && (
                <div className={`${isMobile ? "w-full relative swiper-container-wrapper" : "absolute w-full"}`} 
                     style={{ 
                          top: isMobile ? '0' : '120px', 
                          height: isMobile ? `${mobileSlideSize.height}px` : '700px',
                          marginTop: isMobile ? '20px' : '0'
                     }}>
                    
                    {/* Tablet Navigation */}
                    {isMobile && (
                        <>
                            <div className="nav-btn prev-btn absolute" onClick={() => swiperRef?.slidePrev()}
                                style={{ zIndex: 60, left: '10px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid #ccc' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                            </div>
                            <div className="nav-btn next-btn absolute" onClick={() => swiperRef?.slideNext()}
                                style={{ zIndex: 60, right: '10px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid #ccc' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                            </div>
                        </>
                    )}

                    <Swiper
                        onSwiper={setSwiperRef}
                        direction={'horizontal'} 
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        centeredSlidesBounds={true}
                        slidesPerView={'auto'}
                        loop={true}
                        speed={1000}
                        slidesPerGroup={1} 
                        spaceBetween={isMobile ? 50 : 60}
                        slideToClickedSlide={true}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        coverflowEffect={{ rotate: 0, stretch: 0, depth: isMobile ? 80 : 150, modifier: 1.5, slideShadows: false }}
                        modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
                        className="custom-swiper"
                    >
                        {displayList.map((item) => (
                            <SwiperSlide key={item.uniqueId}>
                                {({ isActive }) => (
                                    // ӨӨРЧИЛСӨН: cursor-pointer болон onClick нэмсэн
                                    <div className="relative w-full h-full bg-white transition-all duration-500 cursor-pointer" 
                                         onClick={() => handlePurchaseClick(item)}
                                         style={{ 
                                              borderRadius: isMobile ? '20px' : '70px',
                                              paddingTop: isMobile ? `${SHIFT_DOWN}px` : '0', 
                                              boxSizing: 'border-box' 
                                         }}>
                                            {/* IMAGE - Padding removed here */}
                                            <div style={{ 
                                                height: isActive ? `${IMAGE_HEIGHT_ACTIVE}px` : '100%', 
                                                width: '100%', position: 'relative', overflow: 'hidden',
                                                paddingBottom: '0' 
                                            }}>
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-all duration-500"
                                                    style={{ display: 'block', objectPosition: 'center bottom',
                                                        borderTopLeftRadius: isMobile ? '20px' : '70px', borderTopRightRadius: isMobile ? '20px' : '70px'
                                                    }} />
                                            </div>

                                            {/* CONTENT (Active only) */}
                                            {isActive && (
                                                <CardContent item={item} isMobile={isMobile} CONTENT_HEIGHT={CONTENT_HEIGHT} handlePurchaseClick={handlePurchaseClick} />
                                            )}
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* ========================================================= */}
            {/* PHONE FEED VIEW (Зөвхөн утсан дээр энгийн жагсаалт)       */}
            {/* ========================================================= */}
            {isPhone && (
                <div className="w-full flex flex-col items-center gap-8 pb-20 mt-4">
                    {baseLottoList.map((item, index) => (
                        // ӨӨРЧИЛСӨН: cursor-pointer болон onClick нэмсэн
                        <div key={`${item.id}-feed-${index}`} 
                             className="relative bg-transparent shadow-[0_15px_40px_rgba(0,0,0,0.25)] cursor-pointer"
                             onClick={() => handlePurchaseClick(item)}
                             style={{
                                 width: `${mobileSlideSize.width}px`,
                                 height: `${mobileSlideSize.height}px`,
                                 borderRadius: '20px',
                             }}>
                             
                             {/* IMAGE SECTION - Padding removed here too */}
                             <div style={{ 
                                     height: `${IMAGE_HEIGHT_ACTIVE}px`, 
                                     width: '100%', 
                                     position: 'relative', 
                                     overflow: 'hidden',
                                     paddingBottom: '0' 
                                 }}>
                                     <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover"
                                         style={{ 
                                             display: 'block', 
                                             objectPosition: 'center bottom',
                                             borderTopLeftRadius: '20px', 
                                             borderTopRightRadius: '20px'
                                         }} 
                                     />
                             </div>

                             {/* CONTENT SECTION (Always Visible on Feed) */}
                             <CardContent item={item} isMobile={true} CONTENT_HEIGHT={CONTENT_HEIGHT} handlePurchaseClick={handlePurchaseClick} />
                        </div>
                    ))}
                </div>
            )}

            {/* Host Image - TABLET ONLY (isPhone үед харагдахгүй) */}
            {isMobile && !isPhone && (
                <div className="w-full flex justify-start items-end mt-4 relative z-0 mobile-host-container"
                     style={{ marginTop: '1px', marginLeft: '-100px', transform: 'translateY(0px)' }}>
                    <img src="/assets/mongolian-woman.png" alt="Host" 
                        style={{ width: 'auto', height: '360px', objectFit: 'contain', filter: 'drop-shadow(0px 5px 15px rgba(0,0,0,0.2))' }} />
                </div>
            )}

          </div>

          {/* PURCHASE DIALOG */}
          {showPurchaseDialog && selectedLotto && (
              <PurchaseDialog 
                  title={selectedLotto.title}
                  lotteryCode={selectedLotto.code}
                  lotteryType={selectedLotto.type}
                  basePrice={parseInt(selectedLotto.price.replace(/[^0-9]/g, '')) || 0} 
                  onClose={closePurchaseDialog}
              />
          )}

      </div>
    </>
  );
};

// ТУСЛАХ COMPONENT: Кард доторх мэдээллийн хэсэг
const CardContent = ({ item, isMobile, CONTENT_HEIGHT, handlePurchaseClick }) => {
    return (
        <div className="relative w-full bg-white flex flex-col items-center" 
            style={{ 
                height: `${CONTENT_HEIGHT}px`, 
                borderBottomLeftRadius: isMobile ? '20px' : '70px', 
                borderBottomRightRadius: isMobile ? '20px' : '70px', 
                paddingBottom: isMobile ? '5px' : '20px' 
            }}>
            
            {/* Progress Bar */}
            <div className="w-full relative h-[8px] md:h-[10px] bg-[#E0E0E0]">
                <div style={{ width: `${item.fillPercent}%` }} className="h-full bg-[#BAD301] relative">
                    <div className="absolute shadow-sm" 
                        style={{ 
                            width: isMobile ? '28px' : '42px',
                            height: isMobile ? '16px' : '24px',
                            backgroundColor: '#BAD301', 
                            borderRadius: '4px', 
                            border: '1px solid white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            color: 'black', fontWeight: 'bold', 
                            fontSize: isMobile ? '8px' : '12px', 
                            right: '0', top: '50%', transform: 'translate(50%, -50%)', 
                            zIndex: 10 
                        }}>
                        {item.fillPercent}%
                    </div>
                </div>
            </div>
            
            <div className="w-full px-3 md:px-12 flex flex-col items-center mt-1 md:mt-2">
                <h3 style={{ 
                    fontFamily: 'Roboto, sans-serif', fontWeight: 900, 
                    fontSize: isMobile ? '18px' : '32px', color: '#000000', margin: '0', 
                    textTransform: 'uppercase', lineHeight: '1.2', textAlign: 'center'
                }}>{item.title}</h3>
                
                <div style={{ width: '80%', height: '1px', backgroundColor: '#E0E0E0', marginTop: isMobile ? '4px' : '8px', marginBottom: isMobile ? '6px' : '12px' }}></div>
                
                <div className="w-full flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1 md:gap-2 flex-wrap justify-center" style={{ marginLeft: isMobile ? '10px' : '0' }}>
                        <div className="flex items-center justify-center shadow-sm" style={{ backgroundColor: '#F8BE53', borderRadius: '6px', padding: isMobile ? '2px 8px' : '4px 10px' }}>
                            <span className="font-bold text-black text-[10px] md:text-[12px]">{item.displayPrice}</span>
                        </div>
                        <div className="flex items-center justify-center shadow-sm" style={{ backgroundColor: '#A6ECFF', borderRadius: '6px', padding: isMobile ? '2px 8px' : '4px 10px' }}>
                            <span className="font-bold text-black text-[10px] md:text-[12px]">{item.code}</span>
                        </div>
                    </div>

                    <button onClick={(e) => { e.stopPropagation(); handlePurchaseClick(item); }}
                        className="flex items-center justify-center shadow-md hover:opacity-90 transition-opacity" 
                        style={{ 
                            backgroundColor: '#FF6060', borderRadius: '6px', 
                            padding: isMobile ? '4px 10px' : '6px 12px', cursor: 'pointer', border: 'none', 
                            minWidth: isMobile ? '60px' : '70px', marginRight: isMobile ? '10px' : '0' 
                        }}>
                        <span className="font-bold text-white text-[10px] md:text-[12px] uppercase whitespace-nowrap">Оролцох</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;
