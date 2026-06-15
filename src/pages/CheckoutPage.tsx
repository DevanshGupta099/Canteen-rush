import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Wallet, CreditCard, ShieldCheck, Ticket, Check, Loader2, MapPin, UtensilsCrossed, Gift, Truck, AlertCircle, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';

function GPayLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

function PhonePeLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#5f259f" />
      <path d="M12 6c-2.76 0-5 2.24-5 5s2.24 5 5 5h2v2h-4v2h6c2.76 0 5-2.24 5-5s-2.24-5-5-5h-2v-2h3V6h-5z" fill="#ffffff" />
    </svg>
  );
}

function PaytmLogo() {
  return (
    <svg viewBox="0 0 80 24" fill="none" className="w-12 h-5" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="19" fill="#00BAF2" fontSize="22" fontWeight="950" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.8">pay</text>
      <text x="38" y="19" fill="#002970" fontSize="22" fontWeight="1000" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.8">tm</text>
    </svg>
  );
}

function AmazonPayLogo() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#131921" />
      <path d="M14 28c1.5 0 2.8-.2 3.8-.7c1-.5 1.7-1.2 2-2.2v2.4h3.5V17.5c0-1.8-.5-3.1-1.6-4c-1.1-.9-2.8-1.3-5-1.3c-2.4 0-4.3.4-5.6 1.3l1 2.7c1-.6 2.3-1 3.7-1c1.2 0 2 .2 2.5.6c.5.4.7 1.0.7 1.8v1c-1.5 0-3 .2-4.2.6C11 20 10.2 20.7 9.6 21.6c-.6.9-.9 2-.9 3.2C8.7 26.3 9 27.2 9.7 27.7c.7.6 1.8.8 3.3.8z" fill="white" />
      <path d="M10.5 31.5c7.5 4.5 19.5 4.5 27 0" stroke="#FF9900" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M37.5 31.5l-2.5-6l-5 4.5" fill="#FF9900" />
    </svg>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    orderType, 
    setOrderType,
    walletBalance, 
    savedCards, 
    placeOrder, 
    darkMode,
    activePromoDiscount,
    applyPromo,
    resetPromo,
    deliveryOption,
    setDeliveryOption,
    deliveryAddress,
    setDeliveryAddress,
    tableNumber,
    setTableNumber
  } = useStore();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'upi' | 'card'>('wallet');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'paytm' | 'phonepe' | 'amazonpay' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  
  // Card form details
  const [selectedSavedCardId, setSelectedSavedCardId] = useState<number | null>(savedCards[0]?.id || null);
  const [isUsingNewCard, setIsUsingNewCard] = useState(savedCards.length === 0);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Payment process simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'initiating' | 'authenticating' | 'otp' | 'success'>('initiating');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [tip] = useState(0);

  // Billing Math
  const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = Math.round(itemTotal * 0.05); // 5% GST
  const platformFee = 4;
  
  // Dorm-Drop Hostel delivery fee
  const deliveryFee = deliveryOption === 'hostel' ? 10 : 0;
  
  const subTotal = itemTotal + gst + platformFee + tip + deliveryFee;
  
  // Promo code discount deduction
  const discountAmount = Math.round(subTotal * (activePromoDiscount / 100));
  const total = subTotal - discountAmount;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvv(value);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const success = applyPromo(promoCodeInput);
    if (success) {
      toast.success('Coupon Applied! Saved 20% on your meal!', {
        icon: '🏷️',
        style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
      });
    } else {
      toast.error('Invalid promo code. Try "CHRIST20" for 20% off!', {
        style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
      });
    }
  };

  const triggerOrderPlacement = async () => {
    try {
      const id = await placeOrder(total);
      
      toast.success('Order Placed Successfully!', {
        icon: '🎉',
        style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
      });

      // Clear checkout selections
      setTableNumber(null);
      resetPromo();
      setDeliveryOption('pickup');

      navigate(`/track/${id}`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to place order.');
    }
  };

  const handleCheckout = () => {
    // 1. Wallet checks
    if (paymentMethod === 'wallet') {
      if (total > walletBalance) {
        toast.error('Insufficient Wallet Balance! Top up or choose card/UPI.', {
          duration: 3000,
          style: { borderRadius: '16px' }
        });
        return;
      }
      setIsProcessing(true);
      setProcessingStage('initiating');
      setTimeout(() => {
        setProcessingStage('authenticating');
        setTimeout(() => {
          setProcessingStage('success');
          setTimeout(() => {
            setIsProcessing(false);
            triggerOrderPlacement();
          }, 1500);
        }, 1200);
      }, 800);
    }

    // 2. UPI checks
    else if (paymentMethod === 'upi') {
      if (selectedUpiApp === 'custom' && !customUpiId.trim()) {
        toast.error('Please enter a valid UPI ID.');
        return;
      }
      if (selectedUpiApp === 'custom' && !customUpiId.includes('@')) {
        toast.error('Invalid UPI format (e.g. name@upi).');
        return;
      }
      setIsProcessing(true);
      setProcessingStage('initiating');
      setCountdown(45);
      
      // Start countdown timer for UPI approval
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => {
        setProcessingStage('authenticating');
        
        // Trigger simulated push notification toast
        setTimeout(() => {
          toast(`Approve request of ₹${total} in your UPI app!`, {
            icon: '📱',
            duration: 4000
          });
        }, 1500);

        // Auto approve UPI collect request after 6 seconds
        setTimeout(() => {
          clearInterval(timer);
          setProcessingStage('success');
          setTimeout(() => {
            setIsProcessing(false);
            triggerOrderPlacement();
          }, 1500);
        }, 6000);
      }, 1000);
    }

    // 3. Card checks
    else if (paymentMethod === 'card') {
      if (isUsingNewCard) {
        if (cardNumber.replace(/\s/g, '').length !== 16 || !cardExpiry.includes('/') || cardCvv.length < 3 || !cardName.trim()) {
          toast.error('Please fill in valid card credentials.');
          return;
        }
      }
      setIsProcessing(true);
      setProcessingStage('initiating');
      
      // Generate random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      setTimeout(() => {
        setProcessingStage('authenticating');
        setTimeout(() => {
          setProcessingStage('otp');
          setOtpInput('');
          // Trigger OTP delivery toast
          toast.success(`Demo Bank OTP: ${otp} (Prefill option ready)`, {
            icon: '💬',
            duration: 6000
          });
        }, 1500);
      }, 1000);
    }
  };

  const handleVerifyOtp = () => {
    if (otpInput === generatedOtp || otpInput === '123456') {
      setProcessingStage('success');
      setTimeout(() => {
        setIsProcessing(false);
        triggerOrderPlacement();
      }, 1500);
    } else {
      toast.error('Invalid OTP! Please check the code.');
    }
  };

  return (
    <div className={`min-h-full pb-48 transition-colors duration-300 relative ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Header */}
      <div className={`px-5 pt-8 pb-4 sticky top-0 z-20 shadow-sm flex items-center gap-4 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-slate-100'
      }`}>
        <button 
          aria-label="Go back" 
          onClick={() => navigate(-1)} 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-black text-xl">Payment Details</h2>
      </div>

      <div className="px-5 pt-6">
        
        {/* Protection Banner */}
        <div className={`border p-4 rounded-2xl flex items-start gap-3 mb-6 transition-colors duration-300 ${
          darkMode 
            ? 'bg-green-950/20 border-green-900/30 text-green-400' 
            : 'bg-green-50 border-green-100 text-green-700'
        }`}>
          <ShieldCheck className="flex-shrink-0 mt-0.5" size={20} />
          <p className="text-xs font-black leading-normal">
            Encrypted UPI gateway & PCI compliance verified.
          </p>
        </div>

        {/* ORDER TYPE TOGGLE */}
        <h3 className={`font-bold mb-3 px-1 text-xs uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          1. Service Option
        </h3>

        <div className={`p-1.5 flex rounded-2xl mb-6 relative transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-200/70'
        }`}>
          <div className={`absolute inset-y-1.5 w-[calc(33.33%-6px)] rounded-xl shadow-sm transition-transform duration-300 ${
            deliveryOption === 'hostel' 
              ? 'translate-x-[calc(200%+12px)]' 
              : orderType === 'takeaway' 
                ? 'translate-x-[calc(100%+6px)]' 
                : 'translate-x-0'
          } ${darkMode ? 'bg-slate-800' : 'bg-white'}`} />
          
          <button 
            onClick={() => { setOrderType('dine-in'); setDeliveryOption('pickup'); }} 
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-black uppercase tracking-wider z-10 transition-colors ${
              orderType === 'dine-in' && deliveryOption === 'pickup' ? (darkMode ? 'text-amber-500' : 'text-christ') : 'text-slate-400'
            }`}
          >
            <UtensilsCrossed size={14} /> Dine-In
          </button>
          
          <button 
            onClick={() => { setOrderType('takeaway'); setDeliveryOption('pickup'); }} 
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-black uppercase tracking-wider z-10 transition-colors ${
              orderType === 'takeaway' && deliveryOption === 'pickup' ? (darkMode ? 'text-amber-500' : 'text-christ') : 'text-slate-400'
            }`}
          >
            <MapPin size={14} /> Takeaway
          </button>

          <button 
            onClick={() => setDeliveryOption('hostel')} 
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-black uppercase tracking-wider z-10 transition-colors ${
              deliveryOption === 'hostel' ? (darkMode ? 'text-amber-500' : 'text-christ') : 'text-slate-400'
            }`}
          >
            <Truck size={14} /> Dorm-Drop
          </button>
        </div>

        {/* MOCK HOSTEL DELIVERY DETAILS */}
        {deliveryOption === 'hostel' && (
          <div className={`p-5 rounded-3xl border mb-6 transition-all duration-300 animate-pop ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-400">Hostel Address details</h4>
              <span className="bg-amber-500/10 text-amber-500 text-[8px] font-black px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                Peer Delivery (+₹10)
              </span>
            </div>
            
            <input 
              type="text" 
              placeholder="Block IV hostel, Room 402"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className={`w-full p-3 rounded-xl text-xs outline-none border transition-all ${
                darkMode 
                  ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
              }`}
            />
            <p className="text-[9px] text-slate-500 mt-2 font-bold leading-normal">
              * Delivery is made by fellow student volunteers in your hostel block!
            </p>
          </div>
        )}

        {/* Dine-In table placard warning */}
        {orderType === 'dine-in' && deliveryOption === 'pickup' && (
          <div className={`p-4 rounded-2xl border mb-6 text-xs font-semibold leading-relaxed flex items-center gap-2 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-350' : 'bg-amber-50/50 border-amber-100 text-slate-600'
          }`}>
            <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
            <span>
              {tableNumber ? `Seated at ${tableNumber}. Table bounded successfully.` : 'Dine-In selected. Scan table QR during review.'}
            </span>
          </div>
        )}

        {/* PROMO COUPONS CODE SYSTEM */}
        <h3 className={`font-bold mb-3 px-1 text-xs uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          2. Promo Coupons
        </h3>

        <div className={`rounded-3xl border p-5 mb-6 transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Enter Code (e.g. CHRIST20)" 
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className={`w-full py-3.5 pl-10 pr-4 rounded-xl text-xs outline-none border transition-all ${
                  darkMode 
                    ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-850 focus:border-christ'
                }`}
              />
              <Ticket className="absolute left-3 top-3.5 text-slate-400" size={16} />
            </div>
            <button 
              type="submit"
              className="bg-christ hover:bg-christ/95 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-black text-xs px-5 py-3.5 rounded-xl active:scale-95"
            >
              Apply
            </button>
          </form>

          {activePromoDiscount > 0 && (
            <div className="flex justify-between items-center mt-4 bg-green-500/10 border border-green-500/20 p-3 rounded-xl animate-pop">
              <div className="flex items-center gap-2 font-black text-green-500">
                <Gift className="text-green-500" size={16} />
                <div>
                  <p className="text-xs font-black text-green-500">CHRIST20 APPLIED</p>
                  <p className="text-[9px] text-slate-400 font-bold">20% Discount active on checkout</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => { resetPromo(); setPromoCodeInput(''); }}
                className="text-[10px] font-black text-red-500 uppercase hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* PAYMENT METHODS SELECTOR WITH DETAILED TABS */}
        <h3 className={`font-bold mb-3 px-1 text-xs uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          3. Payment Gateway Option
        </h3>

        <div className={`rounded-3xl border p-5 mb-6 transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          {/* Custom tab headers */}
          <div className="flex gap-2 mb-4 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border dark:border-slate-850">
            <button 
              type="button"
              onClick={() => setPaymentMethod('wallet')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                paymentMethod === 'wallet' 
                  ? 'bg-christ dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm font-black' 
                  : 'text-slate-400 hover:text-slate-650'
              }`}
            >
              Wallet
            </button>
            <button 
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                paymentMethod === 'upi' 
                  ? 'bg-christ dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm font-black' 
                  : 'text-slate-400 hover:text-slate-650'
              }`}
            >
              UPI App
            </button>
            <button 
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                paymentMethod === 'card' 
                  ? 'bg-christ dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm font-black' 
                  : 'text-slate-400 hover:text-slate-650'
              }`}
            >
              Card Form
            </button>
          </div>

          {/* Tab Content 1: Campus Wallet */}
          {paymentMethod === 'wallet' && (
            <div className="p-4 rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 animate-pop">
              <div className="flex items-center gap-3">
                <Wallet className="text-amber-500 w-10 h-10" />
                <div>
                  <h4 className="text-xs font-black">Canteen Student Wallet Account</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    Campus Balance: <span className="font-extrabold text-amber-500">₹{walletBalance.toFixed(2)}</span>
                  </p>
                </div>
              </div>
              {total > walletBalance && (
                <div className="mt-3 text-[10px] font-bold text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                  ⚠️ Wallet balance is insufficient. Swipe tabs to pay using Card or UPI.
                </div>
              )}
            </div>
          )}

          {/* Tab Content 2: UPI Apps */}
          {paymentMethod === 'upi' && (
            <div className="space-y-4 animate-pop">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Select UPI Provider</span>
              <div className="flex flex-col gap-3">
                {([
                  { id: 'gpay', name: 'Google Pay', description: 'Pay instantly via Google Pay app', logo: <GPayLogo />, borderColor: 'border-blue-500/30', bgColor: 'bg-blue-500/5' },
                  { id: 'phonepe', name: 'PhonePe', description: 'Instant transfer via PhonePe app', logo: <PhonePeLogo />, borderColor: 'border-purple-500/30', bgColor: 'bg-purple-500/5' },
                  { id: 'paytm', name: 'Paytm Wallet & UPI', description: 'Secure payment via Paytm app', logo: <PaytmLogo />, borderColor: 'border-cyan-500/30', bgColor: 'bg-cyan-500/5' },
                  { id: 'amazonpay', name: 'Amazon Pay', description: 'Fast checkout via Amazon Pay', logo: <AmazonPayLogo />, borderColor: 'border-orange-500/30', bgColor: 'bg-orange-500/5' }
                ] as const).map(app => {
                  const isSelected = selectedUpiApp === app.id;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected 
                          ? `${app.borderColor} ${app.bgColor} border-2 scale-[1.01] shadow-sm` 
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:border-slate-350'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Branded Logo */}
                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-105 dark:border-slate-850 p-1 flex-shrink-0">
                          {app.logo}
                        </div>
                        <div className="text-left">
                          <span className="font-black text-xs block">{app.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{app.description}</span>
                        </div>
                      </div>
                      
                      {/* Selection indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-500 text-black' 
                          : 'border-slate-300 dark:border-slate-750'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom UPI option trigger */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUpiApp('custom')}
                  className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                    selectedUpiApp === 'custom' 
                      ? 'border-amber-500 text-amber-500 bg-amber-500/5 border-2' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  Custom UPI ID
                </button>
              </div>

              {selectedUpiApp === 'custom' && (
                <div className="pt-2 animate-pop">
                  <input 
                    type="text" 
                    placeholder="Enter UPI Address (e.g. devansh@okaxis)"
                    value={customUpiId}
                    onChange={(e) => setCustomUpiId(e.target.value)}
                    className={`w-full p-3 rounded-xl text-xs outline-none border transition-all ${
                      darkMode 
                        ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                    }`}
                  />
                </div>
              )}
            </div>
          )}

          {/* Tab Content 3: Card Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 animate-pop">
              {savedCards.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Select Saved Card</span>
                  <div className="grid grid-cols-1 gap-2">
                    {savedCards.map(card => {
                      const isSelected = !isUsingNewCard && selectedSavedCardId === card.id;
                      return (
                        <div 
                          key={card.id}
                          onClick={() => { setSelectedSavedCardId(card.id); setIsUsingNewCard(false); }}
                          className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-500/5 border-2' 
                              : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <CreditCard size={14} className={isSelected ? 'text-amber-500' : 'text-slate-400'} />
                            <span className="text-xs font-black">{card.type} ending in {card.last4}</span>
                          </div>
                          {isSelected && <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white"><Check size={10} strokeWidth={3} /></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsUsingNewCard(true)}
                className={`w-full py-2.5 rounded-xl border border-dashed text-[10px] font-black uppercase tracking-wider text-center transition-all ${
                  isUsingNewCard 
                    ? 'border-amber-500 text-amber-500 bg-amber-500/5' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                💳 Use New Card credentials
              </button>

              {isUsingNewCard && (
                <div className="space-y-3 pt-2 animate-pop">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className={`w-full p-3 rounded-xl text-xs outline-none border transition-all ${
                        darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className={`w-full p-3 rounded-xl text-xs outline-none border transition-all ${
                          darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">CVV Code</label>
                      <input 
                        type="password" 
                        placeholder="•••"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        className={`w-full p-3 rounded-xl text-xs outline-none border transition-all ${
                          darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Devansh Gupta"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={`w-full p-3 rounded-xl text-xs outline-none border transition-all ${
                        darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BILL SUMMARY DETAILS */}
        <div className={`rounded-3xl border p-5 relative overflow-hidden transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <h3 className="font-black text-sm uppercase tracking-wider text-slate-400 mb-4">Summary Breakdown</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>Subtotal</span><span>₹{itemTotal}</span></div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>Taxes & GST (5%)</span><span>₹{gst}</span></div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>Cafeteria Fee</span><span>₹{platformFee}</span></div>
            {deliveryOption === 'hostel' && (
              <div className="flex justify-between text-xs font-bold text-amber-500 uppercase animate-pop">
                <span>Dorm Delivery Fee</span><span>+ ₹10</span>
              </div>
            )}
            {activePromoDiscount > 0 && (
              <div className="flex justify-between text-xs font-black text-green-600 uppercase animate-pop">
                <span>CHRIST20 Discount (20%)</span><span>- ₹{discountAmount}</span>
              </div>
            )}
          </div>
          <div className="border-t-2 border-dashed border-slate-200 dark:border-slate-800 pt-4 flex justify-between font-black text-xl">
            <span>Grand Total</span><span>₹{total}</span>
          </div>
        </div>

      </div>

      {/* Swipe payment bottom bar */}
      <div className={`fixed bottom-0 left-0 right-0 max-w-[414px] mx-auto border-t p-5 z-40 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150'
      }`}>
        <button 
          onClick={handleCheckout} 
          disabled={isProcessing}
          className="w-full bg-christ dark:bg-amber-500 text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:bg-christ/95 dark:hover:bg-amber-600 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Transacting Securely...
            </>
          ) : (
            `Pay ₹${total}`
          )}
        </button>
      </div>

      {/* HIGH FIDELITY MULTI-STAGE SECURE GATEWAY OVERLAY MODAL */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-5">
          <div className="w-full max-w-[360px] rounded-3xl p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-2xl text-slate-800 dark:text-white relative animate-pop overflow-hidden">
            {/* Metallic top line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-christ via-amber-500 to-blue-900" />
            
            {/* Stage 1: Initiating */}
            {processingStage === 'initiating' && (
              <div className="flex flex-col items-center text-center py-6">
                <Loader2 size={48} className="text-amber-500 animate-spin mb-4" />
                <h3 className="text-base font-black tracking-tight">Initiating Gateway Tunnel</h3>
                <p className="text-xs text-slate-400 mt-2 font-semibold leading-relaxed">
                  {paymentMethod === 'wallet' && 'Locking wallet balance & checking ticket quotas...'}
                  {paymentMethod === 'upi' && `Routing tokens securely to ${selectedUpiApp.toUpperCase()} payload...`}
                  {paymentMethod === 'card' && 'Binding to secure Visa/Mastercard host networks...'}
                </p>
              </div>
            )}

            {/* Stage 2: Authenticating */}
            {processingStage === 'authenticating' && (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                  <ShieldCheck size={28} className="animate-pulse" />
                </div>
                <h3 className="text-base font-black tracking-tight">Securing Connection</h3>
                
                {paymentMethod === 'upi' ? (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-slate-455 text-slate-400 font-semibold leading-relaxed">
                      Please check your phone. A request from <span className="font-extrabold text-christ dark:text-amber-400">Canteen Rush (₹{total})</span> was dispatched.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border dark:border-slate-850 inline-block">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block leading-none">Auto-Cancel Timeout</span>
                      <span className="text-sm font-extrabold text-amber-500 font-mono mt-1 block">00:{countdown < 10 ? '0' : ''}{countdown}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-2 font-semibold leading-relaxed">
                    Exchanging token certificates with banking servers. Please do not refresh.
                  </p>
                )}
              </div>
            )}

            {/* Stage 3: OTP Page */}
            {processingStage === 'otp' && (
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center gap-2 pb-3 border-b dark:border-slate-800">
                  <Lock size={16} className="text-green-500" />
                  <div>
                    <h3 className="text-xs font-black tracking-tight">3D Secure Bank Verification</h3>
                    <p className="text-[8px] text-slate-400 uppercase font-mono">Verify credentials ending in *3210</p>
                  </div>
                </div>

                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter the 6-digit One Time Password (OTP) sent by your card issuing bank:
                </p>

                <div className="space-y-1 text-center">
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="••••••"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-2xl font-mono tracking-widest py-3 rounded-2xl border bg-slate-50 dark:bg-slate-950 outline-none focus:border-amber-500 text-slate-850 dark:text-white"
                  />
                  <button 
                    type="button"
                    onClick={() => setOtpInput(generatedOtp)}
                    className="text-[10px] text-amber-500 font-black uppercase hover:underline mt-1 bg-amber-500/10 px-3 py-1 rounded-full inline-block"
                  >
                    Auto-Fill Demo OTP ({generatedOtp})
                  </button>
                </div>

                <div className="flex gap-3 mt-4 pt-3 border-t dark:border-slate-800">
                  <button 
                    onClick={() => setIsProcessing(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 font-black text-[10px] uppercase tracking-wider rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleVerifyOtp}
                    className="flex-1 py-3 bg-christ dark:bg-amber-500 text-white dark:text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl"
                  >
                    Verify & Pay
                  </button>
                </div>
              </div>
            )}

            {/* Stage 4: Success */}
            {processingStage === 'success' && (
              <div className="flex flex-col items-center text-center py-6 animate-pop">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                  <Check size={36} strokeWidth={3} />
                </div>
                <h3 className="text-lg font-black tracking-tight text-green-500">Transaction Approved</h3>
                <p className="text-xs text-slate-400 mt-2 font-semibold">
                  Secured charge of ₹{total} applied successfully.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
