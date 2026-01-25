import React from 'react';

const Footer = () => {
  return (
    // "border-t border-white/10" хэсгийг авч хаялаа
    <footer className="relative w-full py-10 overflow-hidden text-white">
      
      {/* =========================================================
          BACKGROUND LAYER
         ========================================================= */}
      <div className="absolute inset-0 z-0">
          <img 
            src="/assets/background.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-0">
        
        {/* --- ЗҮҮН ТАЛ: Social Icons & Copyright --- */}
        <div className="flex flex-col items-center md:items-start gap-4">
            
            {/* Social Icons */}
            <div className="flex gap-4">
                <FooterIcon icon={<FacebookIcon />} />
                <FooterIcon icon={<InstagramIcon />} />
                <FooterIcon icon={<XIcon />} />
            </div>

            {/* Copyright */}
            <p className="text-[10px] md:text-xs font-sans text-white/80 font-medium tracking-wide drop-shadow-md">
                © 2026 BaavarSugalaa. All Rights Reserved.
            </p>
        </div>

        {/* --- БАРУУН ТАЛ: Links --- */}
        <div className="flex gap-6 md:gap-8 font-sans text-xs md:text-sm font-medium drop-shadow-md">
             <a href="#" className="hover:text-[#c0c0c0] transition-colors duration-300">
                Cookie policy
             </a>
             <a href="#" className="hover:text-[#c0c0c0] transition-colors duration-300">
                Terms & Conditions
             </a>
        </div>

      </div>
    </footer>
  );
};

// --- ТУСЛАХ КОМПОНЕНТУУД ---

const FooterIcon = ({ icon }) => (
    <div className="w-8 h-8 rounded-full bg-white backdrop-blur-sm flex items-center justify-center text-black hover:bg-white/20 hover:text-black transition-all duration-300 cursor-pointer group shadow-sm">
        <div className="w-4 h-4">
            {icon}
        </div>
    </div>
);

// --- SVG ICONS ---
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

// X (Twitter) Icon
const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export default Footer;