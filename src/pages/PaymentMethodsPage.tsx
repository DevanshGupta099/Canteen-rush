import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ShieldCheck, CreditCard, X, HelpCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const { savedCards, addSavedCard, removeSavedCard, darkMode } = useStore();

  // Add Card Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleDeleteCard = (id: number) => {
    removeSavedCard(id);
    toast.success('Payment card removed successfully', {
      style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
    });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, ''); // strip non-digits
    if (rawVal.length <= 16) {
      setCardNumber(rawVal);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawVal = e.target.value.replace(/\D/g, ''); // strip non-digits
    if (rawVal.length > 4) rawVal = rawVal.slice(0, 4);

    if (rawVal.length >= 3) {
      setExpiry(`${rawVal.slice(0, 2)}/${rawVal.slice(2)}`);
    } else {
      setExpiry(rawVal);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (rawVal.length <= 3) {
      setCvv(rawVal);
    }
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length !== 16) {
      toast.error('Card number must be exactly 16 digits.');
      return;
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) {
      toast.error('Expiry date must be in MM/YY format.');
      return;
    }

    if (cvv.length !== 3) {
      toast.error('CVV must be exactly 3 digits.');
      return;
    }

    if (!cardName.trim()) {
      toast.error("Please enter the cardholder's name.");
      return;
    }

    setIsSaving(true);

    // Auto-detect card type
    let cardType = 'Card';
    if (cardNumber.startsWith('4')) {
      cardType = 'Visa';
    } else if (cardNumber.startsWith('5')) {
      cardType = 'Mastercard';
    } else if (cardNumber.startsWith('3')) {
      cardType = 'Amex';
    }

    const last4 = cardNumber.slice(-4);

    // Simulate PCI compliance encryption delay
    setTimeout(() => {
      addSavedCard({
        type: cardType,
        last4,
        expiry
      });
      setIsSaving(false);
      setIsModalOpen(false);

      // Reset form fields
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setCardName('');

      toast.success('New card saved securely!', {
        icon: '💳',
        style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
      });
    }, 1000);
  };

  return (
    <div className={`min-h-full pb-10 transition-colors duration-300 relative ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Header */}
      <div className={`px-5 pt-8 pb-4 sticky top-0 z-20 shadow-sm flex items-center gap-4 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-slate-100'}`}>
        <button 
          aria-label="Go back" 
          onClick={() => navigate(-1)} 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-black text-xl">Payment Methods</h2>
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
            Your payment card details are encrypted, kept sandboxed, and comply fully with PCIDSS standards.
          </p>
        </div>

        {/* Saved Cards Header */}
        <h3 className={`font-bold mb-4 px-1 text-sm uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Saved Cards ({savedCards.length})
        </h3>

        {/* Saved Cards List */}
        <div className="flex flex-col gap-3">
          {savedCards.length > 0 ? (
            savedCards.map(card => (
              <div 
                key={card.id} 
                className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-9 rounded-lg flex items-center justify-center font-bold text-xs uppercase tracking-wider ${
                    card.type === 'Visa' 
                      ? 'bg-blue-800 text-white' 
                      : card.type === 'Mastercard' 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-slate-800 text-white'
                  }`}>
                    {card.type}
                  </div>
                  <div>
                    <p className="font-black text-sm">•••• •••• •••• {card.last4}</p>
                    <p className={`text-[10px] font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Exp: {card.expiry}</p>
                  </div>
                </div>
                <button 
                  aria-label="Delete card" 
                  onClick={() => handleDeleteCard(card.id)} 
                  className={`p-2.5 rounded-full transition-colors ${
                    darkMode ? 'text-red-400 hover:bg-red-950/20' : 'text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            ))
          ) : (
            <div className={`text-center py-10 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <CreditCard className="mx-auto text-slate-400 mb-3" size={32} />
              <p className="font-bold text-sm">No saved cards found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">Add a debit/credit card to easily top up your campus food wallet.</p>
            </div>
          )}
        </div>

        {/* Add Card Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`w-full mt-6 py-4 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all active:scale-[0.98] ${
            darkMode 
              ? 'border-slate-800 text-slate-400 hover:border-amber-500 hover:text-amber-500 bg-slate-900/20' 
              : 'border-slate-300 text-slate-500 hover:border-christ hover:text-christ bg-transparent'
          }`}
        >
          <Plus size={20} /> Add New Card
        </button>
      </div>

      {/* Add Card Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0" onClick={() => !isSaving && setIsModalOpen(false)} />
          
          <div className={`w-full max-w-[380px] rounded-3xl p-6 relative z-10 animate-slide-up transition-colors duration-300 ${
            darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
          }`}>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <CreditCard size={20} className="text-amber-500" /> New Card
              </h3>
              <button 
                aria-label="Close modal"
                disabled={isSaving}
                onClick={() => setIsModalOpen(false)} 
                className={`p-1.5 rounded-full ${
                  darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="flex flex-col gap-4">
              
              {/* Cardholder name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="Devansh Gupta" 
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  disabled={isSaving}
                  required
                  className={`p-3 rounded-xl border outline-none font-semibold text-sm transition-all ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-700 focus:border-amber-500 text-white' 
                      : 'bg-slate-50 border-slate-200 focus:border-christ text-slate-800'
                  }`}
                />
              </div>

              {/* Card number */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Card Number (16 Digits)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="4242 4242 4242 4242" 
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    disabled={isSaving}
                    required
                    maxLength={16}
                    className={`w-full p-3 pr-10 rounded-xl border outline-none font-semibold text-sm tracking-widest transition-all ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 focus:border-amber-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-christ text-slate-800'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <HelpCircle size={16} />
                  </div>
                </div>
              </div>

              {/* Expiry and CVV Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Expiry (MM/YY)</label>
                  <input 
                    type="text" 
                    placeholder="12/29" 
                    value={expiry}
                    onChange={handleExpiryChange}
                    disabled={isSaving}
                    required
                    maxLength={5}
                    className={`p-3 rounded-xl border outline-none font-semibold text-sm text-center transition-all ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 focus:border-amber-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-christ text-slate-800'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">CVV (3 Digits)</label>
                  <input 
                    type="password" 
                    placeholder="•••" 
                    value={cvv}
                    onChange={handleCvvChange}
                    disabled={isSaving}
                    required
                    maxLength={3}
                    className={`p-3 rounded-xl border outline-none font-semibold text-sm text-center tracking-widest transition-all ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 focus:border-amber-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-christ text-slate-800'
                    }`}
                  />
                </div>
              </div>

              {/* Submit */}
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full mt-4 bg-christ text-white py-4 rounded-xl font-black text-base shadow-xl flex justify-center items-center gap-2 hover:bg-christ/95 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Saving Securely...
                  </>
                ) : (
                  'Save Payment Method'
                )}
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}