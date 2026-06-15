import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore, getFoodEmoji } from '../store/useStore';
import type { MenuItem } from '../store/useStore';
import { ArrowLeft, Wallet, Info, Users, Plus, Minus, ArrowRight, Clipboard, Sparkles, Check } from 'lucide-react';
import SafeImage from '../components/SafeImage';

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    addToCart, 
    decreaseQuantity, 
    walletBalance, 
    splitBillFriends,
    setSplitBillFriends,
    groupOrderActive,
    groupLink,
    groupMembers,
    toggleGroupOrder,
    joinGroupMember,
    darkMode
  } = useStore();

  const [isSplitting, setIsSplitting] = useState(false);
  const friendsList = [
    { name: 'Rohan', reg: '21BCA405' },
    { name: 'Ananya', reg: '21BCA410' },
    { name: 'Sneha', reg: '21BCA412' }
  ];

  // Mock Upselling Items catalog (suggested complements)
  const upsellingCatalog = [
    { id: 'm3', name: 'Cold Coffee', description: 'Thick cold coffee with cocoa.', price: 50, prepTime: 2, type: 'veg' as const, category: 'Beverages', image: '/images/refreshing_drinks.png' },
    { id: 'm7', name: 'Fresh Lime Soda', description: 'Refreshing sweet salty soda.', price: 30, prepTime: 2, type: 'veg' as const, category: 'Beverages', image: '/images/refreshing_drinks.png' },
    { id: 'm8', name: 'Pazham Pori Fritter', description: 'Golden fried banana fritter.', price: 20, prepTime: 2, type: 'veg' as const, category: 'Snacks', image: '/images/bakery_sweets.png' },
    { id: 'm12', name: 'Chocolate Shake', description: 'Thick creamy chocolate shake.', price: 45, prepTime: 2, type: 'veg' as const, category: 'Beverages', image: '/images/refreshing_drinks.png' }
  ];

  // Filter out items already in cart
  const suggestions = upsellingCatalog.filter(sug => !cart.some(cartItem => cartItem.id === sug.id));

  // Billing Math
  const personalTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Group ordering math
  const groupTotal = groupMembers.reduce((sum, m) => sum + m.price, 0);
  const itemTotal = personalTotal + groupTotal;
  
  const gst = Math.round(itemTotal * 0.05); // 5% GST
  const platformFee = 4;
  const subTotal = itemTotal + gst + platformFee;

  const total = isSplitting && splitBillFriends.length > 0 
    ? Math.round(subTotal / (splitBillFriends.length + 1)) 
    : subTotal;

  const handleCopyLink = () => {
    if (!groupLink) return;
    navigator.clipboard.writeText(groupLink);
    toast.success('Group Order link copied to clipboard!', {
      icon: '🔗',
      style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
    });
  };

  const simulateFriendJoin = () => {
    if (!groupOrderActive) return;
    const names = ['Rohan', 'Ananya', 'Sneha'];
    const items = [
      { name: 'Veg Mayo Roll', price: 60 },
      { name: 'Cold Coffee', price: 50 },
      { name: 'Pazham Pori', price: 20 }
    ];

    const randomIndex = Math.floor(Math.random() * names.length);
    const chosenName = names[randomIndex];
    const chosenItem = items[randomIndex];

    // Check if friend already joined
    if (groupMembers.some(m => m.name === chosenName)) {
      toast('Rohan and Ananya are already in your group order!', { icon: '👥' });
      return;
    }

    joinGroupMember(chosenName, chosenItem.name, chosenItem.price);
    toast.success(`${chosenName} joined your order! Added ${chosenItem.name}.`, {
      icon: '👥',
      style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
    });
  };

  const toggleFriend = (name: string) => {
    if (splitBillFriends.includes(name)) {
      setSplitBillFriends(splitBillFriends.filter(f => f !== name));
    } else {
      setSplitBillFriends([...splitBillFriends, name]);
    }
  };

  const handleQuickAddSug = (item: MenuItem) => {
    addToCart(item);
    toast.success(`Upsold! Added ${item.name} to cart.`, {
      icon: '⚡'
    });
  };

  if (cart.length === 0) return (
    <div className={`min-h-full flex flex-col items-center justify-center py-12 transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50'
    }`}>
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
        darkMode ? 'bg-slate-900 text-slate-655' : 'bg-slate-200 text-slate-400'
      }`}>
        <Users size={40} />
      </div>
      <h2 className="text-xl font-black">Your shopping bag is empty</h2>
      <p className="text-sm text-slate-500 mt-2 mb-6">Explore canteens to add campus delicacies.</p>
      <button onClick={() => navigate('/')} className="bg-christ text-white px-6 py-3.5 rounded-2xl font-black shadow-lg">Browse Restaurants</button>
    </div>
  );

  return (
    <div className={`min-h-full pb-52 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Header */}
      <div className={`px-5 pt-8 pb-4 sticky top-0 z-20 shadow-sm flex justify-between items-center transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-slate-100'
      }`}>
        <div className="flex items-center gap-4">
          <button 
            aria-label="Go back" 
            onClick={() => navigate(-1)} 
            className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
              darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-black text-xl">Review Bag</h2>
        </div>
      </div>

      <div className="px-5 py-6">
        
        {/* SOCIAL COOPERATIVE GROUP ORDERING BOX */}
        <div className={`rounded-3xl border p-5 mb-6 transition-all duration-300 relative overflow-hidden ${
          darkMode ? 'bg-slate-900 border-slate-800 shadow-md' : 'bg-white border-slate-105 shadow-sm'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users size={16} className="text-amber-500" /> Cooperative Group Order
            </h3>
            <button 
              onClick={toggleGroupOrder}
              className={`text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wide transition ${
                groupOrderActive 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                  : 'bg-christ/10 text-christ dark:text-amber-500 dark:bg-amber-500/10 border border-christ/10 dark:border-amber-500/20'
              }`}
            >
              {groupOrderActive ? 'Disable' : 'Enable'}
            </button>
          </div>

          {groupOrderActive ? (
            <div className="animate-pop flex flex-col gap-4">
              <div className={`p-3 rounded-2xl flex items-center justify-between border ${
                darkMode ? 'bg-slate-850 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Share Group link</p>
                  <p className="text-[10px] truncate mt-1 font-bold text-amber-500">{groupLink}</p>
                </div>
                <button 
                  onClick={handleCopyLink}
                  className="w-8 h-8 rounded-xl bg-christ text-white flex items-center justify-center active:scale-75 transition-all shadow"
                  title="Copy share link"
                >
                  <Clipboard size={14} />
                </button>
              </div>

              {/* Simulated member lists */}
              <div className="flex flex-col gap-2">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Group Basket Items</p>
                
                {/* Personal items summarized */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase">You (Active Bag)</span>
                  <span className="font-black">₹{personalTotal}</span>
                </div>
                
                {/* Dynamic classmate entries */}
                {groupMembers.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs animate-pop">
                    <span className="font-bold text-amber-500 uppercase">{m.name} <span className="text-[10px] text-slate-400 lowercase">added {m.item}</span></span>
                    <span className="font-black">₹{m.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={simulateFriendJoin}
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-250 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition active:scale-95 border dark:border-slate-700"
                >
                  👥 Mock Friends Joining Link
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed">
              Order together with your hostel roommates or classmates. Share one basket link and split automatically!
            </p>
          )}
        </div>

        {/* SHOPPING BAG ITEMS REVIEW LIST WITH QUANTITY SELECTORS */}
        <h3 className={`font-bold mb-4 px-1 text-sm uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Review Items ({cart.length})
        </h3>

        <div className="flex flex-col gap-4 mb-6">
          {cart.map(item => (
            <div 
              key={item.id} 
              className={`p-4 rounded-3xl border flex justify-between items-center transition-all ${
                darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800 border dark:border-slate-800 flex-shrink-0">
                  <SafeImage 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                    fallbackEmoji={getFoodEmoji(item.name)}
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="font-black text-sm truncate leading-snug">{item.name}</h4>
                  <p className="text-xs text-amber-500 font-black mt-1">₹{item.price * item.quantity}</p>
                </div>
              </div>

              {/* State-driven quantity adjustment controls */}
              <div className={`flex items-center rounded-xl border p-1 scale-90 ${
                darkMode ? 'bg-slate-850 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <button 
                  aria-label="Decrease quantity"
                  onClick={() => decreaseQuantity(item.id)}
                  className="w-7 h-7 flex items-center justify-center text-sm font-black active:scale-75 transition"
                >
                  <Minus size={12} strokeWidth={3} />
                </button>
                <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                <button 
                  aria-label="Increase quantity"
                  onClick={() => addToCart(item)}
                  className="w-7 h-7 flex items-center justify-center text-sm font-black active:scale-75 transition"
                >
                  <Plus size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SPLIT BILL WIDGET */}
        <div className={`rounded-3xl border p-5 mb-6 transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users size={16} className="text-amber-500" /> Split cost share
            </h3>
            <button 
              onClick={() => {
                setIsSplitting(!isSplitting);
                if (isSplitting) setSplitBillFriends([]);
              }}
              className="text-xs font-black text-amber-500 hover:text-amber-600 uppercase tracking-wide"
            >
              {isSplitting ? 'Disable' : 'Enable'}
            </button>
          </div>

          {isSplitting && (
            <div className="animate-pop">
              <p className="text-[10px] text-slate-500 font-bold mb-3">Select class buddies to split equally:</p>
              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                {friendsList.map(friend => {
                  const isChecked = splitBillFriends.includes(friend.name);
                  return (
                    <button
                      key={friend.name}
                      onClick={() => toggleFriend(friend.name)}
                      className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isChecked
                          ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                          : (darkMode ? 'bg-slate-850 border-slate-800 text-slate-400' : 'bg-slate-55 border-slate-200 text-slate-655')
                      }`}
                    >
                      {friend.name} {isChecked && <Check size={10} strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>

              {splitBillFriends.length > 0 && (
                <div className={`p-3 rounded-2xl text-[10px] font-bold text-center border leading-relaxed ${
                  darkMode ? 'bg-slate-850/60 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-150 text-slate-600'
                }`}>
                  Cost divided {splitBillFriends.length + 1} ways. You pay ₹{total} now. Cost requests will be sent to your buddies.
                </div>
              )}
            </div>
          )}
        </div>

        {/* UPSELLING SLIDER CAROUSEL: PAIRS WELL WITH */}
        {suggestions.length > 0 && (
          <div className="mb-6 animate-pop">
            <h3 className={`font-bold mb-4 px-1 text-sm uppercase tracking-wider flex items-center gap-1.5 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <Sparkles size={15} className="text-amber-500" /> Pairs well with...
            </h3>
            
            <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
              {suggestions.map(sug => (
                <div 
                  key={sug.id}
                  className={`w-56 flex-shrink-0 p-3.5 rounded-[24px] border transition-all ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-105 shadow-sm'
                  } flex flex-col justify-between`}
                >
                  <div className="flex gap-3 items-start">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800 border dark:border-slate-800 flex-shrink-0">
                      <SafeImage 
                        src={sug.image} 
                        alt={sug.name} 
                        className="w-full h-full object-cover" 
                        fallbackEmoji={getFoodEmoji(sug.name)}
                      />
                    </div>
                    
                    <div className="min-w-0">
                      <h4 className="font-black text-xs truncate leading-snug">{sug.name}</h4>
                      <p className={`text-[9px] font-bold truncate mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{sug.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-slate-150 dark:border-slate-800">
                    <span className="font-black text-xs text-amber-500">₹{sug.price}</span>
                    <button 
                      onClick={() => handleQuickAddSug(sug)}
                      className="bg-christ hover:bg-christ/95 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg transition active:scale-95"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BILL SUMMARY TICKET */}
        <div className={`rounded-3xl border p-5 relative overflow-hidden transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <h3 className="font-black text-sm uppercase tracking-wider text-slate-400 mb-4">Summary Breakdown</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>Personal Items</span><span>₹{personalTotal}</span></div>
            {groupOrderActive && groupTotal > 0 && (
              <div className="flex justify-between text-xs font-bold text-amber-500 uppercase animate-pop">
                <span>Cooperative Items ({groupMembers.length}x)</span><span>₹{groupTotal}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>Taxes & GST (5%)</span><span>₹{gst}</span></div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase flex items-center">
              <span className="flex items-center gap-1">Cafeteria Fee <Info size={12} className="text-slate-455"/></span><span>₹{platformFee}</span>
            </div>
            
            {/* Split bill cost divisions */}
            {isSplitting && splitBillFriends.length > 0 && (
              <div className="flex justify-between text-xs font-black text-amber-500 uppercase border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 animate-pop">
                <span>Split Divider ({splitBillFriends.length + 1}x)</span>
                <span>÷ {splitBillFriends.length + 1}</span>
              </div>
            )}
          </div>
          <div className="border-t-2 border-dashed border-slate-200 dark:border-slate-800 pt-4 flex justify-between font-black text-xl">
            <span>To Pay</span><span>₹{total}</span>
          </div>
        </div>

      </div>

      {/* Floating Proced to checkout bar */}
      <div className={`fixed bottom-0 left-0 right-0 max-w-[414px] mx-auto border-t p-5 z-45 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150'
      }`}>
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-slate-800 text-amber-500' : 'bg-slate-100 text-christ'}`}><Wallet size={18} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Wallet Balance</p>
              <p className="text-sm font-black">₹{walletBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full bg-christ dark:bg-amber-500 text-white font-black text-base py-4 rounded-2xl shadow-xl hover:bg-christ/95 dark:hover:bg-amber-600 active:scale-[0.98] transition-all flex justify-center items-center gap-1.5"
        >
          Proceed to Payment <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}