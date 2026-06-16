import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, MapPin, Wallet, Clock, Star, Percent, Flame, Sparkles, Plus, AlertCircle, X, ChevronRight, Upload, Map } from 'lucide-react';
import { canteensData, useStore, getFoodEmoji } from '../store/useStore';
import type { MenuItem, Canteen } from '../store/useStore';
import SafeImage from '../components/SafeImage';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const storiesList = [
  {
    canteenId: 'christ-bakery',
    title: 'Pazham Hot! 🥟',
    image: '/images/bakery_sweets.png',
    highlightText: 'Christ Bakery: Fresh batch of Pazham Pori golden banana fritters just fried! Crispy outside, sweet inside. 🍌',
    headline: 'Fresh Fritters Out!'
  },
  {
    canteenId: 'ivy-hall',
    title: 'Cold Brews ☕',
    image: '/images/refreshing_drinks.png',
    highlightText: 'Ivy Hall: Stay fueled through morning classes with classic Cold Coffee topped with thick cocoa powder! ❄️',
    headline: 'Chilled Shakes Ready'
  },
  {
    canteenId: 'birds-park-kiosk',
    title: 'Mayo Rolls 🌯',
    image: '/images/savory_rolls.png',
    highlightText: "The Kiosk: Wok-seared crisp vegetables layered with heavy cream mayo and rolled into flaky parathas! 🤤",
    headline: 'Hot Wraps Served'
  },
  {
    canteenId: 'block-iv',
    title: 'Pizza Fresh 🍕',
    image: '/images/crispy_burger.png',
    highlightText: 'Block IV: Wood-fired crusts layered with smoky tandoori paneer tikka and melted cheddar! 🍕',
    headline: 'Happy Hour Slice'
  }
];

export default function CanteensPage() {
  const navigate = useNavigate();
  const { walletBalance, favorites, addToCart, darkMode, canteenCrowd, userProfile } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Happy Hour Countdown timer (4:00 PM to 5:00 PM)
  const [timeLeft, setTimeLeft] = useState({ mins: 42, secs: 18 });

  // Story Highlight Overlay State
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [stories, setStories] = useState<typeof storiesList>(storiesList);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Location State
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Central Campus');
  const campuses = [
    'Central Campus',
    'Kengeri Campus',
    'Bannerghatta Road (BGR) Campus',
    'Yeshwanthpur Campus',
    'Pune Lavasa Campus',
    'Delhi NCR Campus'
  ];

  const [canteensList, setCanteensList] = useState<Canteen[]>(canteensData);

  // New Story Form State
  const [newStory, setNewStory] = useState({
    canteenId: 'ivy-hall',
    title: '',
    headline: '',
    description: '',
    imagePreset: '/images/refreshing_drinks.png'
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // compress to jpeg to fit in 1MB limit easily
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        setNewStory(prev => ({ ...prev, imagePreset: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Fetch data on load
  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveStories: typeof storiesList = [];
      snapshot.forEach(doc => liveStories.push({ id: doc.id, ...doc.data() } as any));
      if (liveStories.length > 0) {
        setStories(liveStories);
      } else {
        setStories(storiesList);
      }
    }, (error) => {
      console.error('Error fetching stories:', error);
      setStories(storiesList);
    });

    fetch('/api/canteens')
      .then(async res => {
        const data = await res.json();
        if (Array.isArray(data)) setCanteensList(data);
      })
      .catch(() => setCanteensList(canteensData));

    return () => unsubscribe();
  }, []);

  // Story autoplay tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (activeStoryIdx !== null) {
      interval = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            // Auto close story or go to next
            if (activeStoryIdx < stories.length - 1) {
              setActiveStoryIdx(activeStoryIdx + 1);
              return 0;
            } else {
              setActiveStoryIdx(null);
              return 0;
            }
          }
          return prev + 1.25; // advance progress
        });
      }, 35);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeStoryIdx, stories.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        } else if (prev.mins > 0) {
          return { mins: prev.mins - 1, secs: 59 };
        } else {
          return { mins: 59, secs: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredCanteens = canteensList.filter(canteen => 
    canteen.isActive !== false &&
    (canteen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    canteen.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const favoriteItems = canteensList
    .flatMap(c => c.menu)
    .filter(item => favorites.includes(item.id));

  const trendingDishes = canteensList
    .flatMap(c => (c.menu || []).map((m: MenuItem) => ({ ...m, canteenId: c.id, canteenName: c.name })))
    .filter(item => item.tag === 'Bestseller' || item.tag === 'Trending' || item.tag === 'Iconic' || item.tag === 'Must Try');

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    toast.success(`Added ${item.name} to cart!`, {
      icon: '⚡',
      style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
    });
  };

  const getCrowdBadge = (canteenId: string) => {
    const status = canteenCrowd[canteenId] || 'low';
    if (status === 'low') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/10">
          🟢 Low Queue
        </span>
      );
    } else if (status === 'moderate') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black text-yellow-600 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/10">
          🟡 Moderate Wait
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/10">
          🔴 Crowded
        </span>
      );
    }
  };

  return (
    <div className={`animate-fade-in min-h-full w-full overflow-x-hidden pb-24 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Top Header Block (Non-Sticky, scrolls with rest of the page) */}
      <div className="px-5 pt-8 pb-4 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div 
            onClick={() => setIsLocationOpen(true)}
            className="cursor-pointer active:opacity-70 transition-opacity"
          >
            <div className="flex items-center gap-1 text-accent font-black text-sm">
              <MapPin size={16} className="text-accent animate-bounce" /> Christ University
            </div>
            <p className={`text-xs font-bold ml-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {selectedLocation} <ChevronRight size={12} className="inline opacity-50" />
            </p>
          </div>
          
          <Link 
            to="/wallet" 
            className={`border px-4 py-2 rounded-full flex items-center gap-2 shadow-inner active:scale-95 transition-all ${
              darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
             <Wallet size={14} className="text-amber-500" />
             <span className="text-xs font-black">₹{walletBalance.toFixed(2)}</span>
          </Link>
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for canteens or meals..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm py-4 pl-11 pr-4 rounded-2xl outline-none transition-all font-semibold border ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-850 focus:ring-2 focus:ring-amber-500/10' 
                : 'bg-slate-100 border-transparent text-slate-800 focus:bg-white focus:ring-2 focus:ring-christ/10'
            }`}
          />
          <Search className="absolute left-4 top-4 text-slate-400" size={18} />
        </div>
        
        {/* INSTAGRAM STYLE STORIES HIGHLIGHTS */}
        {!searchQuery && (
          <div className="animate-pop -mx-5">
            <div className="flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar items-center">
              {/* Add Story Button for verified student */}
              <button
                onClick={() => {
                  if (!userProfile.regNo) {
                    toast.error('Please verify your Student ID in Settings first!', {
                      icon: '🪪'
                    });
                    return;
                  }
                  setIsUploadOpen(true);
                }}
                className="flex flex-col items-center gap-1.5 focus:outline-none flex-shrink-0"
              >
                <div className="relative w-16 h-16 rounded-full p-[2.5px] bg-slate-200 dark:bg-slate-800/80 border-2 border-dashed border-slate-400 dark:border-slate-600 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition active:scale-95">
                  <Plus size={20} className="text-slate-500 dark:text-slate-450" />
                </div>
                <span className={`text-[10px] font-black tracking-wide truncate max-w-[70px] ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Add Story
                </span>
              </button>

              {stories.map((story, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveStoryIdx(idx);
                    setStoryProgress(0);
                  }}
                  className="flex flex-col items-center gap-1.5 focus:outline-none flex-shrink-0"
                >
                  <div className="relative w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 shadow-md">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <SafeImage 
                        src={story.image} 
                        alt={story.title} 
                        className="w-full h-full object-cover" 
                        fallbackEmoji={getFoodEmoji(story.title)}
                      />
                    </div>
                  </div>
                  <span className={`text-[10px] font-black tracking-wide truncate max-w-[70px] ${
                    darkMode ? 'text-slate-400' : 'text-slate-650'
                  }`}>
                    {story.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
        
        {/* FLASH SALE / HAPPY HOUR */}
        <div className="px-5 mb-8">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden animate-pop">
            <Percent size={80} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-white/25 text-white font-black text-[9px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                  ⚡ Happy Hour Flash Sale
                </span>
                <h3 className="font-black text-2xl mt-1.5 leading-tight animate-pulse">50% OFF BAKERY ITEMS</h3>
                <p className="text-xs text-red-100 font-bold mt-1">Order fresh puffs and fritters at Christ Bakery</p>
              </div>
              
              <div className="bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-center">
                <p className="text-[8px] font-black uppercase text-red-200">Closes in</p>
                <p className="font-black text-xs tabular-nums mt-0.5 text-amber-300">
                  {timeLeft.mins}:{timeLeft.secs < 10 ? '0' : ''}{timeLeft.secs}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/canteen/christ-bakery')}
              className="bg-white hover:bg-slate-50 text-red-600 text-xs font-black px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition-transform mt-4"
            >
              Claim Deal
            </button>
          </div>
        </div>

        {/* ORDER AGAIN / FAVORITES SHORTCUT SLIDER */}
        {favoriteItems.length > 0 && !searchQuery && (
          <div className="mb-8">
            <h3 className={`font-bold mb-4 px-5 text-sm uppercase tracking-wider flex items-center gap-1.5 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <Flame size={15} className="text-amber-500 animate-pulse" /> Order Again (Quick Tap)
            </h3>
            
            <div className="flex gap-4 overflow-x-auto px-5 pb-3 no-scrollbar">
              {favoriteItems.map(item => (
                <div 
                  key={item.id}
                  className={`w-40 flex-shrink-0 p-3 rounded-2xl border transition-all ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/60 shadow-sm'
                  } flex flex-col justify-between`}
                >
                  <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-800">
                    <SafeImage 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      fallbackEmoji={getFoodEmoji(item.name)}
                    />
                  </div>
                  <h4 className="font-black text-xs line-clamp-1 leading-snug">{item.name}</h4>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-dashed border-slate-150 dark:border-slate-800">
                    <span className="font-black text-xs text-amber-500">₹{item.price}</span>
                    <button 
                      onClick={(e) => handleQuickAdd(e, item)}
                      className="p-1.5 bg-christ hover:bg-christ/95 text-white rounded-lg transition active:scale-75 shadow-sm"
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

        {/* TRENDING DISHES ON CAMPUS SLIDER */}
        {!searchQuery && (
          <div className="mb-8 animate-pop">
            <h3 className={`font-bold mb-4 px-5 text-sm uppercase tracking-wider flex items-center gap-1.5 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <Sparkles size={15} className="text-amber-500" /> Trending on Campus
            </h3>
            
            <div className="flex gap-4 overflow-x-auto px-5 pb-3 no-scrollbar">
              {trendingDishes.map(item => (
                <Link 
                  key={item.id} 
                  to={`/canteen/${item.canteenId}`}
                  className={`w-64 flex-shrink-0 p-4 rounded-[24px] border transition-all ${
                    darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/60 hover:border-slate-200 shadow-sm'
                  } flex gap-3`}
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-800 flex-shrink-0">
                    <SafeImage 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      fallbackEmoji={getFoodEmoji(item.name)}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest leading-none">
                        👍 98% LIKED
                      </p>
                      <h4 className="font-black text-xs truncate mt-1 leading-snug">{item.name}</h4>
                      <p className={`text-[9px] font-bold truncate ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {item.canteenName}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-black text-xs text-amber-500">₹{item.price}</span>
                      <button 
                        onClick={(e) => handleQuickAdd(e, item)}
                        className="bg-christ hover:bg-christ/95 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-0.5 transition active:scale-95 shadow-sm"
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

        {/* OUTLETS LIST */}
        <div className="px-5 mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-black tracking-tight">
              {searchQuery ? `Found ${filteredCanteens.length} Outlets` : 'All Campus Outlets'}
            </h2>
          </div>
          
          <div className="flex flex-col gap-6">
            {filteredCanteens.length > 0 ? (
              filteredCanteens.map((canteen) => (
                <Link 
                  key={canteen.id} 
                  to={`/canteen/${canteen.id}`} 
                  className="block transform transition duration-200 active:scale-[0.98]"
                >
                  <div className={`rounded-[30px] border overflow-hidden relative group transition-colors duration-300 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                  }`}>
                    <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <SafeImage 
                        src={canteen.image} 
                        alt={canteen.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        fallbackEmoji="🏫"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                      
                      {/* Wait Time Badge */}
                      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md border border-white/10 text-white">
                        <Clock size={12} className="text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-wider">{canteen.waitTime}</span>
                      </div>

                      {/* Live Crowd Status Dot Badge */}
                      <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md p-1 rounded-full shadow-md border border-white/10">
                        {getCrowdBadge(canteen.id)}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-black text-lg leading-snug">{canteen.name}</h3>
                        <div className="flex items-center gap-1 bg-green-600 px-2.5 py-1 rounded-xl text-white shadow-sm font-black">
                          <span className="text-xs">4.8</span>
                          <Star size={10} className="fill-current text-white" />
                        </div>
                      </div>
                      <p className={`text-xs font-semibold leading-relaxed line-clamp-1 ${
                        darkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>{canteen.description}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 flex flex-col items-center">
                <AlertCircle size={32} className="text-slate-400 mb-2 animate-bounce" />
                <p className="text-slate-400 font-bold">No outlets found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

      {/* FULL SCREEN DYNAMIC STORY OVERLAY HIGHLIGHT */}
      {activeStoryIdx !== null && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col justify-between p-5 animate-fade-in text-white max-w-[414px] mx-auto rounded-3xl">
          <style>{`
            .story-progress-active { width: ${storyProgress}%; }
          `}</style>
          
          {/* Top Story timeline Bar */}
          <div className="w-full flex gap-1 pt-4 relative z-25">
            {stories.map((_, i) => (
              <div key={i} className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-amber-500 transition-all duration-75 ${i < activeStoryIdx ? 'w-full' : (i === activeStoryIdx ? 'story-progress-active' : 'w-0')}`}
                />
              </div>
            ))}
          </div>

          {/* Close & Header info */}
          <div className="w-full flex justify-between items-center mt-3 relative z-25 text-white">
            <h4 className="font-black text-sm uppercase tracking-wider text-amber-400">
              ⚡ {stories[activeStoryIdx].headline}
            </h4>
            <button 
              onClick={() => setActiveStoryIdx(null)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
              aria-label="Close highlights"
            >
              <X size={16} />
            </button>
          </div>

          {/* Core Content Body (Highlight Image & Text card) */}
          <div className="flex-1 flex flex-col justify-center items-center py-10 relative z-20">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 text-slate-800 dark:text-white max-w-[340px] shadow-2xl relative overflow-hidden flex flex-col items-center gap-5 border border-white/5 animate-pop">
              <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-800">
                <SafeImage 
                  src={stories[activeStoryIdx].image} 
                  alt={stories[activeStoryIdx].title} 
                  className="w-full h-full object-cover" 
                  fallbackEmoji={getFoodEmoji(stories[activeStoryIdx].title)}
                />
              </div>

              <div className="text-center">
                <p className="text-xs font-semibold leading-relaxed">
                  {stories[activeStoryIdx].highlightText}
                </p>
              </div>
            </div>
          </div>

          {/* Story Navigation Controls */}
          <div className="w-full flex justify-between items-center pb-6 relative z-25">
            <button
              onClick={() => {
                if (activeStoryIdx > 0) {
                  setActiveStoryIdx(activeStoryIdx - 1);
                  setStoryProgress(0);
                } else {
                  setActiveStoryIdx(null);
                }
              }}
              className="text-slate-400 font-bold text-xs hover:text-white transition"
            >
              Back
            </button>
            
            <button 
              onClick={() => {
                const targetId = stories[activeStoryIdx].canteenId;
                setActiveStoryIdx(null);
                navigate(`/canteen/${targetId}`);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-3.5 rounded-2xl shadow-xl flex items-center gap-1 leading-none text-xs"
            >
              Order Delicacy <ChevronRight size={14} />
            </button>

            <button
              onClick={() => {
                if (activeStoryIdx < stories.length - 1) {
                  setActiveStoryIdx(activeStoryIdx + 1);
                  setStoryProgress(0);
                } else {
                  setActiveStoryIdx(null);
                }
              }}
              className="text-slate-400 font-bold text-xs hover:text-white transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* UPLOAD STORY DRAWER MODAL (Verified Student ID Protected) */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0" onClick={() => setIsUploadOpen(false)} />
          
          <div className={`w-full max-w-[380px] rounded-3xl p-6 relative z-10 animate-slide-up transition-colors duration-300 ${
            darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black flex items-center gap-1.5">
                  ✨ Share Campus Story
                </h3>
                {/* Verified Student ID badge */}
                <span className="inline-flex items-center gap-1 mt-1 bg-green-500/10 text-green-500 text-[8px] font-black px-2 py-0.5 rounded border border-green-500/20 uppercase tracking-wider">
                  🛡️ Verified ID: {userProfile.name} ({userProfile.regNo})
                </span>
              </div>
              <button 
                onClick={() => setIsUploadOpen(false)} 
                title="Close"
                aria-label="Close upload story drawer"
                className={`p-1.5 rounded-full ${
                  darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newStory.title || !newStory.headline || !newStory.description) {
                toast.error('Please fill in all story fields.');
                return;
              }
              
              setIsUploading(true);

              const payload = {
                canteenId: newStory.canteenId,
                title: newStory.title,
                headline: newStory.headline,
                highlightText: `${canteensList.find(c => c.id === newStory.canteenId)?.name}: ${newStory.description} 💡`,
                image: newStory.imagePreset,
                createdAt: new Date().toISOString()
              };

              try {
                await addDoc(collection(db, 'stories'), payload);
                setIsUploadOpen(false);
                setNewStory({
                  canteenId: 'ivy-hall',
                  title: '',
                  headline: '',
                  description: '',
                  imagePreset: '/images/refreshing_drinks.png'
                });
                toast.success('Story posted dynamically to Campus Feed!', {
                  icon: '✨'
                });
              } catch (err) {
                toast.error('Failed to post story.');
                console.error(err);
              } finally {
                setIsUploading(false);
              }
            }} className="space-y-4">
              
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Canteen Outlet</label>
                <select 
                  value={newStory.canteenId}
                  onChange={(e) => setNewStory(prev => ({ ...prev, canteenId: e.target.value }))}
                  aria-label="Select Canteen Outlet"
                  className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${
                    darkMode ? 'bg-slate-850 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-850'
                  }`}
                >
                  {canteensList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Story Bubble Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pazham Hot!"
                    value={newStory.title}
                    onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${
                      darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-850 focus:border-christ'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Overlay Headline</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Fresh Fritters Out!"
                    value={newStory.headline}
                    onChange={(e) => setNewStory(prev => ({ ...prev, headline: e.target.value }))}
                    className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${
                      darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-850 focus:border-christ'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Select Story Cover Graphic</label>
                <div className="grid grid-cols-5 gap-2">
                  <label className="p-0.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <Upload size={18} className="text-slate-400" />
                  </label>
                  {[
                    { path: '/images/bakery_sweets.png', label: 'Bakery' },
                    { path: '/images/refreshing_drinks.png', label: 'Drinks' },
                    { path: '/images/savory_rolls.png', label: 'Rolls' },
                    { path: '/images/crispy_burger.png', label: 'Burger' }
                  ].map(p => {
                    const isSelected = newStory.imagePreset === p.path;
                    return (
                      <button
                        key={p.path}
                        type="button"
                        onClick={() => setNewStory(prev => ({ ...prev, imagePreset: p.path }))}
                        className={`p-0.5 rounded-xl border-2 transition-all relative overflow-hidden h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-850 ${
                          isSelected ? 'border-accent scale-105' : 'border-transparent'
                        }`}
                      >
                        <img src={p.path} alt={p.label} className="w-full h-full object-cover rounded-lg" />
                      </button>
                    );
                  })}
                </div>
                {newStory.imagePreset && newStory.imagePreset.startsWith('data:') && (
                  <div className="mt-2 text-[10px] font-bold text-accent flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Custom gallery image attached
                  </div>
                )}
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Story Highlight Description</label>
                <textarea 
                  rows={2}
                  placeholder="Tell students what is hot and fresh right now at the counter..."
                  value={newStory.description}
                  onChange={(e) => setNewStory(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${
                    darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-850 focus:border-christ'
                  }`}
                />
              </div>

              <button 
                type="submit"
                disabled={isUploading}
                className={`w-full bg-christ dark:bg-accent text-white dark:text-slate-900 font-black text-xs py-3.5 rounded-xl hover:bg-christ/95 dark:hover:bg-accent/90 shadow-md active:scale-95 transition-transform mt-2 ${isUploading ? 'opacity-70' : ''}`}
              >
                {isUploading ? 'Posting to Feed...' : 'Post Story to Campus Feed'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOCATION BOTTOM SHEET */}
      {isLocationOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center px-0 pb-0">
          <div className="absolute inset-0" onClick={() => setIsLocationOpen(false)} />
          
          <div className={`w-full max-w-[414px] rounded-t-[32px] p-6 relative z-10 animate-slide-up transition-colors duration-300 ${
            darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
          }`}>
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-5" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Map size={22} className="text-accent" /> Select Campus
              </h3>
              <button 
                onClick={() => setIsLocationOpen(false)} 
                className={`p-2 rounded-full ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto no-scrollbar pb-6">
              {campuses.map(campus => (
                <button
                  key={campus}
                  onClick={() => {
                    setSelectedLocation(campus);
                    setIsLocationOpen(false);
                    toast.success(`Switched to ${campus}`, { icon: '📍' });
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    selectedLocation === campus 
                      ? 'border-accent bg-accent/5' 
                      : (darkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-100 hover:border-slate-200')
                  }`}
                >
                  <span className={`font-bold text-sm ${selectedLocation === campus ? 'text-accent' : ''}`}>
                    {campus}
                  </span>
                  {selectedLocation === campus && (
                    <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}