import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS ---
const Icons = {
  Search: ({ color = "#B4B4B4", className = "" }) => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line> 
    </svg>
  ),
  Filter: ({ color = "#B4B4B4", className = "" }) => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  Close: ({ color = "#AFAFAF", className = "" }) => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
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

  const performSearch = async (phoneRaw) => {
    setIsLoading(true);
    setHasSearched(false);
    setFoundTickets([]);

    await new Promise(resolve => setTimeout(resolve, 800));

    const allTickets = JSON.parse(localStorage.getItem('baavar_tickets') || '[]');
    const myTickets = allTickets.filter(t => t.phoneNumber === phoneRaw);
    
    const flattenedTickets = [];
    myTickets.forEach(ticket => {
        let numbers = Array.isArray(ticket.luckyNumbers) ? ticket.luckyNumbers : [ticket.luckyNumbers];
        numbers.forEach(num => {
            if(num) flattenedTickets.push({ ...ticket, luckyNumber: num });
        });
    });

    setFoundTickets(flattenedTickets.reverse());
    setIsLoading(false);
    setHasSearched(true);
  };

  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, ''); 
    if (raw.length > 8) raw = raw.slice(0, 8); 
    if (raw.length > 4) setPhoneNumber(`${raw.slice(0, 4)} ${raw.slice(4)}`);
    else setPhoneNumber(raw);

    if (raw.length === 8) performSearch(raw);
    else { setHasSearched(false); setFoundTickets([]); }
  };

  const groupedTickets = foundTickets.reduce((groups, ticket) => {
    let type = ticket.lotteryType || "Бусад";
    if (type === "Paid") type = "Үнэгүй сугалаа"; 

    if (!groups[type]) groups[type] = [];
    groups[type].push(ticket);
    return groups;
  }, {});

  return (
    <>
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');
          .font-play { font-family: 'Play', sans-serif; }
          .custom-placeholder::placeholder { color: #AFAFAF; opacity: 1; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

          @media (max-width: 414px) {
            .ticket-card-custom {
              width: 165px !important;
              height: 40px !important;
              gap: 3px !important;
              padding-left: 3px !important;
              padding-right: 3px !important;
            }
            .ticket-box-code { width: 32px !important; height: 22px !important; font-size: 8px !important; }
            .ticket-box-number { width: 45px !important; height: 22px !important; font-size: 10px !important; }
            .ticket-box-date { width: 62px !important; height: 22px !important; font-size: 8px !important; }
          }

          @media (min-width: 390px) and (max-width: 390px) {
            .ticket-card-custom {
              width: 175px !important;
              height: 40px !important;
            }
            .ticket-box-code { width: 35px !important; font-size: 9px !important; }
            .ticket-box-number { width: 48px !important; font-size: 11px !important; }
            .ticket-box-date { width: 65px !important; font-size: 9px !important; }
          }

          @media (min-width: 768px) and (max-width: 1024px) {
            .tablet-container {
               padding-left: 60px !important;
               padding-right: 60px !important;
               max-width: 800px !important;
               margin-left: auto !important;
               margin-right: auto !important;
            }
            .grid-cols-tablet {
               grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
        `}
        </style>

        <div className="w-full min-h-screen bg-[#E0E0E0] font-play flex flex-col items-center overflow-x-hidden">
            
            <div className="fixed top-20 lg:top-24 left-0 right-0 z-40 flex flex-col items-center pt-4 pb-6 lg:pb-8 bg-[#E0E0E0]/95 backdrop-blur-sm shadow-sm transition-all">
                <div className="flex flex-col items-start relative w-full max-w-[450px] lg:max-w-[600px] px-6">
                    <div className="w-full flex justify-between items-end mb-2 px-1">
                        {/* ЗАСВАР: Текстийг томрууллаа (text-[14px] lg:text-[16px]) */}
                        <p className="text-[#AFAFAF] text-[14px] lg:text-[20px] italic">
                            Утасны дугаараа оруулна уу
                        </p>
                    </div>

                    <div className="relative flex items-center overflow-hidden shadow-md w-full h-[44px] lg:h-[56px] rounded-[12px] lg:rounded-[16px] border-[1.5px] border-[#AFAFAF] bg-[#F9F9F9]">
                        <div className="absolute inset-0 flex items-center px-4 w-full pointer-events-none"> 
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                placeholder="ДУГААРААР ХАЙХ"
                                className="w-full h-full bg-transparent outline-none border-none custom-placeholder uppercase pointer-events-auto font-play"
                                style={{ fontWeight: 400, fontSize: '16px', color: '#444', paddingRight: '40px' }}
                            />
                        </div>

                        <div className="absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                            {isLoading ? (
                                <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-[#B4B4B4]/30 border-t-[#B4B4B4] rounded-full animate-spin"></div>
                            ) : (
                                <div className={`transition-all flex items-center justify-center opacity-50 text-[#B4B4B4]`}>
                                    <div className="w-[16px] h-[16px] lg:w-[22px] lg:h-[22px]">
                                        <Icons.Search color="currentColor" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mt-[210px] lg:mt-[240px] pb-20 overflow-y-auto hide-scrollbar flex flex-col items-center">
                <div className="w-full tablet-container max-w-[1000px] px-4">
                    <AnimatePresence>
                        {hasSearched && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                {Object.keys(groupedTickets).length === 0 ? (
                                    <div className="text-center py-16 text-[#AFAFAF] border-2 border-dashed border-[#ccc] rounded-2xl bg-white/40">
                                        Илэрц олдсонгүй.
                                    </div>
                                ) : (
                                    Object.entries(groupedTickets).map(([type, tickets]) => (
                                        <div key={type} className="mb-10">
                                            <div className="flex items-center gap-3 mb-6 px-2">
                                                <div className="w-[5px] h-[20px] bg-[#888] rounded-full shrink-0"></div>
                                                <h2 className="text-[#444] font-bold text-[14px] lg:text-[16px] uppercase tracking-[0.15em] whitespace-nowrap">
                                                    {type}
                                                </h2>
                                                <div className="flex-1 h-[1px] bg-[#ccc] mx-2"></div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-[#666] text-[13px] lg:text-[15px] font-bold">
                                                        {tickets.length} <span className="text-[#AFAFAF] font-normal ml-0.5 text-[12px]">ш</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 grid-cols-tablet gap-3 lg:gap-8 justify-items-center">
                                                {tickets.map((ticket, idx) => (
                                                    <ResponsiveTicketCard key={idx} data={ticket} />
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    </>
  );
};

// --- TICKET COMPONENT ---
const ResponsiveTicketCard = ({ data }) => {
  const getLuckyBgColor = (type) => {
    if (type === "Үнэгүй сугалаа" || type === "Paid") {
      return "#068071";
    }

    switch (type) {
      case "Баавар сугалаа": return "#A6ECFF";
      case "Нүнжиг сугалаа": return "#D8E47E";
      case "Сүншиг сугалаа": return "#FF6060";
      default: return "#A6ECFF";
    }
  };

  const isGreenBg = data.lotteryType === "Үнэгүй сугалаа" || data.lotteryType === "Paid";
  const textColor = isGreenBg ? "#FFFFFF" : "#000000";

  return (
    <div className="ticket-card-custom relative flex items-center justify-center gap-2 lg:gap-4 px-2 shadow-sm border border-[#AFAFAF] bg-white rounded-[10px] lg:rounded-[14px] transition-all hover:-translate-y-1.5 hover:shadow-xl w-[200px] h-[46px] md:w-[280px] lg:w-[310px] md:h-[52px]">
        <div className="ticket-box-code flex items-center justify-center shrink-0 bg-[#FFE082] rounded-[4px] w-[40px] h-[24px] md:w-[60px] md:h-[28px]">
            <span className="font-bold font-play text-[10px] md:text-[12px] text-black uppercase">
                {data.lotteryCode || "AZ"}
            </span>
        </div>
        <div style={{ backgroundColor: getLuckyBgColor(data.lotteryType) }} className="ticket-box-number flex items-center justify-center shrink-0 rounded-[4px] w-[55px] h-[24px] md:w-[75px] md:h-[28px]">
            <span style={{ color: textColor }} className="font-bold font-play text-[12px] md:text-[15px]">
                {data.luckyNumber || "0000"}
            </span>
        </div>
        <div className="ticket-box-date flex items-center justify-center shrink-0 bg-[#DEDEDE] rounded-[4px] w-[70px] h-[24px] md:w-[105px] md:h-[28px]">
            <span className="font-play text-[10px] md:text-[12px] text-black">
                {data.drawDate || "2024.01.01"}
            </span>
        </div>
    </div>
  );
};

export default CheckTicketScreen;
