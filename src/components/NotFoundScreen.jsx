import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header'; 
import Footer from './Footer';

const NotFoundScreen = () => {
  const bgImage = "url('assets/background.jpg')";

  const handleNavigateHome = () => {
      window.location.href = '/';
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');
          .font-play { font-family: 'Play', sans-serif; }
          
          .bg-knockout {
            background-image: ${bgImage};
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
          }
        `}
      </style>

      <div 
        className="w-full min-h-screen flex flex-col justify-between font-play relative overflow-hidden"
        style={{ backgroundColor: '#E0E0E0' }}
      >
        
        {/* HEADER - Хөдөлгөөнийг хаах */}
        <div className="w-full z-50">
            <Header 
                onNavigate={handleNavigateHome} 
                selectedIndex={-1} 
                // ЭНД АНХААР: Хэрэв та Header.js-ээ дээрх шиг өөрчилсөн бол 
                // энэ мөрийг нэмснээр хөдөлгөөнгүй болно.
                disableAnimation={true} 
            />
        </div>

        {/* CENTER CONTENT */}
        <div className="flex-grow flex flex-col items-center justify-center w-full text-center relative z-10 py-10">
            
            <h1 
                className="bg-knockout select-none"
                style={{
                    fontSize: '270.55px',
                    fontWeight: 700,
                    lineHeight: '100%',
                    marginTop: '-20px', 
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent', 
                    WebkitTextFillColor: 'transparent'
                }}
            >
                Oops!
            </h1>

            <p 
                style={{
                    fontSize: '40px',
                    fontWeight: 700,
                    lineHeight: '100%',
                    color: '#000000',
                    marginTop: '20px', 
                    marginBottom: '80px'
                }}
            >
                404 - ХУУДАС ОЛДСОНГҮЙ
            </p>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-knockout"
                style={{
                    width: '562px',
                    height: '87px',
                    borderRadius: '43.5px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0px 4px 10px rgba(0,0,0,0.2)'
                }}
                onClick={handleNavigateHome}
            >
                <span 
                    style={{
                        fontFamily: 'Play',
                        fontWeight: 700,
                        fontSize: '40px',
                        lineHeight: '100%',
                        textTransform: 'uppercase',
                        color: '#FFFFFF'
                    }}
                >
                    НҮҮР ХУУДАСРУУ БУЦАХ
                </span>
            </motion.button>
        </div>

        {/* FOOTER */}
        <div className="w-full z-50">
            <Footer />
        </div>

      </div>
    </>
  );
};

export default NotFoundScreen;