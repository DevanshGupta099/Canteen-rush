import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Sparkles, Coffee, UtensilsCrossed, AlertCircle, Loader2, QrCode, X, CheckCircle2 } from 'lucide-react';
import { useStore, type MealPass } from '../store/useStore';

export default function PassesPage() {
  const navigate = useNavigate();
  const { activePasses, walletBalance, purchasePass, redeemPass, darkMode } = useStore();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [activeQR, setActiveQR] = useState<MealPass | null>(null);
  const [qrScanned, setQrScanned] = useState(false);

  const passesCatalog = [
    {
      id: 'pass-lunch',
      name: '30-Day Gourmet Lunch Pass',
      price: 1500,
      originalPrice: 3000,
      description: 'Standard buffet lunch once daily for 30 days at The Gourmet. Perfect for hostel students to skip payment queues!',
      type: 'lunch' as const,
      icon: UtensilsCrossed,
      tag: 'Hostel Favourite',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'pass-coffee',
      name: 'Daily Morning Coffee Pass',
      price: 300,
      originalPrice: 650,
      description: '1 classic thick Cold Coffee daily for 30 days at Ivy Hall. Fuel your morning classes without standing in line!',
      type: 'coffee' as const,
      icon: Coffee,
      tag: 'Class Companion',
      color: 'from-blue-500 to-indigo-700'
    }
  ];

  const handleBuy = (catalogItem: typeof passesCatalog[0]) => {
    if (walletBalance < catalogItem.price) {
      toast.error('Insufficient Wallet Balance! Top up first.', {
        duration: 3000,
        style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
      });
      navigate('/wallet');
      return;
    }

    setBuyingId(catalogItem.id);
    setTimeout(() => {
      const success = purchasePass(catalogItem.name, catalogItem.price, catalogItem.type);
      setBuyingId(null);
      if (success) {
        toast.success(`Active! Purchased ${catalogItem.name}`, {
          icon: '🎉',
          style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
        });
      } else {
        toast.error('Something went wrong.');
      }
    }, 1200);
  };

  return (
    <div className={`min-h-full pb-24 transition-colors duration-300 relative ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
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
        <h2 className="font-black text-xl">Meal Passes & Subscriptions</h2>
      </div>

      <div className="px-5 pt-6">
        
        {/* Active Passes Section */}
        <h3 className={`font-bold mb-4 px-1 text-sm uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Active Subscriptions ({activePasses.length})
        </h3>

        {activePasses.length > 0 ? (
          <div className="flex flex-col gap-4 mb-8">
            {activePasses.map(pass => (
              <div 
                key={pass.id} 
                className={`p-5 rounded-[28px] border transition-all duration-300 relative overflow-hidden ${
                  darkMode ? 'bg-slate-900 border-slate-800 shadow-md' : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                {/* Visual badge top right */}
                <span className="absolute top-4 right-4 bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-green-500/20">
                  Active
                </span>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-md ${pass.daysLeft === 0 ? 'grayscale opacity-50' : ''}`}>
                    {pass.type === 'lunch' ? <UtensilsCrossed size={20} /> : <Coffee size={20} />}
                  </div>
                  <div>
                    <h4 className="font-black text-base">{pass.name}</h4>
                    <p className={`text-[10px] font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{pass.id}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Pass Validity</span>
                    <span className="text-amber-500">{pass.daysLeft} days remaining</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <style>{`.pass-progress-${pass.id} { width: ${(pass.daysLeft / 30) * 100}%; }`}</style>
                    <div 
                      className={`h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 pass-progress-${pass.id}`} 
                    />
                  </div>
                  
                  {/* Footer logic: Check if used today */}
                  {(() => {
                    const today = new Date().toISOString().split('T')[0];
                    const isUsedToday = pass.lastUsedDate === today;
                    
                    return (
                      <div className="flex justify-between items-center pt-2">
                        <p className={`text-[10px] font-bold ${isUsedToday ? 'text-amber-500' : 'text-slate-500'}`}>
                          {isUsedToday ? 'Used Today' : 'Limit: 1 checkout / day'}
                        </p>
                        <button 
                          onClick={() => {
                            if (isUsedToday) {
                              toast.error('Pass already consumed for today!', {
                                style: { borderRadius: '12px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
                              });
                            } else {
                              setActiveQR(pass);
                              setQrScanned(false);
                            }
                          }}
                          disabled={isUsedToday}
                          className={`font-black text-xs px-4 py-2 rounded-xl transition active:scale-95 flex items-center gap-1.5 ${
                            isUsedToday 
                              ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed' 
                              : 'bg-christ hover:bg-christ/95 text-white'
                          }`}
                        >
                          {isUsedToday ? <CheckCircle2 size={14} /> : <QrCode size={14} />} 
                          {isUsedToday ? 'Consumed' : 'Redeem'}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-6 rounded-[28px] border text-center mb-8 flex flex-col items-center ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <AlertCircle className="text-slate-400 mb-3" size={32} />
            <p className="font-black text-sm">No Active Subscriptions</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[240px]">Hostel students can purchase cafeteria passes to save up to 50% on meals and skip payment lines.</p>
          </div>
        )}

        {/* Catalog List */}
        <h3 className={`font-bold mb-4 px-1 text-sm uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Available Meal Subscriptions
        </h3>

        <div className="flex flex-col gap-5">
          {passesCatalog.map(catalogItem => {
            const isBuying = buyingId === catalogItem.id;
            return (
              <div 
                key={catalogItem.id}
                className={`rounded-[32px] overflow-hidden border transition-all duration-300 ${
                  darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                {/* Colorful Banner Header */}
                <div className={`bg-gradient-to-r ${catalogItem.color} p-5 text-white relative`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                  <span className="bg-white/20 text-white font-black text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {catalogItem.tag}
                  </span>
                  <h4 className="font-black text-lg mt-2 flex items-center gap-2">
                    <catalogItem.icon size={20} /> {catalogItem.name}
                  </h4>
                </div>

                {/* Details Body */}
                <div className="p-5">
                  <p className={`text-xs font-semibold leading-relaxed mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {catalogItem.description}
                  </p>

                  <div className={`p-4 rounded-2xl flex justify-between items-center mb-5 ${
                    darkMode ? 'bg-slate-850' : 'bg-slate-50'
                  }`}>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Special Price</p>
                      <p className="text-2xl font-black text-amber-500 mt-0.5">
                        ₹{catalogItem.price}
                        <span className={`text-xs line-through ml-2 font-bold ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                          ₹{catalogItem.originalPrice}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-green-500 font-black uppercase bg-green-500/10 px-2 py-0.5 rounded border border-green-500/10">
                        Save 50%
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleBuy(catalogItem)}
                    disabled={isBuying}
                    className="w-full bg-christ hover:bg-christ/95 text-white font-black py-3.5 rounded-2xl shadow-lg transition active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isBuying ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Verifying...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} className="text-amber-400 fill-amber-400" /> Purchase 30-Day Subscription
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Redemption Modal Overlay */}
      {activeQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className={`w-full max-w-sm rounded-[32px] p-6 relative overflow-hidden shadow-2xl animate-pop ${
              darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'
            }`}
          >
            <button 
              onClick={() => setActiveQR(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Close modal"
              title="Close modal"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6 mt-2">
              <h3 className="text-xl font-black">{activeQR.name}</h3>
              <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{activeQR.id}</p>
            </div>

            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-3xl ${darkMode ? 'bg-white' : 'bg-slate-50 border border-slate-100'}`}>
                {/* Mock QR Code Pattern */}
                <div className="grid grid-cols-5 gap-1.5 w-48 h-48 opacity-90">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`${[0,4,20,24,6,8,12,16,18].includes(i) ? 'bg-black' : 'bg-black/80'} rounded-sm ${[0,4,20,24].includes(i) ? 'scale-110' : ''}`} 
                    />
                  ))}
                  {/* Overlay actual icon for aesthetic */}
                  <div className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference pointer-events-none">
                    <QrCode size={48} strokeWidth={1} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-4 text-center mb-6">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-500">
                Show this QR code at the billing counter. The vendor will scan it to apply your pass.
              </p>
            </div>

            <button
              onClick={() => {
                setQrScanned(true);
                setTimeout(() => {
                  const success = redeemPass(activeQR.id);
                  if (success) {
                    toast.success('Pass successfully consumed for today!', { icon: '✅' });
                    setActiveQR(null);
                  } else {
                    toast.error('Failed to consume pass. Please try again.');
                    setQrScanned(false);
                  }
                }, 1500);
              }}
              disabled={qrScanned}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                qrScanned 
                  ? 'bg-green-500 text-white' 
                  : 'bg-christ hover:bg-christ/95 text-white active:scale-[0.98]'
              }`}
            >
              {qrScanned ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Verifying Scan...
                </>
              ) : (
                'Simulate Vendor Scan (Demo)'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
