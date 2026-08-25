import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Search, MapPin, Wallet, Clock, Star, Flame, Sparkles, 
  Plus, AlertCircle, ChevronRight, Zap, Moon, Sun, Check, X
} from 'lucide-react';
import { useStore, getFoodEmoji } from '../store/useStore';
import type { MenuItem } from '../store/useStore';
import SafeImage from '../components/SafeImage';

// Curated Category Filter Pills with icons and colors
const MOOD_CATEGORIES = [
  { id: 'all', label: 'All Items', emoji: '🍽️' },
  { id: 'express', label: '< 5m Express', emoji: '⚡' },
  { id: 'beverages', label: 'Brews & Shakes', emoji: '☕' },
  { id: 'snacks', label: 'Hot Crispy Snacks', emoji: '🥟' },
  { id: 'healthy', label: 'Healthy & Fresh', emoji: '🥗' },
  { id: 'cheesy', label: 'Pizzas & Fast Food', emoji: '🍕' },
  { id: 'desserts', label: 'Sweet Treats', emoji: '🍦' },
];

// Daily Campus Chef Specials & Flash Deals (100% working live items)
const DAILY_SPECIALS = [
  {
    id: 'm8',
    canteenId: 'christ-bakery',
    canteenName: 'Christ Bakery',
    name: 'Iconic Pazham Pori',
    tagline: 'Fresh golden plantain fritters straight out of the kadai!',
    price: 25,
    originalPrice: 35,
    discountBadge: '⚡ 30% OFF',
    prepTime: '2 min',
    image: '/images/food/item_29.jpg',
    type: 'veg' as const,
    category: 'Snacks'
  },
  {
    id: 'm14',
    canteenId: 'michaels',
    canteenName: "Michael's Corner",
    name: 'Signature Chole Bhature',
    tagline: 'Puffed golden bhaturas with rich spiced chickpea curry.',
    price: 110,
    originalPrice: 130,
    discountBadge: '🔥 Chef Special',
    prepTime: '8 min',
    image: '/images/food/chole_bhature.jpg',
    type: 'veg' as const,
    category: 'Meals'
  },
  {
    id: 'm3',
    canteenId: 'ivy-hall',
    canteenName: 'Ivy Hall',
    name: 'Cold Coffee with Cocoa',
    tagline: 'Chilled thick espresso shaken with dark Dutch cocoa dust.',
    price: 50,
    originalPrice: 65,
    discountBadge: '🔥 Bestseller',
    prepTime: '2 min',
    image: '/images/food/item_25.jpg',
    type: 'veg' as const,
    category: 'Beverages'
  },
  {
    id: 'm66',
    canteenId: 'cafe-spice',
    canteenName: 'Cafe Spice',
    name: 'Steaming Idli Vada Combo',
    tagline: 'Fluffy idlis & crispy medu vada with sambar & coconut chutney.',
    price: 60,
    originalPrice: 75,
    discountBadge: '⚡ Breakfast Special',
    prepTime: '4 min',
    image: '/images/food/idli_vada_combo.jpg',
    type: 'veg' as const,
    category: 'Meals'
  },
  {
    id: 'm6',
    canteenId: 'birds-park-kiosk',
    canteenName: 'The Kiosk',
    name: 'Classic Veg Mayo Roll',
    tagline: 'Wok-seared julienne veggies with garlic mayo in flaky paratha.',
    price: 60,
    originalPrice: 75,
    discountBadge: '⚡ Flash Deal',
    prepTime: '3 min',
    image: '/images/savory_rolls.png',
    type: 'veg' as const,
    category: 'Snacks'
  },
  {
    id: 'm10',
    canteenId: 'block-iv',
    canteenName: 'Block IV Court',
    name: 'Paneer Tikka Pizza',
    tagline: 'Woodfired thin crust layered with tandoori paneer & mozzarella.',
    price: 160,
    originalPrice: 190,
    discountBadge: '⭐ Must Try',
    prepTime: '12 min',
    image: '/images/food/item_35.jpg',
    type: 'veg' as const,
    category: 'Fast Food'
  },
  {
    id: 'm12',
    canteenId: 'nandini',
    canteenName: 'Nandini Parlour',
    name: 'Chocolate Fudge Shake',
    tagline: 'Churned with fresh farm milk and decadent chocolate scoop.',
    price: 55,
    originalPrice: 70,
    discountBadge: '🥤 Top Cooler',
    prepTime: '1 min',
    image: '/images/food/item_43.jpg',
    type: 'veg' as const,
    category: 'Beverages'
  }
];

export default function CanteensPage() {
  const navigate = useNavigate();
  const { 
    walletBalance, 
    favorites, 
    addToCart, 
    darkMode, 
    toggleDarkMode,
    canteenCrowd, 
    userProfile, 
    selectedLocation 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const canteensList = useStore(state => state.canteens);

  // Quick 1-Tap Add to Cart with visual feedback
  const handleQuickAdd = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();

    const formattedItem: MenuItem = {
      id: item.id,
      name: item.name,
      description: item.description || item.tagline || '',
      price: item.price,
      prepTime: typeof item.prepTime === 'number' ? item.prepTime : 3,
      type: item.type || 'veg',
      category: item.category || 'Meals',
      image: item.image,
      canteenId: item.canteenId
    };

    addToCart(formattedItem);
    
    // Trigger tick animation
    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 1500);

    toast.success(`Added ${item.name} to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '16px',
        background: darkMode ? '#1e293b' : '#fff',
        color: darkMode ? '#fff' : '#0f172a',
        fontWeight: 'bold',
        fontSize: '13px'
      }
    });
  };

  // Filter canteens and menu items
  const filteredCanteens = useMemo(() => {
    return canteensList.filter(canteen => {
      const matchesSearch = 
        canteen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        canteen.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        canteen.menu.some(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'express') {
        return canteen.menu.some(item => item.prepTime <= 4);
      }
      if (selectedCategory === 'beverages') {
        return canteen.menu.some(item => item.category.toLowerCase().includes('bev') || item.category.toLowerCase().includes('drink'));
      }
      if (selectedCategory === 'snacks') {
        return canteen.menu.some(item => item.category.toLowerCase().includes('snack') || item.category.toLowerCase().includes('starter'));
      }
      if (selectedCategory === 'healthy') {
        return canteen.id === 'fresh-cafe' || canteen.menu.some(item => item.name.toLowerCase().includes('salad') || item.name.toLowerCase().includes('avocado') || item.name.toLowerCase().includes('fruit') || item.name.toLowerCase().includes('quinoa'));
      }
      if (selectedCategory === 'cheesy') {
        return canteen.menu.some(item => item.category.toLowerCase().includes('fast') || item.name.toLowerCase().includes('pizza') || item.name.toLowerCase().includes('burger'));
      }
      if (selectedCategory === 'desserts') {
        return canteen.menu.some(item => item.category.toLowerCase().includes('dessert') || item.category.toLowerCase().includes('sweet') || item.name.toLowerCase().includes('kulfi') || item.name.toLowerCase().includes('brownie'));
      }

      return true;
    });
  }, [canteensList, searchQuery, selectedCategory]);

  // Favorites
  const favoriteItems = useMemo(() => {
    return canteensList
      .flatMap(c => c.menu.map(m => ({ ...m, canteenName: c.name })))
      .filter(item => favorites.includes(item.id))
      .slice(0, 6);
  }, [canteensList, favorites]);

  // Trending Dishes
  const trendingDishes = useMemo(() => {
    return canteensList
      .flatMap(c => c.menu.map(m => ({ ...m, canteenName: c.name })))
      .filter(item => item.tag === 'Trending' || item.tag === 'Bestseller' || item.tag === 'Iconic')
      .slice(0, 6);
  }, [canteensList]);

  // Live crowd status badge
  const getCrowdBadge = (canteenId: string) => {
    const crowd = canteenCrowd[canteenId] || 'low';
    if (crowd === 'moderate') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-500/10 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" /> Moderate Rush
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Fast Moving
      </span>
    );
  };

  return (
    <div className={`min-h-full pb-20 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* TOP APP HEADER */}
      <div className="px-5 pt-7 pb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={userProfile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=Devansh`} 
                alt="Profile Avatar"
                className="w-11 h-11 rounded-2xl bg-amber-400/20 border-2 border-amber-500/40 shadow-sm object-cover" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
            </div>
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Welcome back 👋
              </p>
              <h1 className="text-lg font-black tracking-tight leading-tight">
                {userProfile?.name || 'Devansh Gupta'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => toggleDarkMode()}
              className={`p-2.5 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wallet Quick Badge */}
            <Link
              to="/wallet"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white hover:border-amber-500/50' : 'bg-white border-slate-200 text-slate-800 hover:border-amber-500/50 shadow-sm'
              }`}
            >
              <Wallet size={16} className="text-amber-500" />
              <span className="text-xs font-black">₹{walletBalance}</span>
            </Link>
          </div>
        </div>

        {/* Location Selector Bar */}
        <Link
          to="/location"
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold border mb-4 transition-colors ${
            darkMode ? 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200/70 text-slate-700 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin size={14} className="text-amber-500 shrink-0" />
            <span className="truncate">{selectedLocation || 'Christ University Central Campus'}</span>
          </div>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider shrink-0 flex items-center gap-0.5">
            Change <ChevronRight size={12} />
          </span>
        </Link>

        {/* SEARCH BAR */}
        <div className="relative group">
          <div className={`absolute inset-0 rounded-2xl blur opacity-20 transition-opacity group-hover:opacity-40 ${darkMode ? 'bg-amber-500/30' : 'bg-slate-300'}`} />
          <input
            type="text"
            placeholder="Search canteens, dishes, or cravings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`relative w-full text-sm py-3.5 pl-12 pr-10 rounded-2xl outline-none transition-all font-bold border-2 ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 focus:border-amber-500/60'
                : 'bg-white border-slate-200/80 text-slate-900 placeholder-slate-400 focus:border-amber-500/60 shadow-xs'
            }`}
          />
          <Search className={`absolute left-4 top-[15px] transition-colors ${searchQuery ? 'text-amber-500' : 'text-slate-400'}`} size={18} />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-[15px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* QUICK MOOD CATEGORIES (Horizontal Interactive Filter Pills) */}
      {!searchQuery && (
        <div className="mb-6">
          <div className="flex gap-2.5 overflow-x-auto px-5 pb-2 no-scrollbar items-center">
            {MOOD_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black transition-all shrink-0 active:scale-95 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-md shadow-amber-500/20 scale-105'
                      : darkMode
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <span className="text-sm">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* DAILY CAMPUS SPECIALS & FLASH DEALS CAROUSEL */}
      {!searchQuery && selectedCategory === 'all' && (
        <div className="mb-8">
          <div className="flex justify-between items-center px-5 mb-3">
            <h2 className="text-base font-black tracking-tight flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" />
              <span>Today's Campus Specials</span>
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              ⚡ Live Counter Deals
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto px-5 pb-3 no-scrollbar">
            {DAILY_SPECIALS.map((item, idx) => {
              const isAdded = !!addedItemIds[item.id];
              return (
                <div
                  key={item.id}
                  className={`w-72 shrink-0 rounded-[26px] border p-4 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                    darkMode 
                      ? 'bg-slate-900/90 border-slate-800/80 hover:border-amber-500/40 shadow-lg shadow-black/20' 
                      : 'bg-white border-slate-200/70 hover:border-amber-500/40 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      priority={idx === 0}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackEmoji={getFoodEmoji(item.name)}
                    />
                    
                    {/* Discount & Prep Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                        {item.discountBadge}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/10">
                      <Clock size={10} className="text-amber-400" />
                      <span>{item.prepTime}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`w-3 h-3 border flex items-center justify-center rounded-[3px] ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                      </div>
                      <span className={`text-[10px] font-bold truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.canteenName}
                      </span>
                    </div>

                    <h3 className="font-black text-sm leading-snug line-clamp-1 group-hover:text-amber-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.tagline}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-base text-amber-500">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-semibold">₹{item.originalPrice}</span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(e, item)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all active:scale-90 shadow-sm ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20'
                      }`}
                      aria-label={`Quick add ${item.name}`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} strokeWidth={3} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} strokeWidth={3} />
                          <span>Quick Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ZERO WAIT TIME PRIORITY BANNER */}
      {!searchQuery && (
        <div className="px-5 mb-8">
          <div 
            onClick={() => navigate('/wallet')}
            className="relative overflow-hidden rounded-[24px] bg-slate-950 p-5 flex items-center justify-between shadow-xl ring-1 ring-amber-500/20 cursor-pointer group transition-all duration-300 hover:ring-amber-500/50 hover:shadow-amber-500/10"
          >
            {/* Animated internal shine gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 leading-tight mb-0.5">
                  Zero Wait-Time Pass
                </h3>
                <p className="text-amber-200/70 text-xs font-bold">
                  Tap to pay via wallet & grab food instantly.
                </p>
              </div>
            </div>
            
            <div className="relative z-10 w-9 h-9 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors duration-300">
              <ChevronRight size={18} className="text-amber-400 group-hover:translate-x-0.5 transition-transform" strokeWidth={3} />
            </div>
          </div>
        </div>
      )}

      {/* ORDER AGAIN (FAVORITES SLIDER) */}
      {favoriteItems.length > 0 && !searchQuery && (
        <div className="mb-8">
          <h2 className={`font-bold mb-3 px-5 text-xs uppercase tracking-wider flex items-center gap-1.5 ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <Flame size={14} className="text-amber-500 animate-pulse" /> Order Again (Quick Tap)
          </h2>

          <div className="flex gap-3.5 overflow-x-auto px-5 pb-3 no-scrollbar">
            {favoriteItems.map(item => (
              <div
                key={item.id}
                className={`w-36 shrink-0 p-3 rounded-2xl border transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/70 shadow-xs'
                } flex flex-col justify-between`}
              >
                <div className="relative w-full h-20 rounded-xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800">
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    fallbackEmoji={getFoodEmoji(item.name)}
                  />
                </div>
                <h3 className="font-black text-xs line-clamp-1 leading-snug">{item.name}</h3>
                <div className="flex justify-between items-center mt-2 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <span className="font-black text-xs text-amber-500">₹{item.price}</span>
                  <button
                    onClick={(e) => handleQuickAdd(e, item)}
                    className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition active:scale-75 shadow-xs"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus size={12} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRENDING DISHES SLIDER */}
      {!searchQuery && (
        <div className="mb-8">
          <h2 className={`font-bold mb-3 px-5 text-xs uppercase tracking-wider flex items-center gap-1.5 ${
            darkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <Sparkles size={14} className="text-amber-500" /> Trending Across Campus
          </h2>

          <div className="flex gap-3.5 overflow-x-auto px-5 pb-3 no-scrollbar">
            {trendingDishes.map(item => (
              <Link
                key={item.id}
                to={`/canteen/${item.canteenId}`}
                className={`w-60 shrink-0 p-3.5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/70 hover:border-slate-300 shadow-xs'
                } flex gap-3`}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    fallbackEmoji={getFoodEmoji(item.name)}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider leading-none block">
                      ⭐ 98% Liked
                    </span>
                    <h3 className="font-black text-xs truncate mt-0.5 leading-snug">{item.name}</h3>
                    <p className={`text-xs font-semibold truncate ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {item.canteenName}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-black text-xs text-amber-500">₹{item.price}</span>
                    <button
                      onClick={(e) => handleQuickAdd(e, item)}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-0.5 transition active:scale-95 shadow-xs"
                    >
                      ⚡ Add
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CANTEEN OUTLETS LIST */}
      <div className="px-5 mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-black tracking-tight">
              {searchQuery 
                ? `Search Results (${filteredCanteens.length})` 
                : selectedCategory !== 'all'
                  ? `${MOOD_CATEGORIES.find(c => c.id === selectedCategory)?.label} (${filteredCanteens.length})`
                  : 'All Campus Outlets'}
            </h2>
            <p className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Order ahead and bypass the queue
            </p>
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-black text-amber-500 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {filteredCanteens.length > 0 ? (
            filteredCanteens.map((canteen) => (
              <Link
                key={canteen.id}
                to={`/canteen/${canteen.id}`}
                className="block transform transition duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className={`rounded-[28px] border overflow-hidden relative group transition-all duration-300 shadow-xs hover:shadow-lg ${
                  darkMode ? 'bg-slate-900 border-slate-800/80 hover:border-slate-700' : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}>
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    <SafeImage
                      src={canteen.image}
                      alt={canteen.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      fallbackEmoji="🏫"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Wait Time Badge */}
                    <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md border border-white/10 text-white">
                      <Clock size={12} className="text-amber-400" />
                      <span className="text-[10px] font-black uppercase tracking-wider">{canteen.waitTime}</span>
                    </div>

                    {/* Live Crowd Status Badge */}
                    <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md p-1 rounded-full shadow-md border border-white/10">
                      {getCrowdBadge(canteen.id)}
                    </div>
                  </div>

                  <div className="p-4 relative z-10">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-black text-base leading-snug group-hover:text-amber-500 transition-colors">
                        {canteen.name}
                      </h3>
                      <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-xl font-black text-xs border ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        <span>{canteen.rating?.toFixed(1) || '4.8'}</span>
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                    <p className={`text-xs font-semibold leading-relaxed line-clamp-1 ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {canteen.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-14 flex flex-col items-center">
              <AlertCircle size={36} className="text-slate-400 mb-2 animate-bounce" />
              <p className="text-slate-400 font-bold text-sm">No campus outlets found</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-xs font-black text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
