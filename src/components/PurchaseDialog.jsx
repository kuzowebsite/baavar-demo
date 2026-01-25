import React, { useState, useEffect } from 'react';

// --- ICONS ---
const Icons = {
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  CheckSquare: ({ checked }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={checked ? "#068071" : "#D1D5DB"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>
      {checked && <polyline points="9 11 12 14 22 4" stroke="#068071" strokeWidth="3" transform="translate(-2, 2)"></polyline>}
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Minus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Loader: () => (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
  ),
  QrCode: () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
      <path d="M10 3h4v4h-4z"></path>
      <path d="M10 17h4v4h-4z"></path>
      <path d="M3 10h18"></path>
    </svg>
  ),
  Success: () => (
    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#068071" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  Lock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Refresh: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6"></path>
      <path d="M1 20v-6h6"></path>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  )
};

const PurchaseDialog = ({ 
  title = "Lexus RX 450h", 
  lotteryCode = "AZ001", 
  basePrice = 30000, 
  onClose, 
  initialQuantity = 1 
}) => {
  const isFree = basePrice === 0;

  // --- STATE ---
  const [currentStep, setCurrentStep] = useState(1);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // OTP States - Хугацааг 60 секунд болгосон
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpTimeLeft, setOtpTimeLeft] = useState(60); 
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  // Global Session Timer
  const [remainingSeconds, setRemainingSeconds] = useState(300); // 5 minutes global session
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('qpay');
  const [luckyNumbers, setLuckyNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false); 
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const totalPrice = basePrice * quantity;
  
  // Logic helpers
  const rawPhoneNumber = phoneNumber.replace(/\s/g, ''); 
  const isPhoneValid = rawPhoneNumber.length === 8;
  const isOtpValid = otpInput.length === 4 && !isOtpExpired;
  
  // --- TIMERS ---
  
  // 1. Global Session Timer
  useEffect(() => {
    if (remainingSeconds <= 0) {
      onClose(); 
      return;
    }
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds, onClose]);

  // 2. OTP Specific Timer (Only runs on Step 2)
  useEffect(() => {
    let timer = null;
    if (currentStep === 2 && otpTimeLeft > 0) {
        timer = setInterval(() => {
            setOtpTimeLeft(prev => prev - 1);
        }, 1000);
    } else if (otpTimeLeft === 0) {
        setIsOtpExpired(true);
    }
    return () => clearInterval(timer);
  }, [currentStep, otpTimeLeft]);

  // Format Helpers
  const formatTimer = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatMoney = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const generateLuckyNumbers = (count) => {
    const nums = [];
    for(let i=0; i<count; i++) {
        nums.push(Math.floor(100000 + Math.random() * 900000));
    }
    return nums;
  };

  // --- SAVE TO STORAGE ---
  const saveToStorage = (status = 'Paid') => {
      const ticketData = {
          id: Date.now(),
          lotteryCode, title, phoneNumber: rawPhoneNumber, quantity, 
          luckyNumbers, totalPrice: totalPrice,
          paymentMethod: isFree ? 'Free' : selectedPaymentMethod,
          drawDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'), 
          purchaseDate: new Date().toLocaleString(),
          status: status
      };
      const existingData = JSON.parse(localStorage.getItem('baavar_tickets') || '[]');
      localStorage.setItem('baavar_tickets', JSON.stringify([...existingData, ticketData]));
  };

  // --- HANDLERS ---
  
  const handlePhoneInput = (e) => {
    let raw = e.target.value.replace(/\D/g, ''); 
    if (raw.length > 8) raw = raw.slice(0, 8); 

    let formatted = raw;
    if (raw.length > 4) {
        formatted = raw.slice(0, 4) + ' ' + raw.slice(4);
    }
    setPhoneNumber(formatted); 
  };

  const handleOtpInput = (e) => {
    if (isOtpExpired) return; 
    let raw = e.target.value.replace(/\D/g, ''); 
    if (raw.length > 4) raw = raw.slice(0, 4); 
    setOtpInput(raw); 
  };

  const handleResendOtp = () => {
      setOtpTimeLeft(60); // 1 минут болгож шинэчилсэн
      setIsOtpExpired(false);
      setOtpInput('');
      const demoCode = "1234";
      setGeneratedOtp(demoCode);
      alert(`Тань руу илгээсэн баталгаажуулах код: ${demoCode}`);
  };

  const handleNext = () => {
    if (currentStep === 1) {
        if (!isPhoneValid) return;
        const demoCode = "1234";
        setGeneratedOtp(demoCode);
        setOtpTimeLeft(60); // 1 минут эхлэх
        setIsOtpExpired(false);
        setOtpInput('');
        
        alert(`Тань руу илгээсэн баталгаажуулах код: ${demoCode}`);
        setCurrentStep(2);
        return;
    }

    if (currentStep === 2) {
        if (isOtpExpired) {
            alert("Кодын хугацаа дууссан байна. Дахин код авна уу.");
            return;
        }
        if (otpInput !== generatedOtp) {
            alert("Баталгаажуулах код буруу байна!");
            return;
        }
        setCurrentStep(3);
        return;
    }

    if (currentStep === 3) {
        setCurrentStep(4);
        return;
    }

    if (currentStep === 4) {
        const nums = generateLuckyNumbers(quantity);
        setLuckyNumbers(nums);

        if (isFree) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setIsPaymentSuccess(true);
                setCurrentStep(8); 
            }, 1000);
            return;
        } else {
            setCurrentStep(5);
            return;
        }
    }

    if (currentStep === 5) {
        if (selectedPaymentMethod === 'qpay') setCurrentStep(6);
        else setCurrentStep(7);
        return;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 6 || currentStep === 7) {
        setCurrentStep(5);
      } else {
        setCurrentStep(prev => prev - 1);
      }
      setIsPaymentSuccess(false); 
    }
  };

  const handleCheckPayment = () => {
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          setIsPaymentSuccess(true); 
          saveToStorage('Paid'); 
      }, 2000);
  };

  const handleFinish = () => {
      saveToStorage('Pending');
      onClose();
  };

  const handleCloseRequest = () => {
      if (isPaymentSuccess) onClose();
      else setShowExitConfirm(true);
  };

  const confirmClose = () => {
      setShowExitConfirm(false);
      onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Утасны дугаар";
      case 2: return "Баталгаажуулах";
      case 3: return "Тоо ширхэг";
      case 4: return "Захиалга хянах";
      case 5: return "Төлбөрийн нөхцөл";
      case 6: return isPaymentSuccess ? "Амжилттай" : "QPay";
      case 7: return "Банк";
      case 8: return "Амжилттай";
      default: return "";
    }
  };

  // --- RENDER STEPS ---
  const renderContent = () => {
    switch (currentStep) {
      case 1: 
        return (
          <div className="flex flex-col items-center w-full justify-center h-full">
            <p className="text-center mb-[6px] text-xs font-play">
              Та өөрийн баталгаат утасны дугаарыг "ЗӨВ" оруулна уу
            </p>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneInput}
              placeholder="8090 1860" 
              className="w-full max-w-[320px] h-[30px] rounded-[8px] border border-[#D9D9D9] bg-white font-play text-sm text-center outline-none text-black tracking-wide"
              autoFocus
            />
          </div>
        );

      case 2: 
        return (
            <div className="flex flex-col items-center w-full justify-center h-full">
                <p className="text-center mb-[6px] text-xs font-play">
                    Таны {phoneNumber} дугаарт илгээсэн 4 оронтой кодыг оруулна уу
                </p>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={otpInput}
                        onChange={handleOtpInput}
                        placeholder="1234"
                        maxLength={4}
                        disabled={isOtpExpired}
                        className={`w-[120px] h-[35px] rounded-[8px] border bg-white font-play text-lg tracking-widest text-center outline-none text-black transition-colors ${
                            isOtpExpired ? 'border-red-400 bg-red-50 text-red-500' : 'border-[#D9D9D9] focus:border-[#068071]'
                        }`}
                        autoFocus
                    />
                    <div className={`w-[60px] h-[35px] rounded-[8px] border flex items-center justify-center text-sm font-bold font-play ${
                        isOtpExpired ? 'border-red-200 text-red-500 bg-red-50' : 'border-[#D9D9D9] text-[#068071] bg-gray-50'
                    }`}>
                        {formatTimer(otpTimeLeft)}
                    </div>
                </div>
                {isOtpExpired ? (
                     <div className="mt-2 flex flex-col items-center">
                        <span className="text-[10px] text-red-500 font-play mb-1">Хугацаа дууссан!</span>
                        <button 
                            onClick={handleResendOtp}
                            className="flex items-center gap-1 text-[#068071] text-[11px] font-bold font-play hover:underline"
                        >
                            <Icons.Refresh /> Дахин илгээх
                        </button>
                     </div>
                ) : (
                    <p className="text-[10px] text-gray-400 mt-2">Код хүчинтэй хугацаа</p>
                )}
            </div>
        );

      case 3: 
        return (
          <div className="flex flex-col items-center w-full justify-center h-full">
            <p className="text-center mb-[6px] text-xs font-play px-8">
              {isFree 
                ? "Үнэгүй сугалаа нь сард зөвхөн 1 удаа оролцох эрхтэй." 
                : "Та сугалаа худалдан авах тасалбарын тоо ширхэгийг сонгоно уу."}
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                disabled={isFree}
                className={`w-[40px] h-[30px] flex items-center justify-center border border-[#D9D9D9] rounded-[8px] ${isFree ? 'bg-gray-100 cursor-not-allowed text-gray-300' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <Icons.Minus />
              </button>
              <div className="w-[80px] h-[30px] flex items-center justify-center border border-[#D9D9D9] rounded-[8px] text-base font-bold text-gray-800 bg-white">
                {quantity}
              </div>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                disabled={isFree}
                className={`w-[40px] h-[30px] flex items-center justify-center border border-[#D9D9D9] rounded-[8px] ${isFree ? 'bg-gray-100 cursor-not-allowed text-gray-300' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                {isFree ? <Icons.Lock /> : <Icons.Plus />}
              </button>
            </div>
            {isFree && <span className="text-[10px] text-[#068071] mt-2 font-bold font-play">Тогтмол 1 эрх</span>}
          </div>
        );

      case 4: 
        return (
          <div className="flex flex-col w-full px-6 justify-center h-full">
            <div className="space-y-1 w-full max-w-[320px] mx-auto">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium text-[11px] font-play">Сугалааны нэр:</span>
                <span className="text-gray-900 font-bold text-right text-[12px] font-play">{title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium text-[11px] font-play">Сугалааны дугаар:</span>
                <span className="text-gray-900 font-bold text-right text-[12px] font-play">{lotteryCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium text-[11px] font-play">Тоо ширхэг:</span>
                <span className="text-gray-900 font-bold text-right text-[12px] font-play">{quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium text-[11px] font-play">Нийт төлөх дүн:</span>
                <span className="text-gray-900 font-bold text-right text-[12px] font-play">{isFree ? "0₮ (Үнэгүй)" : formatMoney(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium text-[11px] font-play">Утасны дугаар:</span>
                <span className="text-gray-900 font-bold text-right text-[12px] font-play">{phoneNumber}</span>
              </div>
            </div>
          </div>
        );

      case 5: 
        return (
          <div className="flex flex-col items-center w-full justify-center h-full gap-2">
            <button
              onClick={() => setSelectedPaymentMethod('qpay')}
              className={`w-full max-w-[320px] h-[30px] border rounded-[8px] px-3 flex items-center justify-center relative transition-colors ${
                selectedPaymentMethod === 'qpay' ? 'border-[#068071]' : 'border-[#D9D9D9] hover:border-gray-400'
              }`}
            >
              <div className="absolute left-3"><Icons.CheckSquare checked={selectedPaymentMethod === 'qpay'} /></div>
              <span className={`font-bold text-[12px] font-play ${selectedPaymentMethod === 'qpay' ? 'text-[#068071]' : 'text-gray-700'}`}>QPay</span>
            </button>
            <button
              onClick={() => setSelectedPaymentMethod('bank')}
              className={`w-full max-w-[320px] h-[30px] border rounded-[8px] px-3 flex items-center justify-center relative transition-colors ${
                selectedPaymentMethod === 'bank' ? 'border-[#068071]' : 'border-[#D9D9D9] hover:border-gray-400'
              }`}
            >
              <div className="absolute left-3"><Icons.CheckSquare checked={selectedPaymentMethod === 'bank'} /></div>
              <span className={`font-bold text-[12px] font-play ${selectedPaymentMethod === 'bank' ? 'text-[#068071]' : 'text-gray-700'}`}>Банкаар төлөх</span>
            </button>
          </div>
        );

      case 6: 
        return (
          <div className="flex flex-col items-center w-full pt-2 px-4 pb-4">
            <p className="text-[10px] text-center font-play text-gray-600 mb-1">Санамсаргүй сонгогдсон таны азын дугаарууд:</p>
            <div className="flex flex-wrap justify-center gap-1 mb-2 max-w-[320px]">
                {luckyNumbers.map((num, idx) => (
                    <span key={idx} className="bg-gray-100 text-[#068071] border border-gray-200 px-2 py-0.5 rounded text-[11px] font-bold font-play">{num}</span>
                ))}
            </div>
            {isPaymentSuccess ? (
                <div className="bg-white p-4 rounded border border-gray-200 mb-3 flex flex-col items-center animate-pulse">
                      <Icons.Success />
                      <span className="text-[#068071] font-bold font-play text-sm mt-2">Төлбөр амжилттай!</span>
                </div>
            ) : (
                <div className="bg-white p-1 rounded border border-gray-200 mb-3"><Icons.QrCode /></div>
            )}
            {!isPaymentSuccess && (
                <div className="flex items-center gap-3 opacity-60">
                    {['Khan', 'Golomt', 'TDB', 'State'].map((bank, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 overflow-hidden">{bank[0]}</div>
                            <span className="text-[8px] font-play text-gray-500">{bank}</span>
                        </div>
                    ))}
                </div>
            )}
          </div>
        );

      case 7: 
        return (
          <div className="flex flex-col w-full pt-2 px-6 justify-start h-full">
            <div className="w-full flex flex-col items-center mb-4">
                <p className="text-[10px] text-center font-play text-gray-600 mb-1">Танд хуваарилагдсан азын дугаарууд:</p>
                <div className="flex flex-wrap justify-center gap-1 max-w-[320px]">
                    {luckyNumbers.map((num, idx) => (
                        <span key={idx} className="bg-gray-100 text-[#068071] border border-gray-200 px-2 py-0.5 rounded text-[11px] font-bold font-play">{num}</span>
                    ))}
                </div>
            </div>
            <div className="space-y-1 w-full max-w-[320px] mx-auto">
              <div className="flex justify-between items-center"><span className="text-gray-800 font-medium text-[11px] font-play">Банк:</span><span className="text-gray-900 font-bold text-right text-[12px] font-play">Хаан банк</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-800 font-medium text-[11px] font-play">Дансны дугаар:</span><span className="text-gray-900 font-bold text-right text-[12px] font-play">5318101209</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-800 font-medium text-[11px] font-play">Үнийн дүн:</span><span className="text-gray-900 font-bold text-right text-[12px] font-play">{formatMoney(totalPrice)}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-800 font-medium text-[11px] font-play">Гүйлгээний утга:</span><span className="text-gray-900 font-bold text-right text-[12px] font-play">{phoneNumber}</span></div>
            </div>
          </div>
        );
      
      case 8: 
        return (
            <div className="flex flex-col items-center w-full justify-center h-full pt-2 pb-4">
                 <div className="bg-white p-4 rounded-full mb-4 flex items-center justify-center animate-bounce-short"><Icons.Success /></div>
                 <h3 className="text-[#068071] font-bold font-play text-lg mb-2">Амжилттай!</h3>
                 <p className="text-[11px] text-center font-play text-gray-600 mb-4 px-6">Та "BONUS SUGLAA"-д амжилттай оролцлоо. Танд амжилт хүсье!</p>
                 <div className="w-full flex flex-col items-center bg-gray-50 py-3 w-full">
                    <p className="text-[10px] text-center font-play text-gray-500 mb-2">Таны азын дугаар:</p>
                    <div className="flex flex-wrap justify-center gap-1 max-w-[320px]">
                        {luckyNumbers.map((num, idx) => (
                            <span key={idx} className="bg-white text-[#068071] border border-[#068071] px-4 py-1 rounded-[6px] text-[16px] font-bold font-play shadow-sm">{num}</span>
                        ))}
                    </div>
                </div>
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');
          .font-play { font-family: 'Play', sans-serif; }
          .animate-bounce-short { animation: bounce 1s infinite; }
          @keyframes bounce {
              0%, 100% { transform: translateY(-5%); }
              50% { transform: translateY(0); }
          }
        `}
      </style>
      
      <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 font-sans pt-[100px] px-4">
        <div 
          className="bg-white relative flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ease-in-out w-full"
          style={{
            maxWidth: '460px', 
            height: (currentStep === 6 || currentStep === 7 || currentStep === 8) ? 'auto' : '250px',
            minHeight: '250px',
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            padding: '0'
          }}
        >
          {/* Close Button */}
          <button 
            onClick={handleCloseRequest} 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <Icons.Close />
          </button>

          {/* CONFIRMATION OVERLAY */}
          {showExitConfirm && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-[20px]">
              <div className="text-center px-6">
                <h3 className="font-play font-bold text-lg mb-2 text-black">Итгэлтэй байна уу?</h3>
                <p className="font-play text-xs text-gray-600 mb-4">Худалдан авалтаа цуцлах гэж байна.<br/>Үргэлжлүүлэх үү?</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setShowExitConfirm(false)} className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-play text-gray-600 hover:bg-gray-50">Үгүй</button>
                  <button onClick={confirmClose} className="px-4 py-1.5 rounded-lg bg-[#FF6060] text-xs font-play text-white hover:bg-[#ff4040]">Тийм</button>
                </div>
              </div>
            </div>
          )}

          {/* HEADER */}
          <div 
            className="w-full flex justify-between items-end relative" 
            style={{ height: '65px', padding: '0 25px 8px 25px', borderBottom: '1px solid #D9D9D9', flexShrink: 0 }}
          >
              <h2 className="font-play font-bold text-[18px] sm:text-[20px] leading-[100%] text-black m-0">{getStepTitle()}</h2>
              <div className="font-play font-bold text-[18px] sm:text-[20px] leading-[100%] text-[#068071]">{formatTimer(remainingSeconds)}</div>
          </div>

          {/* BODY */}
          <div className="flex-1 w-full overflow-hidden relative pb-4">
              {renderContent()}
          </div>

          {/* FOOTER */}
          <div 
            className="w-full flex justify-between items-center relative" 
            style={{ height: '50px', padding: '0 25px', borderTop: '1px solid #D9D9D9', flexShrink: 0 }}
          >
              <button
                  onClick={handleBack}
                  disabled={currentStep === 1 || isPaymentSuccess || currentStep === 8}
                  style={{
                      width: '90px', height: '30px', borderRadius: '8px', border: '1px solid #D9D9D9', backgroundColor: '#FFFFFF',
                      fontFamily: 'Play, sans-serif', fontWeight: 400, fontSize: '12px', color: '#969696',
                      cursor: (currentStep === 1 || isPaymentSuccess || currentStep === 8) ? 'not-allowed' : 'pointer',
                      opacity: (currentStep === 1 || isPaymentSuccess || currentStep === 8) ? 0.6 : 1
                  }}
              >Өмнөх</button>

              <button
                  onClick={() => {
                      if (currentStep === 6) { if (isPaymentSuccess) onClose(); else handleCheckPayment(); }
                      else if (currentStep === 7) { handleFinish(); }
                      else if (currentStep === 8) { onClose(); }
                      else { handleNext(); }
                  }}
                  disabled={(currentStep === 1 && !isPhoneValid) || (currentStep === 2 && (!isOtpValid && !isOtpExpired)) || isLoading}
                  style={{
                      width: (currentStep === 6) ? 'auto' : '90px', minWidth: '90px', padding: currentStep === 6 ? '0 10px' : '0',
                      height: '30px', borderRadius: '8px', border: '1px solid #D9D9D9',
                      backgroundColor: (isPaymentSuccess || currentStep === 8) ? '#068071' : '#FFFFFF',
                      fontFamily: 'Play, sans-serif', fontWeight: 400, fontSize: '12px',
                      color: (isPaymentSuccess || currentStep === 8) ? '#FFFFFF' : '#057F71', 
                      cursor: ((currentStep === 1 && !isPhoneValid) || (currentStep === 2 && !isOtpValid) || isLoading) ? 'not-allowed' : 'pointer',
                      opacity: ((currentStep === 1 && !isPhoneValid) || (currentStep === 2 && !isOtpValid) || isLoading) ? 0.6 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                  }}
              >
                  {currentStep === 6 ? (isLoading ? <Icons.Loader /> : (isPaymentSuccess ? "Хаах" : "Төлбөр шалгах")) : 
                   currentStep === 7 ? "Дуусгах" : currentStep === 8 ? "Хаах" : (isLoading ? <Icons.Loader /> : "Дараах")}
              </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseDialog;
