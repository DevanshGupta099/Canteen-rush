import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { ReceiptText, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';

export default function OrdersPage() {
  const { pastOrders, reorder, darkMode } = useStore();
  const navigate = useNavigate();

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
                  className={`p-5 rounded-[28px] border transition-all duration-350 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                  } flex flex-col gap-3`}
                >
                  <div className={`flex justify-between items-center border-b pb-3 transition-colors duration-300 ${
                    darkMode ? 'border-slate-850' : 'border-slate-50'
                  }`}>
                    <div>
                      <h3 className="font-black text-base">{order.id}</h3>
                      <p className={`text-[10px] font-black uppercase tracking-wider mt-0.5 ${
                        darkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>{order.date}</p>
                    </div>
                    {isCancelled ? (
                      <div className="flex items-center gap-1 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-red-500/20">
                        <XCircle size={11} /> Cancelled & Refunded
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-green-500/20">
                        <CheckCircle2 size={11} /> Delivered
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-1">
                    <p className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {order.items} {order.items === 1 ? 'Item' : 'Items'} Purchased
                    </p>
                    <p className="font-black text-lg text-amber-500">₹{order.amount}</p>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => navigate(`/track/${order.id}`)} 
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-transform active:scale-[0.97] ${
                        darkMode 
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-750' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      View Receipt
                    </button>
                    {!isCancelled && (
                      <button 
                        onClick={() => handleReorder(order.id)}
                        className="flex-1 bg-christ hover:bg-christ/95 text-white py-3 rounded-xl text-xs font-black transition-transform active:scale-[0.97] flex justify-center items-center gap-1.5 shadow-md"
                      >
                        <RefreshCw size={11} /> Reorder
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}