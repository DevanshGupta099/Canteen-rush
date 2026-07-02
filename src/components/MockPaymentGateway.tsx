import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, CreditCard, Smartphone, Wallet, Loader2, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

interface MockPaymentGatewayProps {
  amount: number;
  onSuccess: (method: 'wallet' | 'upi' | 'card') => void;
  onClose: () => void;
}

export function MockPaymentGateway({ amount, onSuccess, onClose }: MockPaymentGatewayProps) {
  const [method, setMethod] = useState<'wallet' | 'upi' | 'card'>('upi');
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');
  const [selectedUpi, setSelectedUpi] = useState<string | null>(null);
  
  const walletBalance = useStore((state) => state.walletBalance);

  const handlePay = () => {
    if (method === 'wallet' && walletBalance < amount) {
      return; // Handled in UI
    }
    
    setStep('processing');
    
    // Simulate real bank processing delay
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess(method);
      }, 1500); // Wait on success screen before returning
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-700">Secure Checkout</span>
          </div>
          {step === 'selection' && (
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 overflow-y-auto p-6"
            >
              <div className="text-center mb-8">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Amount to Pay</p>
                <div className="text-4xl font-bold text-gray-900">₹{amount.toFixed(2)}</div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                {[
                  { id: 'upi', icon: Smartphone, label: 'UPI' },
                  { id: 'card', icon: CreditCard, label: 'Card' },
                  { id: 'wallet', icon: Wallet, label: 'Wallet' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id as any)}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg text-sm font-medium transition-all ${
                      method === m.id
                        ? 'bg-white shadow-sm text-[#ff4b2b]'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
                  >
                    <m.icon className="w-5 h-5" />
                    {m.label}
                  </button>
                ))}
              </div>

              {/* UPI Form */}
              {method === 'upi' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Select UPI App</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'gpay', name: 'GPay', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
                      { id: 'phonepe', name: 'PhonePe', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg' },
                      { id: 'paytm', name: 'Paytm', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg' }
                    ].map(app => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedUpi(app.id)}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                          selectedUpi === app.id ? 'border-[#ff4b2b] bg-[#ff4b2b]/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={app.logo} alt={app.name} className="h-6 w-auto mb-2 object-contain" />
                        <span className="text-xs font-medium text-gray-600">{app.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">OR ENTER UPI ID</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="example@upi" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
                  />
                  
                  <button
                    onClick={handlePay}
                    className="w-full bg-[#ff4b2b] hover:bg-[#ff3b1b] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#ff4b2b]/30 transition-all active:scale-[0.98]"
                  >
                    Pay ₹{amount.toFixed(2)} securely
                  </button>
                </motion.div>
              )}

              {/* Card Form */}
              {method === 'card' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-2xl text-white shadow-xl mb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                      <CreditCard className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-6">
                        <div className="w-12 h-8 bg-yellow-400/80 rounded flex items-center justify-center">
                          <div className="w-8 h-5 border border-yellow-600 rounded-sm opacity-50"></div>
                        </div>
                        <span className="italic font-bold">VISA</span>
                      </div>
                      <div className="text-xl tracking-widest font-mono mb-2">
                        **** **** **** 4242
                      </div>
                      <div className="flex justify-between text-xs text-gray-300 font-medium">
                        <span>CARDHOLDER NAME</span>
                        <span>VALID THRU</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>JOHN DOE</span>
                        <span>12/28</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff4b2b]" />
                    <input type="text" placeholder="CVV" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff4b2b]" />
                  </div>
                  
                  <button
                    onClick={handlePay}
                    className="w-full bg-[#ff4b2b] hover:bg-[#ff3b1b] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#ff4b2b]/30 transition-all active:scale-[0.98] mt-2"
                  >
                    Pay ₹{amount.toFixed(2)} securely
                  </button>
                </motion.div>
              )}

              {/* Wallet Form */}
              {method === 'wallet' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className={`p-6 rounded-2xl border-2 flex items-center justify-between ${walletBalance >= amount ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${walletBalance >= amount ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Available Balance</p>
                        <p className={`text-2xl font-bold ${walletBalance >= amount ? 'text-green-700' : 'text-red-700'}`}>₹{walletBalance.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {walletBalance < amount ? (
                    <div className="text-center p-4">
                      <p className="text-red-600 font-medium mb-4">Insufficient balance. Please add funds or choose another payment method.</p>
                      <button onClick={() => setMethod('upi')} className="text-[#ff4b2b] font-bold hover:underline">
                        Use UPI Instead
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handlePay}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-600/30 transition-all active:scale-[0.98]"
                    >
                      Pay from Wallet
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-20 px-6 text-center"
            >
              <Loader2 className="w-16 h-16 text-[#ff4b2b] animate-spin mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-500">
                {method === 'upi' && 'Waiting for you to approve payment on your UPI app...'}
                {method === 'card' && 'Contacting your bank securely...'}
                {method === 'wallet' && 'Deducting from your Rush Wallet...'}
              </p>
              <div className="mt-8 flex gap-1.5 items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-400 font-medium">100% Secure Transaction</span>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              >
                <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-500 font-medium">₹{amount.toFixed(2)} paid securely.</p>
              <p className="text-sm text-gray-400 mt-6 animate-pulse">Redirecting to order...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
