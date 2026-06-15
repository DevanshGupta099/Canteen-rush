import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { ArrowLeft, Plus, CreditCard, History, X, Check, Loader2 } from 'lucide-react';

export default function WalletPage() {
  const { walletBalance, pastOrders, addWalletBalance, savedCards, darkMode } = useStore();
  const navigate = useNavigate();
  
  // Custom Add Money Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<number | null>(savedCards[0]?.id || null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuickAdd = (amount: number) => {
    addWalletBalance(amount);
    toast.success(`Successfully added ₹${amount} to your wallet!`, {
      icon: '💰',
      style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
    });
  };

  const handleCustomAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(customAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    if (amountVal > 10000) {
      toast.error('Maximum add limit is ₹10,000 per transaction.');
      return;
    }
    if (!selectedCardId) {
      toast.error('Please select a payment card.');
      return;
    }

    setIsProcessing(true);
    // Simulate premium payment processing gateway
    setTimeout(() => {
      addWalletBalance(amountVal);
      setIsProcessing(false);
      setIsModalOpen(false);
      setCustomAmount('');
      toast.success(`Successfully added ₹${amountVal.toFixed(2)}!`, {
        icon: '✅',
        style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
      });
    }, 1200);
  };

  return (
    <div className={`min-h-full pb-24 transition-colors duration-300 relative ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Header */}
      <div className={`px-5 pt-8 pb-4 sticky top-0 z-20 shadow-sm flex items-center gap-4 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-slate-100'}`}>
        <button 
          aria-label="Go back" 
          onClick={() => navigate('/')} 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-black text-xl">My Wallet</h2>
      </div>

      {/* Main Balance Card */}
      <div className="px-5 pt-6">
        <div className="bg-gradient-to-br from-christ to-blue-900 rounded-[32px] p-6 text-white shadow-xl shadow-christ/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-1">Available Balance</p>
          <h1 className="text-5xl font-black mb-6">₹{walletBalance.toFixed(2)}</h1>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-christ hover:bg-slate-50 font-black py-3.5 px-6 rounded-2xl shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Plus size={20} /> Add Custom Amount
          </button>
        </div>

        {/* Quick Add Section */}
        <h3 className={`font-bold mt-8 mb-4 px-1 text-sm uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Quick Add Funds</h3>
        <div className="flex gap-3 mb-8">
          {[100, 200, 500].map(amount => (
            <button 
              key={amount} 
              onClick={() => handleQuickAdd(amount)}
              className={`flex-1 py-4 border rounded-2xl font-black text-sm transition-all active:scale-95 ${
                darkMode 
                  ? 'bg-slate-900 border-slate-800 text-amber-500 hover:border-amber-500/40 hover:bg-slate-850' 
                  : 'bg-white border-slate-250 text-christ shadow-sm hover:border-christ hover:bg-slate-50'
              }`}
            >
              + ₹{amount}
            </button>
          ))}
        </div>

        {/* Transactions */}
        <h3 className={`font-bold mb-4 px-1 flex items-center gap-2 text-sm uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <History size={16} className="text-amber-500" /> Transaction History
        </h3>
        <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
          {pastOrders.length > 0 ? (
            pastOrders.map((order, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-4 border-b last:border-0 ${darkMode ? 'border-slate-850' : 'border-slate-5'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black">
                      {order.status === 'cancelled' ? `Refund for Order ${order.id}` : `Order Payment ${order.id}`}
                    </p>
                    <p className={`text-[10px] font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{order.date}</p>
                  </div>
                </div>
                <p className={`font-black text-base ${order.status === 'cancelled' ? 'text-green-500' : (darkMode ? 'text-white' : 'text-slate-850')}`}>
                  {order.status === 'cancelled' ? '+' : '-'} ₹{order.amount}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 font-bold">No transactions found</div>
          )}
        </div>
      </div>

      {/* Add Money Modal Sheet */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center px-4 pb-4">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => !isProcessing && setIsModalOpen(false)} />
          
          {/* Sheet */}
          <div className={`w-full max-w-[380px] rounded-3xl p-6 relative z-10 animate-slide-up transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Add Funds</h3>
              <button 
                aria-label="Close modal"
                disabled={isProcessing}
                onClick={() => setIsModalOpen(false)} 
                className={`p-1.5 rounded-full ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'}`}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCustomAddSubmit} className="flex flex-col gap-5">
              
              {/* Amount input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wide">Enter Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-slate-400">₹</span>
                  <input 
                    type="number" 
                    placeholder="500" 
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    disabled={isProcessing}
                    required
                    className={`w-full py-4 pl-9 pr-4 rounded-xl font-black text-xl outline-none border ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 focus:border-amber-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-christ text-slate-800'
                    }`}
                  />
                </div>
              </div>

              {/* Card selector */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wide">Select Payment Method</label>
                  <button 
                    type="button" 
                    onClick={() => { setIsModalOpen(false); navigate('/payments'); }}
                    className="text-xs font-bold text-amber-500 hover:text-amber-600"
                  >
                    + Add New Card
                  </button>
                </div>
                {savedCards.length > 0 ? (
                  <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1 no-scrollbar">
                    {savedCards.map(card => {
                      const isSelected = selectedCardId === card.id;
                      return (
                        <div 
                          key={card.id}
                          onClick={() => !isProcessing && setSelectedCardId(card.id)}
                          className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-500/10' 
                              : (darkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300')
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard size={18} className={isSelected ? 'text-amber-500' : 'text-slate-400'} />
                            <div>
                              <p className="text-xs font-black">{card.type} •••• {card.last4}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">Exp: {card.expiry}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl border text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-xs text-slate-400 font-bold mb-2">No saved cards found</p>
                    <button 
                      type="button" 
                      onClick={() => navigate('/payments')} 
                      className="bg-christ text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                    >
                      Setup Cards
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button 
                type="submit"
                disabled={isProcessing || savedCards.length === 0}
                className="w-full bg-christ text-white py-4 rounded-xl font-black text-base shadow-xl flex justify-center items-center gap-2 hover:bg-christ/90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing Securely...
                  </>
                ) : (
                  'Confirm & Add Funds'
                )}
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}