import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS (Filter icon нэмсэн) ---
const Icons = {
  Search: ({ color = "#B4B4B4" }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Filter: ({ color = "#B4B4B4" }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  Close: ({ size = 18, color = "#AFAFAF" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
};

const CheckTicketScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [foundTickets, setFoundTickets] = useState([]);

  // --- ШҮҮЛТҮҮРИЙН STATE ---
  const [isFilterMode, setIsFilterMode] = useState(false);
  const [filterText, setFilterText] = useState("");
  const filterInputRef = useRef(null);

  // --- ХАЙХ ЛОГИК ---
  const performSearch = async (phoneRaw) => {
    setIsLoading(true);
    setHasSearched(false);
    setFoundTickets([]);
    
    setFilterText("");
    setIsFilterMode(false);

    // Simulation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // LocalStorage-оос өгөгдөл авах (Жишээ)
    const allTickets = JSON.parse(localStorage.getItem('baavar_tickets') || '[]');
    const myTickets = allTickets.filter(t => t.phoneNumber === phoneRaw);
    
    const flattenedTickets = [];
    myTickets.forEach(ticket => {
        let numbers = [];
        if (Array.isArray(ticket.luckyNumbers)) {
            numbers = ticket.luckyNumbers;
        } 
        else if (typeof ticket.luckyNumbers === 'string' && ticket.luckyNumbers.includes(',')) {
            numbers = ticket.luckyNumbers.split(',').map(n => n.trim());
        }
        else {
            numbers = [ticket.luckyNumbers];
        }

        numbers.forEach(num => {
            if(num) {
                flattenedTickets.push({ ...ticket, luckyNumber: num });
            }
        });
    });

    setFoundTickets(flattenedTickets.reverse());
    setIsLoading(false);
    setHasSearched(true);
  };

  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, ''); 
    if (raw.length > 8) raw = raw.slice(0, 8); 
    
    if (raw.length > 4) {
      setPhoneNumber(`${raw.slice(0, 4)} ${raw.slice(4)}`);
    } else {
      setPhoneNumber(raw);
    }

    if (raw.length === 8) {
        performSearch(raw);
    } else {
        setHasSearched(false);
        setFoundTickets([]);
        setIsFilterMode(false);
    }
  };

  const handleClear = () => {
      setPhoneNumber("");
      setHasSearched(false);
      setFoundTickets([]);
      setFilterText("");
      setIsFilterMode(false);
  }

  // --- ШҮҮХ ЛОГИК ---
  const displayedTickets = foundTickets.filter(ticket => {
      if (!filterText) return true;
      const searchStr = filterText.toLowerCase();
      const lucky = (ticket.luckyNumber || "").toString().toLowerCase();
      const code = (ticket.lotteryCode || "").toString().toLowerCase();
      
      return lucky.includes(searchStr) || code.includes(searchStr);
  });

  return (
    <>
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');
          .font-play { font-family: 'Play', sans-serif; }
          .custom-placeholder::placeholder {
            color: #AFAFAF;
            opacity: 1;
          }
        `}
        </style>

        <div className="w-full min-h-screen bg-[#E0E0E0] font-play flex flex-col items-center overflow-x-hidden pt-[160px]">
            
            {/* --- MAIN INPUT BAR --- */}
            <div className="flex flex-col items-start relative z-10">
                <div className="w-full max-w-[640px] flex justify-between items-end mb-2 px-2">
                    <p className="text-[#AFAFAF] text-sm italic transition-all">
                       Та өөрийн бүртгүүлсэн утасны дугаараа оруулна уу
                    </p>
                    
                    {phoneNumber && !isFilterMode && (
                        <button 
                            onClick={handleClear}
                            className="text-[#AFAFAF] text-sm hover:text-red-400 transition-colors uppercase cursor-pointer flex items-center gap-1"
                        >
                            арилгах <Icons.Close />
                        </button>
                    )}
                </div>

                <div 
                    style={{
                        width: 'min(90vw, 640px)',
                        height: '56px', 
                        borderRadius: '18px', 
                        border: '2px solid #AFAFAF',
                        backgroundColor: '#F9F9F9',
                    }}
                    className="relative flex items-center overflow-hidden shadow-sm transition-all hover:border-[#999]"
                >
                    {/* --- LAYER 1: PHONE INPUT (Always Visible, Left Aligned) --- */}
                    <div className="absolute inset-0 flex items-center px-6 w-full pointer-events-none"> 
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="ДУГААРААР ХАЙХ"
                            className="w-full h-full bg-transparent outline-none border-none custom-placeholder uppercase pointer-events-auto"
                            style={{
                                fontFamily: 'Play',
                                fontWeight: 400,
                                fontSize: '22px',
                                lineHeight: '100%',
                                color: '#888', 
                                paddingRight: isFilterMode ? '250px' : '50px'
                            }}
                        />
                    </div>

                    {/* --- LAYER 2: FILTER INPUT (Slides in from Right) --- */}
                    <motion.div
                         initial={{ width: 0, opacity: 0 }}
                         animate={{ 
                             width: isFilterMode ? "240px" : 0,
                             opacity: isFilterMode ? 1 : 0 
                         }}
                         transition={{ type: "spring", stiffness: 300, damping: 30 }}
                         style={{ 
                             right: '50px',
                             backgroundColor: '#F9F9F9',
                             borderLeft: isFilterMode ? '1px solid #E0E0E0' : 'none'
                         }}
                         className="absolute top-0 bottom-0 flex items-center z-10 overflow-hidden"
                    >
                        <input
                            ref={filterInputRef}
                            type="text"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Код, аз..."
                            className="w-full h-full bg-transparent outline-none border-none pl-3 text-[#333] font-play custom-placeholder"
                            style={{ fontSize: '18px' }}
                        />
                    </motion.div>

                    {/* --- ACTION BUTTON (Right Side - Centered) --- */}
                    <div className="absolute right-6 top-[52%] -translate-y-1/2 z-20">
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-[#B4B4B4]/30 border-t-[#B4B4B4] rounded-full animate-spin"></div>
                        ) : (
                            <button 
                                onClick={() => {
                                    if (hasSearched) {
                                        setIsFilterMode(!isFilterMode);
                                        if (!isFilterMode) {
                                            setTimeout(() => filterInputRef.current?.focus(), 100);
                                        } else {
                                            setFilterText("");
                                        }
                                    }
                                }}
                                disabled={!hasSearched}
                                className={`
                                    transition-all duration-300 flex items-center justify-center
                                    ${hasSearched ? 'hover:scale-110 cursor-pointer' : 'cursor-default opacity-50'}
                                `}
                            >
                                {isFilterMode ? (
                                    <div className="text-[#555] hover:text-red-500 transition-colors">
                                        <Icons.Close size={22} color="currentColor" />
                                    </div>
                                ) : (
                                    <div className={hasSearched ? "text-[#555]" : "text-[#B4B4B4]"}>
                                        {/* ӨӨРЧЛӨЛТ: Хайлт хийсэн бол Filter icon, үгүй бол Search icon харуулна */}
                                        {hasSearched ? (
                                            <Icons.Filter color="currentColor" />
                                        ) : (
                                            <Icons.Search color="currentColor" />
                                        )}
                                    </div>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RESULTS GRID --- */}
            <div className="w-full max-w-[640px] lg:max-w-[1050px] mt-10 mb-20 px-4">
                <AnimatePresence>
                    {hasSearched && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center"
                        >
                            {displayedTickets.length === 0 ? (
                                <div className="col-span-full w-full max-w-[640px] text-center py-8 text-[#AFAFAF] text-sm border border-dashed border-[#ccc] rounded-xl">
                                    {foundTickets.length > 0 ? "Хайлтад тохирох илэрц олдсонгүй." : "Илэрц олдсонгүй."}
                                </div>
                            ) : (
                                displayedTickets.map((ticket, idx) => (
                                    <MiniTicketCard key={idx} data={ticket} />
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </>
  );
};

// --- MINI TICKET COMPONENT ---
const MiniTicketCard = ({ data }) => {
  return (
    <div 
        style={{
            width: '320px', 
            height: '48px',
            borderRadius: '12px',
            border: '1px solid #AFAFAF',
            backgroundColor: '#FFFFFF',
        }}
        className="relative flex items-center justify-between px-[12px] shadow-sm hover:shadow-md transition-all cursor-default hover:-translate-y-0.5"
    >
        {/* 1. Lottery Code Box */}
        <div 
            style={{
                width: '60px', 
                height: '24px',
                borderRadius: '5px',
                backgroundColor: '#FFE082',
            }}
            className="flex items-center justify-center overflow-hidden"
        >
            <span 
                className="whitespace-nowrap"
                style={{
                    fontFamily: 'Play',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: '#000000',
                    lineHeight: '100%'
                }}
            >
                {data.lotteryCode || "AZ.."}
            </span>
        </div>

        {/* 2. Lucky Number Box */}
        <div 
            style={{
                width: '70px',
                height: '24px',
                borderRadius: '5px',
                backgroundColor: '#A6ECFF',
            }}
            className="flex items-center justify-center overflow-hidden"
        >
            <span 
                className="whitespace-nowrap"
                style={{
                    fontFamily: 'Play',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#000000',
                    lineHeight: '100%'
                }}
            >
                {data.luckyNumber || "0000"}
            </span>
        </div>

        {/* 3. Date Box */}
        <div 
            style={{
                width: '120px', 
                height: '24px',
                borderRadius: '5px',
                backgroundColor: '#DEDEDE',
            }}
             className="flex items-center justify-center overflow-hidden"
        >
            <span 
                 className="whitespace-nowrap"
                 style={{
                    fontFamily: 'Play',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: '#000000',
                    lineHeight: '100%'
                }}
            >
                {data.drawDate || "2024.01.01"}
            </span>
        </div>
    </div>
  );
};

export default CheckTicketScreen;