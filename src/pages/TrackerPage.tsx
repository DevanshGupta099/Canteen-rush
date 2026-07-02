import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, ChefHat, PackageCheck, Zap, ArrowLeft, AlertCircle, XCircle, BellRing, Volume2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { useStore } from '../store/useStore';

interface TrackedOrder {
  id: string;
  date: string;
  amount: number;
  items: number;
  status?: 'accepted' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  itemIds?: string[];
  timestamp?: number;
  queuePosition?: number;
  createdAt?: string;
}

export default function TrackerPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { pastOrders, cancelOrder, darkMode } = useStore();
  const activeOrder = pastOrders.find(o => o.id === orderId) as TrackedOrder | undefined;

  const [orderData, setOrderData] = useState<TrackedOrder | null>(activeOrder || null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showNotification, setShowNotification] = useState(false);

  // Timer interval to decrement time every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const statuses = [
    { text: 'Order Accepted', sub: 'Vendor confirmed and queued' },
    { text: 'Food is Preparing', sub: 'Chef is cooking your meal' },
    { text: 'Ready for Pickup', sub: 'Show QR at counter' }
  ];

  // Socket.io for Real-Time Tracking
  useEffect(() => {
    if (!orderId) return;

    // Fetch initial state first
    const fetchInitialOrder = async () => {
      const token = localStorage.getItem('canteen_rush_token');
      try {
        const res = await fetch(`https://canteen-rush-1.onrender.com/api/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const docSnap = await res.json();
          const data = {
            id: docSnap._id,
            status: docSnap.status,
            amount: docSnap.totalAmount,
            items: docSnap.items.reduce((s:number, i:any) => s + i.quantity, 0),
            timestamp: new Date(docSnap.timestamp).getTime(),
            itemIds: docSnap.items.map((i:any) => i.productId)
          } as TrackedOrder;
          
          setOrderData(data);

          if (data.timestamp) {
            const elapsed = Math.floor((Date.now() - data.timestamp) / 1000);
            const remaining = Math.max(0, 120 - elapsed);
            setTimeLeft(remaining);
          }
        }
      } catch (error) {
        console.error("API tracker error: ", error);
      }
    };
    
    fetchInitialOrder();

    // Connect to WebSocket
    const socket = io('https://canteen-rush-1.onrender.com');
    
    // Using global event, but filtering for our specific order
    socket.on('order_status_updated', (updatedOrder: any) => {
      if (updatedOrder._id === orderId) {
        setOrderData(prev => {
          if (updatedOrder.status === 'ready' && (!prev || prev.status !== 'ready')) {
            setShowNotification(true);
            toast.success('Your order is ready!', { icon: '🔔' });
          }
          return {
            ...prev,
            id: updatedOrder._id,
            status: updatedOrder.status,
          } as TrackedOrder;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  const handleCancel = () => {
    const currentOrder = orderData || activeOrder;
    if (!currentOrder) return;

    // Call store action to refund wallet balance and mark order cancelled
    cancelOrder(currentOrder.id, currentOrder.amount);

    toast.success(`Order refunded! ₹${currentOrder.amount} added to wallet.`, {
      icon: '💸',
      style: { borderRadius: '16px', background: '#1e293b', color: '#fff', fontSize: '14px', fontWeight: 'bold' }
    });

    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getStatusIndex = (statusStr: string) => {
    if (statusStr === 'accepted' || statusStr === 'received') return 0;
    if (statusStr === 'preparing') return 1;
    if (statusStr === 'ready' || statusStr === 'delivered') return 2;
    return 0;
  };

  const getPredictedReadyTime = (timestamp?: number) => {
    if (!timestamp) return '11:43 AM';
    const date = new Date(timestamp + 3 * 60 * 1000); // 3 mins prep time prediction
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentOrder = orderData || activeOrder;
  const isCancelled = currentOrder?.status === 'cancelled';
  const showCancelButton = currentOrder && timeLeft > 0 && !isCancelled;
  const isDineIn = currentOrder?.amount ? (currentOrder.amount % 3 === 0) : false; // Mock table order identifier
  const queuePosition = currentOrder?.queuePosition !== undefined ? currentOrder.queuePosition : 4;
  const statusIndex = getStatusIndex(currentOrder?.status || 'accepted');
  const predictedReadyTime = getPredictedReadyTime(currentOrder?.timestamp);

  return (
    <div className="bg-slate-900 min-h-screen w-full text-white pb-10 relative">

      {/* Background glowing blob */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

      {/* Header back button fixed with Lucide ArrowLeft icon */}
      <div className="px-5 pt-8 pb-4 relative z-10 flex items-center justify-between">
        <button
          aria-label="Go to home"
          onClick={() => navigate('/')}
          className="w-10 h-10 bg-white/10 hover:bg-white/15 rounded-full flex items-center justify-center text-white backdrop-blur-md transition active:scale-90"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-amber-400">Live Track</span>
      </div>

      <div className="px-5 relative z-10 flex flex-col items-center mt-4 pb-12">

        {/* Dynamic AI Time Prediction / Cancelled banner */}
        <div className="text-center mb-8">
          {isCancelled ? (
            <div className="animate-pop">
              <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-500/20">
                <XCircle size={32} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-red-500">Order Cancelled</h1>
              <p className="text-xs text-slate-400 mt-1.5 font-bold uppercase tracking-wider">Funds fully refunded to wallet</p>
            </div>
          ) : (
            <>
              <p className="text-slate-400 text-xs font-black tracking-widest mb-1 flex items-center justify-center gap-1">
                <Zap size={14} className="text-amber-500 animate-pulse" /> AI PREDICTED READY TIME
              </p>
              <h1 className="text-6xl font-black tracking-tighter text-white">{predictedReadyTime}</h1>
              <p className="text-[10px] text-amber-500 mt-2 font-black tracking-wider uppercase bg-amber-500/10 py-1 px-3 rounded-full inline-block">± 3 mins window</p>
            </>
          )}
        </div>

        {/* LIVE QUEUE PLACEMENT TRACKER */}
        {!isCancelled && (
          <div className="w-full bg-slate-900 rounded-[32px] p-5 mb-8 border border-white/10 flex justify-between items-center shadow-lg animate-pop relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-christ/20 to-transparent pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-christ/30 flex items-center justify-center text-christ-light dark:text-accent">
                <Volume2 size={18} className="animate-bounce" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Smart Queue</p>
                <h4 className="text-lg font-black mt-1 leading-snug text-white">
                  {queuePosition === 1 ? '🎉 Your food is ready!' : `You are #${queuePosition} in line`}
                </h4>
                <p className="text-[10px] text-green-400 font-bold mt-0.5">Skip the crowd. Pick up when ready.</p>
              </div>
            </div>
            {queuePosition > 1 && (
              <div className="relative z-10 w-8 h-8 rounded-full border-2 border-dashed border-christ-light flex items-center justify-center animate-spin text-christ-light text-xs font-black" />
            )}
          </div>
        )}

        {/* The QR Ticket - Wallet Pass Style */}
        <div className={`w-full rounded-[36px] overflow-hidden relative border transition-all duration-500 animate-slide-up ${isCancelled
          ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-950 shadow-xl'
          : 'bg-white border-slate-200 text-slate-900 shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:bg-slate-50 dark:border-slate-300 dark:text-slate-900 dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)]'
          }`}>
          
          {/* Top Header Banner of Pass */}
          <div className={`px-6 py-4 flex justify-between items-center ${isCancelled ? 'bg-red-500/10' : 'bg-christ'}`}>
            <span className={`text-[10px] font-black tracking-widest uppercase ${isCancelled ? 'text-red-700' : 'text-accent'}`}>
              🎫 CAMPUS MEAL PASS
            </span>
            <span className={`text-[10px] font-black uppercase ${isCancelled ? 'text-red-600' : 'text-white'}`}>
              {isDineIn ? '🍽️ Dine-in Table' : '🛍️ Takeaway'}
            </span>
          </div>

          <div className="p-6 relative z-10 flex flex-col items-center">
            <p className={`text-[10px] font-black tracking-widest uppercase opacity-50`}>
              PICK-UP TOKEN
            </p>

            {/* Giant 4-digit Pick-up Number */}
            <div className="relative my-2 select-all cursor-pointer group">
              <h2 className="text-7xl font-extrabold tracking-tighter font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform group-active:scale-95">
                #{orderId ? (orderId.includes('-') ? orderId.split('-')[1] : orderId.slice(-4).toUpperCase()) : '4921'}
              </h2>
            </div>
            <p className="text-[10px] font-bold opacity-40 font-mono">
              Ref: {orderId?.slice(-6).toUpperCase()}
            </p>
          </div>

          {/* Perforated Ticket Dashed Separator Line with side notches */}
          <div className="relative w-full flex items-center my-1">
            <div className={`absolute left-[-10px] w-6 h-6 rounded-full z-20 border-r ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-100 border-slate-200'}`} />
            <div className="w-full border-t-2 border-dashed border-slate-300 dark:border-slate-300 z-10 mx-4" />
            <div className={`absolute right-[-10px] w-6 h-6 rounded-full z-20 border-l ${darkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-100 border-slate-200'}`} />
          </div>

          {/* Bottom Half of Ticket */}
          <div className="p-6 pt-5 relative z-10 flex flex-col items-center pb-8">
            {/* QR Scanner Frame with animated scanning line */}
            <div className={`relative p-5 rounded-3xl flex justify-center items-center transition-all overflow-hidden ${isCancelled
              ? 'bg-red-50 border border-red-200'
              : 'bg-white border border-slate-100 shadow-inner'
              }`}>
              <QRCodeSVG
                value={orderId || 'error'}
                size={180}
                fgColor={isCancelled ? "#ef4444" : "#0f172a"}
                bgColor="#ffffff"
                includeMargin={false}
              />
              
              {/* Laser Scanning Animation */}
              {!isCancelled && (
                <div className="absolute top-0 left-0 w-full h-1 bg-christ shadow-[0_0_15px_3px_rgba(30,58,138,0.5)] animate-scan opacity-70" />
              )}
            </div>

            <p className={`text-center text-[10px] font-black uppercase tracking-wider mt-5 ${isCancelled ? 'text-red-500' : 'text-slate-400'}`}>
              {isCancelled
                ? '🔴 INVALID TOKEN / ORDER REFUNDED'
                : (queuePosition === 1
                  ? '✨ READY - SHOW AT COUNTER'
                  : '⏳ SCAN AT KIOSK TO CONFIRM')}
            </p>
          </div>
        </div>

        {/* Live Cancellation Countdown Window */}
        {showCancelButton && (
          <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-8 flex flex-col gap-3.5 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-black text-white">Need to cancel this meal?</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 leading-snug">
                  Christ Food Guidelines allow cancellations within 2 mins of booking.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-850 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Cancellation closes in</p>
                <p className="text-xl font-black text-amber-500 tabular-nums leading-none mt-1">{formatTime(timeLeft)}</p>
              </div>
              <button
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5"
              >
                Cancel Order
              </button>
            </div>
          </div>
        )}

        {/* Linear Progress Stages */}
        {!isCancelled && (
          <div className="w-full bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10">
            <div className="flex flex-col gap-6 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-white/10 -z-0" />

              {statuses.map((step, index) => {
                const isActive = index === statusIndex;
                const isCompleted = index < statusIndex;
                return (
                  <div key={index} className="flex items-start gap-4 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isActive
                      ? 'bg-amber-500 text-white ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/50'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-800 text-slate-500'
                      }`}>
                      {index === 0 && <CheckCircle2 size={16} />}
                      {index === 1 && <ChefHat size={16} className={isActive ? 'animate-bounce' : ''} />}
                      {index === 2 && <PackageCheck size={16} />}
                    </div>
                    <div>
                      <p className={`text-base font-black tracking-tight ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`}>
                        {step.text}
                      </p>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">{step.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MOCK SLIDE-IN READY PUSH ALERT NOTIFICATION */}
      {showNotification && (
        <div className="fixed top-6 left-0 right-0 px-4 z-50 max-w-[414px] mx-auto animate-slide-up">
          <div className="bg-slate-900 border border-slate-750 text-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-start gap-3 relative border-l-4 border-l-amber-500">

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center">
              <BellRing size={16} className="animate-pulse" />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Canteen Push Alert</span>
                <span className="text-[8px] text-slate-500">Just Now</span>
              </div>
              <h4 className="font-black text-xs mt-1">🍽️ Order Ready for Pick-up!</h4>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                Your Ivy Hall token `{orderId}` is ready! Present your gold pick-up ticket at Counter 2.
              </p>
            </div>

            <button
              onClick={() => setShowNotification(false)}
              className="p-1 hover:bg-slate-800 rounded text-slate-450 self-start"
              aria-label="Dismiss alert"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
