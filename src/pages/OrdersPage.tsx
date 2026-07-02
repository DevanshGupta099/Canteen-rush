import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { ReceiptText, CheckCircle2, RefreshCw, XCircle, Star, Download } from 'lucide-react';

export interface Order {
  id: string;
  date: string;
  amount: number;
  items: number;
  status?: 'preparing' | 'ready' | 'delivered' | 'cancelled';
  itemIds?: string[];
  createdAt?: string;
  queuePosition?: number;
  isRated?: boolean;
}

export default function OrdersPage() {
  const { pastOrders, reorder, darkMode, canteens, rateOrder } = useStore();
  const navigate = useNavigate();

  const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; orderId: string; canteenId: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const getCanteenIdForOrder = (itemIds?: string[]) => {
    if (!itemIds || itemIds.length === 0) return '';
    const firstItemId = itemIds[0];
    const canteen = canteens.find(c => c.menu.some(m => m.id === firstItemId));
    return canteen ? canteen.id : '';
  };

  const submitReview = async () => {
    if (!ratingModal) return;
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    
    // Call our real backend API via Zustand
    if (rateOrder) {
      await rateOrder(ratingModal.orderId, rating, comment);
    }
    
    toast.success('Thank you for your feedback!');
    setRatingModal(null);
    setRating(0);
    setComment('');
  };

  const downloadInvoice = (order: Order) => {
    const canteenId = getCanteenIdForOrder(order.itemIds);
    const canteen = canteens.find(c => c.id === canteenId);
    
    // Create a temporary iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>Invoice ${order.id}</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; }
              .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: 900; margin: 0; }
              .subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }
              .details { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 14px; }
              .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
              .total { font-size: 18px; font-weight: 900; margin-top: 20px; padding-top: 20px; border-top: 2px solid #e2e8f0; display: flex; justify-content: space-between; }
              .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="title">TAX INVOICE</h1>
              <p class="subtitle">Canteen Rush - Campus Dining</p>
            </div>
            <div class="details">
              <div>
                <strong>Order ID:</strong> ${order.id}<br>
                <strong>Date:</strong> ${order.date}<br>
                <strong>Status:</strong> ${order.status?.toUpperCase() || 'UNKNOWN'}
              </div>
              <div style="text-align: right">
                <strong>Vendor:</strong> ${canteen?.name || 'Campus Canteen'}<br>
                <strong>Payment:</strong> Smart Wallet
              </div>
            </div>
            <h3>Order Summary</h3>
            <div class="row" style="font-weight: bold; background: #f8fafc; padding: 12px 10px;">
              <span>Items Purchased</span>
              <span>Amount</span>
            </div>
            <div class="row" style="padding: 12px 10px;">
              <span>Total Items: ${order.items}</span>
              <span>₹${order.amount}</span>
            </div>
            <div class="total">
              <span>Total Paid</span>
              <span>₹${order.amount}</span>
            </div>
            <div class="footer">
              This is a computer-generated invoice. No signature is required.<br>
              Thank you for using Canteen Rush!
            </div>
          </body>
        </html>
      `);
      doc.close();
      
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 500);
      }, 250);
    }
  };

  const handleReorder = (orderId: string) => {
    reorder(orderId);
    toast.success('Items loaded into cart!', {
      icon: '🛒',
      style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
    });
    navigate('/cart');
  };

  return (
    <div className={`min-h-full pb-24 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Header */}
      <div className={`px-5 pt-12 pb-6 sticky top-0 z-20 shadow-sm border-b transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <h2 className="font-black text-2xl tracking-tight">Your Order History</h2>
        <p className="text-xs text-slate-400 mt-1 font-bold">Track and quick-reorder your previous campus meals</p>
      </div>

      <div className="px-5 pt-6">
        {pastOrders.length === 0 ? (
          <div className="text-center mt-20">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 ${
              darkMode ? 'bg-slate-900 text-slate-600' : 'bg-slate-100 text-slate-400'
            }`}>
              <ReceiptText size={40} />
            </div>
            <p className="font-black text-lg">No orders yet</p>
            <p className="text-sm text-slate-500 mt-1 mb-8">Your history will appear here once you order.</p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-christ text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              Browse Canteens
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pastOrders.map((order, i) => {
              const isCancelled = order.status === 'cancelled';
              return (
                <div 
                  key={i} 
                  className={`relative mb-6 rounded-2xl border ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } flex flex-col`}
                >
                  {/* Top Section */}
                  <div className="p-5 flex justify-between items-start">
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                        darkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>{order.date}</p>
                      <h3 className="font-black text-xl tracking-tight">{order.id}</h3>
                    </div>
                    {isCancelled ? (
                      <div className="flex items-center gap-1 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-red-500/20">
                        <XCircle size={12} /> Cancelled
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-green-500/20">
                        <CheckCircle2 size={12} /> Delivered
                      </div>
                    )}
                  </div>

                  {/* Cutout Divider */}
                  <div className="relative h-6 flex items-center justify-center overflow-hidden">
                    <div className={`absolute -left-3 w-6 h-6 rounded-full border-r ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
                    <div className={`w-full border-t-2 border-dashed ${darkMode ? 'border-slate-800' : 'border-slate-200'}`} />
                    <div className={`absolute -right-3 w-6 h-6 rounded-full border-l ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
                  </div>

                  {/* Middle Section (Financials) */}
                  <div className="px-5 py-2 flex justify-between items-end">
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-wider mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Order Summary
                      </p>
                      <p className={`font-bold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {order.items} {order.items === 1 ? 'Item' : 'Items'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-black uppercase tracking-wider mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Total Paid
                      </p>
                      <p className="font-black text-2xl text-amber-500 leading-none">
                        ₹{order.amount}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Section (Actions) */}
                  <div className={`px-5 py-4 mt-2 border-t flex flex-wrap gap-2 ${darkMode ? 'border-slate-800 bg-slate-850/50 rounded-b-2xl' : 'border-slate-100 bg-slate-50/50 rounded-b-2xl'}`}>
                    <button 
                      onClick={() => navigate(`/track/${order.id}`)} 
                      className={`flex-[0.5] min-w-[30%] py-2.5 rounded-xl text-xs font-black transition-transform active:scale-[0.97] flex justify-center items-center gap-1.5 ${
                        darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-750' : 'bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50'
                      }`}
                    >
                      <ReceiptText size={14} /> Track
                    </button>
                    <button 
                      onClick={() => downloadInvoice(order)} 
                      className={`flex-[0.5] min-w-[30%] py-2.5 rounded-xl text-xs font-black transition-transform active:scale-[0.97] flex justify-center items-center gap-1.5 ${
                        darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-750' : 'bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50'
                      }`}
                    >
                      <Download size={14} /> Invoice
                    </button>
                    {!isCancelled && (
                      <button 
                        onClick={() => handleReorder(order.id)}
                        className="flex-1 min-w-[30%] bg-christ hover:bg-christ/95 text-white py-2.5 rounded-xl text-xs font-black transition-transform active:scale-[0.97] flex justify-center items-center gap-1.5 shadow-md"
                      >
                        <RefreshCw size={14} /> Reorder
                      </button>
                    )}
                    
                    {order.status === 'delivered' && !order.isRated && (
                      <button 
                        onClick={() => setRatingModal({ isOpen: true, orderId: order.id, canteenId: getCanteenIdForOrder(order.itemIds) })}
                        className={`w-full mt-2 py-3 rounded-xl text-xs font-black transition-all flex justify-center items-center gap-1.5 border-2 border-dashed hover:border-solid ${
                          darkMode 
                            ? 'border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white hover:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                            : 'border-amber-400/50 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 shadow-sm'
                        }`}
                      >
                        <Star size={14} /> Rate this order
                      </button>
                    )}
                    {order.isRated && (
                      <div className="w-full mt-2 py-2 text-center text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 rounded-xl">
                        Review Submitted 🌟
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal && ratingModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRatingModal(null)} />
          <div className={`relative w-full max-w-sm p-6 rounded-3xl shadow-2xl animate-scale-in ${darkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <h3 className="text-xl font-black mb-1">Rate your meal</h3>
            <p className={`text-xs font-bold mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>How was the food and service?</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => setRating(star)}
                  className="active:scale-90 transition-transform"
                  aria-label={`Rate ${star} stars`}
                  title={`Rate ${star} stars`}
                >
                  <Star size={36} className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'} />
                </button>
              ))}
            </div>

            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked (optional)"
              className={`w-full p-3 rounded-xl text-sm font-bold border outline-none resize-none h-24 mb-4 ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            />

            <div className="flex gap-3">
              <button onClick={() => setRatingModal(null)} className={`flex-1 py-3 rounded-xl font-black text-sm transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>Cancel</button>
              <button onClick={submitReview} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-black text-sm shadow-md transition-colors">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}