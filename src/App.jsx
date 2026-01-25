import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion"; 

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BodyContent from "./components/BodyContent.jsx";
import MobileDrawer from "./components/MobileDrawer.jsx";
import CheckTicketScreen from "./components/CheckTicketScreen.jsx";
import WinnersScreen from "./components/WinnersScreen.jsx";
import NotFoundScreen from "./components/NotFoundScreen.jsx"; // 404 Хуудас
import GlobalLoader from "./components/GlobalLoader.jsx"; 
import { useLoading } from "./context/LoadingContext"; 

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Default-ийг 0 (Нүүр хуудас) болгох нь зөв. 
  // Гэхдээ useEffect доор URL-ийг шалгаж автоматаар солино.
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const [selectedLotto, setSelectedLotto] = useState(null);
  
  const { triggerLoading } = useLoading();

  // --- ШИНЭ: URL ШАЛГАХ ЛОГИК ---
  // Вэб сайт ачаалагдахад хөтчийн хаягийг шалгана.
  useEffect(() => {
    const path = window.location.pathname;
    
    // Хэрэв үндсэн хаяг ('/') биш байвал 404 хуудас руу (index 99) шилжүүлнэ
    if (path !== '/' && path !== '') {
        setSelectedIndex(99);
    } else {
        setSelectedIndex(0);
    }
  }, []);

  const handleMenuSelect = (id) => {
    setIsMenuOpen(false);
    
    if (selectedIndex === id && !selectedLotto) return;

    triggerLoading(() => {
        setSelectedIndex(id);
        setSelectedLotto(null);
        
        // Хэрэв Нүүр хуудас руу буцаж байгаа бол URL-ийг цэвэрлэж болно (сонголттой)
        if (id === 0) {
            window.history.pushState({}, "", "/");
        }
    }, 1200); 
  };

  const handleLottoClick = (lottoData) => {
    triggerLoading(() => {
        setSelectedLotto(lottoData);
    }, 1000); 
  };

  const handleBack = () => {
      triggerLoading(() => {
          setSelectedLotto(null);
      }, 800);
  }

  // --- ХУУДАС СОЛИХ ЛОГИК ---
  const renderContent = () => {
    // 1. Лотто дэлгэрэнгүй хуудас
    if (selectedLotto) {
        return <LottoDetailPage {...selectedLotto} onBack={handleBack} />;
    }

    // 2. Үндсэн хуудас (Home)
    if (selectedIndex === 0) {
        return (
          <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="flex-grow flex items-center justify-center overflow-hidden">
                <BodyContent onLottoClick={handleLottoClick} />
            </div>
          </div>
        );
    } 
    
    // 3. Тасалбар шалгах хуудас
    if (selectedIndex === 1) {
        return <CheckTicketScreen onLottoClick={handleLottoClick} />;
    }

    // 4. Ялагчид хуудас
    if (selectedIndex === 2) {
        return <WinnersScreen />;
    }

    // 5. БУСАД БҮХ ТОХИОЛДОЛД -> 404 ХУУДАС
    // NotFoundScreen-д "Нүүр хуудас руу буцах" функцийг дамжуулна
    return (
        <NotFoundScreen 
            onNavigateHome={() => handleMenuSelect(0)} 
        />
    );
  };

  // Header болон Footer-ийг харуулах эсэхийг шийдэх
  // Анхаар: NotFoundScreen (index 99) нь өөрөө дотроо Header/Footer-тэй бол
  // энд үндсэн Header/Footer-ийг нуух хэрэгтэй.
  const showLayout = !selectedLotto && [0, 1, 2].includes(selectedIndex);

  return (
    <div className="h-screen bg-[#E0E0E0] flex flex-col font-sans relative text-[#1F2937] overflow-hidden">
      <GlobalLoader />

      {/* Main Header - Зөвхөн үндсэн хуудсууд дээр харагдана */}
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

      {/* Main Content Area */}
      <main className="flex-grow overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Main Footer - Зөвхөн үндсэн хуудсууд дээр харагдана */}
      {showLayout && (
        <div className="relative z-50">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;