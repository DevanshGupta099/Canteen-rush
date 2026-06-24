import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Clock, Star, Heart, Info, Sparkles } from 'lucide-react';
import { useStore, getFoodEmoji, canteensData } from '../store/useStore';
import type { MenuItem, Canteen } from '../store/useStore';
import SafeImage from '../components/SafeImage';

export default function MenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, favorites, addToCart, decreaseQuantity, toggleFavorite, outOfStockItems, darkMode } = useStore();
  const [filter, setFilter] = useState('All');
  const [dietFilter, setDietFilter] = useState<'All' | 'Veg' | 'Non-Veg' | 'Vegan' | 'Jain' | 'Protein'>('All');
  const [isScrolled, setIsScrolled] = useState(false);

  const [canteen, setCanteen] = useState<Canteen | null>(null);

  useEffect(() => {
    fetch('/api/canteens')
      .then(async res => {
        const data = await res.json();
        const found = Array.isArray(data) ? data.find((c: Canteen) => c.id === id) : null;
        if (found) setCanteen(found);
        else throw new Error('Not found in API');
      })
      .catch(() => {
        const found = canteensData.find((c: Canteen) => c.id === id);
        setCanteen(found || null);
      });
  }, [id]);

  const getItemQuantity = (itemId: string) => cart.find(c => c.id === itemId)?.quantity || 0;
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAdd = (item: MenuItem) => {
    if (outOfStockItems.includes(item.id) || item.isSoldOut) {
      toast.error(`${item.name} is currently sold out!`, {
        icon: '🚫'
      });
      return;
    }
    addToCart(item);
    toast.success(`Added ${item.name} to cart`, {
      style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
    });
  };

  const getDishLikes = (itemId: string) => {
    const number = parseInt(itemId.replace(/\D/g, '')) || 5;
    const likes = 90 + (number % 10);
    return `${likes}% liked this`;
  };

  const isJainFriendly = (itemId: string) => {
    return ['m3', 'm7', 'm8', 'm12', 'm13', 'm16'].includes(itemId);
  };

  const isHighProtein = (itemId: string) => {
    return ['m2', 'm4', 'm5', 'm9', 'm11', 'm14', 'm15'].includes(itemId);
  };

  const isVeganFriendly = (itemId: string) => {
    return ['m1', 'm6', 'm7', 'm8', 'm16'].includes(itemId);
  };

  const filters = ['All', 'Bestsellers', 'Beverages', 'Snacks', 'Meals'];

  const filteredMenu = canteen ? canteen.menu.filter((item: MenuItem) => {
    let matchesCategory = true;
    if (filter !== 'All') {
      if (filter === 'Bestsellers') {
        matchesCategory = item.tag === 'Bestseller' || item.tag === 'Must Try' || item.tag === 'Iconic' || item.tag === 'Trending';
      } else {
        matchesCategory = item.category === filter;
      }
    }

    if (!matchesCategory) return false;

    if (dietFilter === 'Veg') return item.type === 'veg';
    if (dietFilter === 'Non-Veg') return item.type === 'non-veg';
    if (dietFilter === 'Vegan') return isVeganFriendly(item.id);
    if (dietFilter === 'Jain') return isJainFriendly(item.id);
    if (dietFilter === 'Protein') return isHighProtein(item.id);

    return true;
  }) : [];

  useEffect(() => {
    const handleScroll = () => {
      const mainEl = document.querySelector('main');
      if (mainEl) {
        setIsScrolled(mainEl.scrollTop > 50);
      }
    };
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  if (!canteen) {
    return (
      <div className="p-8 text-center text-slate-550 dark:text-slate-400">
        <p className="font-bold">Canteen outlet not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-full pb-36 relative transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
      }`}>

      {/* Sticky Top Header Bar */}
      <div className={`sticky top-0 z-40 transition-all duration-300 flex items-center justify-between px-4 py-3 h-16 ${isScrolled
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-850 shadow-sm text-slate-800 dark:text-white'
        : 'bg-transparent text-white'
        }`}>
        <div className="flex items-center gap-3">
          <button
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isScrolled
              ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-205 text-slate-700 dark:text-slate-200'
              : 'bg-black/25 backdrop-blur-md hover:bg-black/35 text-white border border-white/20'
              }`}
          >
            <ArrowLeft size={20} />
          </button>
          <span className={`font-black text-base transition-all duration-300 ${isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}>
            {canteen.name}
          </span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-48 w-full -mt-16 z-10 flex items-center justify-center bg-gradient-to-br from-christ to-blue-950 overflow-hidden">
        <SafeImage
          src={canteen.image}
          alt={canteen.name}
          className="w-full h-full object-cover absolute inset-0 z-0 animate-fade-in"
          fallbackEmoji="🏫"
        />
        <div className="absolute inset-0 bg-black/45 z-10" />
      </div>

      {/* Canteen Details Card */}
      <div className={`relative z-20 rounded-t-3xl p-5 shadow-[0_-15px_30px_rgba(0,0,0,0.03)] -mt-8 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-b border-slate-850' : 'bg-white border-b border-slate-100'
        }`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-black text-2xl tracking-tight leading-tight">{canteen.name}</h2>
            <p className={`text-xs mt-1 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{canteen.description}</p>
          </div>
          {/* Star Rating Badge */}
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl shadow-sm font-black border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs">{canteen.rating?.toFixed(1) || '4.8'}</span>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-150/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Wait Time</p>
              <p className="text-xs font-black">{canteen.waitTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hygiene</p>
              <p className="text-xs font-black">4.9/5 Rated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section (Sticky below Top Header) */}
      <div className={`sticky top-16 z-30 p-4 border-b transition-all duration-300 ${darkMode
        ? 'bg-slate-950/95 border-slate-850 shadow-md'
        : 'bg-white/95 border-slate-150 shadow-sm shadow-slate-100/50'
        } backdrop-blur-md`}>
        <div className="flex gap-2 overflow-x-auto pb-2.5 no-scrollbar">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black transition-all ${filter === f
                ? 'bg-christ text-white shadow-md'
                : (darkMode ? 'bg-slate-850 border border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100')
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pt-2.5 no-scrollbar border-t border-dashed border-slate-250 dark:border-slate-850">
          {([
            { id: 'Veg', label: 'Veg 🟢', color: 'border-green-600/30 text-green-600 bg-green-500/5' },
            { id: 'Non-Veg', label: 'Non-Veg 🔴', color: 'border-red-500/30 text-red-550 bg-red-500/5' },
            { id: 'Vegan', label: 'Vegan 🌱', color: 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5' },
            { id: 'Jain', label: 'Jain 🟡', color: 'border-amber-500/30 text-amber-600 bg-amber-500/5' },
            { id: 'Protein', label: 'Protein 💪', color: 'border-blue-500/30 text-blue-600 bg-blue-500/5' }
          ] as const).map(d => (
            <button
              key={d.id}
              onClick={() => setDietFilter(d.id === dietFilter ? 'All' : d.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl border text-[10px] font-black tracking-wide uppercase transition-all ${dietFilter === d.id
                ? (darkMode ? 'bg-amber-500 text-black border-amber-500 shadow-md' : 'bg-christ text-white border-christ shadow-md')
                : `bg-transparent ${d.color} opacity-80 hover:opacity-100`
                }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items List */}
      <div className="px-5 py-4">
        <div className="flex flex-col gap-4 pb-20">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item: MenuItem) => {
              const qty = getItemQuantity(item.id);
              const isFav = favorites.includes(item.id);
              const isSoldOut = outOfStockItems.includes(item.id) || item.isSoldOut;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border flex justify-between gap-4 relative overflow-hidden transition-all duration-300 ${isSoldOut
                    ? 'opacity-55'
                    : ''
                    } ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-100 shadow-sm'
                    }`}
                >
                  {isSoldOut && (
                    <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow z-10 animate-pulse">
                      Sold Out
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-4 h-4 border flex items-center justify-center rounded-[4px] ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                      </div>

                      {isJainFriendly(item.id) && <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/15 px-1.5 py-0.5 rounded font-black uppercase">Jain</span>}
                      {isHighProtein(item.id) && <span className="text-[8px] bg-blue-500/10 text-blue-500 border border-blue-500/15 px-1.5 py-0.5 rounded font-black uppercase">Protein</span>}

                      {item.tag && <span className="text-[8px] bg-orange-500/10 text-orange-555 border border-orange-500/15 px-1.5 py-0.5 rounded font-black uppercase">{item.tag}</span>}
                    </div>

                    <h3 className="font-black text-base truncate">{item.name}</h3>
                    <p className={`text-xs mt-1 leading-snug line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.description}</p>

                    <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-slate-400">
                      <span>👍 {getDishLikes(item.id)}</span>
                    </div>

                    <p className="font-black text-amber-500 mt-2 text-base">
                      {item.originalPrice && <span className="text-xs text-slate-400 line-through mr-1.5 font-bold">₹{item.originalPrice}</span>}
                      ₹{item.price}
                    </p>
                  </div>

                  {/* Right Side: Image container */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <div className="w-full h-full rounded-2xl overflow-hidden border dark:border-slate-800 flex items-center justify-center bg-slate-100 dark:bg-slate-800 shadow-sm relative">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover animate-fade-in"
                        fallbackEmoji={getFoodEmoji(item.name)}
                      />

                      <button
                        aria-label="Toggle Favorite"
                        onClick={() => toggleFavorite(item.id)}
                        className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center shadow-sm active:scale-75 transition-transform z-10 ${darkMode ? 'bg-slate-850/90 text-slate-400 hover:bg-slate-750' : 'bg-white/85 text-slate-450 hover:bg-white'
                          }`}
                      >
                        <Heart size={13} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                    </div>

                    {/* Quantity selectors */}
                    <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 shadow-xl border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between w-20 h-8 overflow-hidden z-20 glow-amber">
                      {isSoldOut ? (
                        <button
                          disabled
                          className="w-full h-full text-slate-400 font-black text-[8px] uppercase tracking-wider cursor-not-allowed bg-slate-100 dark:bg-slate-850"
                        >
                          Sold Out
                        </button>
                      ) : qty === 0 ? (
                        <button
                          aria-label="Add item"
                          onClick={() => handleAdd(item)}
                          className="w-full h-full text-christ dark:text-amber-500 font-black text-[10px] hover:bg-slate-50 dark:hover:bg-slate-700 uppercase tracking-wide transition-colors"
                        >
                          ADD
                        </button>
                      ) : (
                        <>
                          <button aria-label="Decrease" onClick={() => decreaseQuantity(item.id)} className="w-7 h-full flex items-center justify-center text-christ dark:text-amber-400 font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-700">-</button>
                          <span className="text-[10px] font-black text-slate-850 dark:text-slate-100">{qty}</span>
                          <button aria-label="Increase" onClick={() => handleAdd(item)} className="w-7 h-full flex items-center justify-center text-christ dark:text-amber-400 font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-700">+</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 flex flex-col items-center">
              <Info className="text-slate-400 mb-2" size={28} />
              <p className="font-bold text-sm">No dishes match active filters</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Try clearing your diet preferences or choosing another category above.</p>
            </div>
          )}
        </div>
      </div>

      {cartTotal > 0 && (
        <div className="fixed bottom-24 left-0 right-0 px-5 z-40 max-w-[414px] mx-auto animate-fade-in">
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-green-600 text-white py-3.5 rounded-2xl shadow-xl shadow-green-600/20 flex justify-between px-5 items-center active:scale-95 transition-transform"
          >
            <div>
              <p className="text-[9px] uppercase font-black text-green-100">{cart.length} ITEMS SELECTED</p>
              <p className="text-lg font-black leading-none mt-0.5">₹{cartTotal}</p>
            </div>
            <span className="font-black text-sm flex items-center gap-1">Checkout <ArrowLeft size={16} className="rotate-180" /></span>
          </button>
        </div>
      )}
    </div>
  );
}