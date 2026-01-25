import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BodyContent from "./components/BodyContent.jsx";
import MobileDrawer from "./components/MobileDrawer.jsx";
import CheckTicketScreen from "./components/CheckTicketScreen.jsx";
import WinnersScreen from "./components/WinnersScreen.jsx";
import NotFoundScreen from "./components/NotFoundScreen.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx"; 
import { useLoading } from "./context/LoadingContext"; 

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const [selectedLotto, setSelectedLotto] = useState(null);
  
  // Апп ачаалж буйг хянах төлөв
  const [isAppInitializing, setIsAppInitializing] = useState(true);
  const { triggerLoading } = useLoading();

  useEffect(() => {
    // 1. URL зам шалгах
    const path = window.location.pathname;
    if (path !== '/' && path !== '') {
        setSelectedIndex(99);
    } else {
        setSelectedIndex(0);
    }

    // 2. Refresh хийх үед Loader-ийг заавал харуулах
    // window.onload ашиглан бүх зураг, файл ачаалж дуусахыг хүлээнэ
    const handleComplete = () => {
      setTimeout(() => {
        setIsAppInitializing(false);
      }, 1000); // 1 секунд бариад арилгана
    };

    if (document.readyState === 'complete') {
      handleComplete();
    } else {
      window.addEventListener('load', handleComplete);
      return () => window.removeEventListener('load', handleComplete);
    }
  }, []);

  const handleMenuSelect = (id) => {
    setIsMenuOpen(false);
    if (selectedIndex === id && !selectedLotto) return;

    triggerLoading(() => {
        setSelectedIndex(id);
        setSelectedLotto(null);
        if (id === 0) window.history.pushState({}, "", "/");
    }, 1200); 
  };

  const handleLottoClick = (lottoData) => {
    triggerLoading(() => {
        setSelectedLotto(lottoData);
    }, 1000); 
  };

  const renderContent = () => {
    if (selectedLotto) return <div className="p-10">Detail Page...</div>; 
    if (selectedIndex === 0) return <BodyContent onLottoClick={handleLottoClick} />;
    if (selectedIndex === 1) return <CheckTicketScreen onLottoClick={handleLottoClick} />;
    if (selectedIndex === 2) return <WinnersScreen />;
    return <NotFoundScreen onNavigateHome={() => handleMenuSelect(0)} />;
  };

  const showLayout = !selectedLotto && [0, 1, 2].includes(selectedIndex);

  return (
    <div className="h-screen bg-[#E0E0E0] flex flex-col font-sans relative text-[#1F2937] overflow-hidden">
      
      {/* 1. Глобал лоадер - Үргэлж дээр нь байх ёстой */}
      <GlobalLoader forceShow={isAppInitializing} />

      {/* 2. Контент - Ачаалж дууссаны дараа л харагдана */}
      {!isAppInitializing && (
        <>
          {showLayout && (
            <Header
              onMenuPressed={() => setIsMenuOpen(true)}
              onNavigate={handleMenuSelect}
              selectedIndex={selectedIndex}
            />
          )}

          <MobileDrawer
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onSelect={handleMenuSelect}
            selectedIndex={selectedIndex}
          />

          <main className="flex-grow overflow-y-auto relative scrollbar-hide">
            {renderContent()}
          </main>

          {showLayout && (
            <div className="hidden lg:block relative z-50">
              <Footer />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;