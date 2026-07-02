import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, MapPin, Wallet, Clock, Star, Flame, Sparkles, Plus, AlertCircle, X, ChevronRight } from 'lucide-react';
import { useStore, getFoodEmoji } from '../store/useStore';
import type { MenuItem } from '../store/useStore';
import SafeImage from '../components/SafeImage';

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
  const { walletBalance, favorites, addToCart, darkMode, canteenCrowd, userProfile, selectedLocation } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Story Highlight Overlay State
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [stories, setStories] = useState<typeof storiesList>(storiesList);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Location State
  const canteensList = useStore(state => state.canteens);

  // New Story Form State
  const [newStory, setNewStory] = useState({
    canteenId: 'ivy-hall',
    title: '',
    headline: '',
    description: '',
    imagePreset: '/images/refreshing_drinks.png'
  });


  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
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
        } catch (error) {
          console.error(error);
          toast.error("Failed to process image.");
        } finally {
          setIsProcessingImage(false);
          e.target.value = ''; // Reset input
        }
      };
      img.onerror = () => {
        toast.error("Invalid image file format.");
        setIsProcessingImage(false);
        e.target.value = ''; // Reset input
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
      setIsProcessingImage(false);
      e.target.value = ''; // Reset input
    };
    reader.readAsDataURL(file);
  };

  // Fetch data on load
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('https://canteen-rush-1.onrender.com/api/stories');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setStories(data.map((d: any) => ({
              id: d._id,
              canteenId: d.canteenId,
              title: d.title,
              image: d.image,
              highlightText: d.highlightText,
              headline: d.headline
            })));
            return;
          }
        }
      } catch (err) {
        console.warn('Error fetching API stories. Falling back to mock data.', err);
      }
      setStories(storiesList);
    };

    fetchStories();
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



  const filteredCanteens = canteensList.filter(canteen =>
    canteen.isActive !== false &&
    (canteen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      canteen.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const favoriteItems = canteensList
    .flatMap(c => c.menu || [])
    .filter(item => item && favorites.includes(item.id));

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
      <div className="px-5 pt-8 pb-4 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <Link
            to="/location"
            className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
              <MapPin size={20} className="text-amber-500" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`font-black text-base leading-none tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Christ University</span>
                <ChevronRight size={14} className="text-slate-400" strokeWidth={3} />
              </div>
              <p className={`text-xs font-bold mt-1 tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedLocation || 'Central Campus'}
              </p>
            </div>
          </Link>

          <Link
            to="/wallet"
            className="relative overflow-hidden px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg active:scale-95 transition-all bg-gradient-to-r from-amber-400 to-orange-500"
          >
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-white/20 blur-[2px] rounded-full"></div>
            <div className="relative z-10 flex items-center gap-2">
              <Wallet size={16} className="text-slate-900" strokeWidth={2.5} />
              <span className="text-sm font-black text-slate-900">₹{walletBalance.toFixed(0)}</span>
            </div>
          </Link>
        </div>

        <div className="relative group">
          <div className={`absolute inset-0 rounded-2xl blur opacity-20 transition-opacity group-hover:opacity-40 ${darkMode ? 'bg-amber-500/30' : 'bg-slate-300'}`}></div>
          <input
            type="text"
            placeholder="Search for canteens, dishes, or cravings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`relative w-full text-sm py-4 pl-12 pr-12 rounded-2xl outline-none transition-all font-bold border-2 ${darkMode
              ? 'bg-slate-900/50 border-white/5 text-white placeholder-slate-500 focus:border-amber-500/50 backdrop-blur-xl shadow-inner shadow-black/20'
              : 'bg-white border-transparent text-slate-900 placeholder-slate-400 focus:border-amber-500/50 shadow-sm'
              }`}
          />
          <Search className={`absolute left-4 top-[17px] transition-colors ${searchQuery ? 'text-amber-500' : 'text-slate-400'}`} size={20} strokeWidth={2.5} />
          {/* Stylized Filter Icon Lines on right */}
          <div className="absolute right-5 top-[17px] w-5 h-[18px] flex flex-col gap-1 items-end justify-center opacity-40">
             <div className="w-4 h-[2px] bg-current rounded-full"></div>
             <div className="w-3 h-[2px] bg-current rounded-full"></div>
             <div className="w-2 h-[2px] bg-current rounded-full"></div>
          </div>
        </div>
      </div>

        {/* INSTAGRAM STYLE STORIES HIGHLIGHTS */}
      {!searchQuery && (
        <div className="animate-pop mb-4 mt-2">
          <div className="flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar items-center">
              {/* Add Story Button for verified student */}
              <button
                onClick={() => {
                  setIsUploadOpen(true);
                }}
                className="flex flex-col items-center gap-1.5 focus:outline-none flex-shrink-0"
              >
                <div className="relative w-16 h-16 rounded-full p-[2.5px] bg-slate-200 dark:bg-slate-800/80 border-2 border-dashed border-slate-400 dark:border-slate-600 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition active:scale-95">
                  <Plus size={20} className="text-slate-500 dark:text-slate-450" />
                </div>
                <span className={`text-[10px] font-black tracking-wide truncate max-w-[70px] ${darkMode ? 'text-slate-400' : 'text-slate-500'
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
                  <div className="relative w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-christ via-accent to-christ-light shadow-md hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <SafeImage
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover"
                        fallbackEmoji={getFoodEmoji(story.title)}
                      />
                    </div>
                  </div>
                  <span className={`text-[10px] font-black tracking-wide truncate max-w-[70px] ${darkMode ? 'text-slate-400' : 'text-slate-650'
                    }`}>
                    {story.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      {/* BEAUTIFUL ELEGANT CTA SECTION */}
      {!searchQuery && (
        <div className="px-5 mb-8 mt-4">
          <div className="relative overflow-hidden rounded-[24px] bg-slate-950 p-5 flex items-center justify-between shadow-xl ring-1 ring-amber-500/20 cursor-pointer group transition-all duration-300 hover:ring-amber-500/50 hover:shadow-amber-500/10" onClick={() => navigate('/wallet')}>
            
            {/* Animated internal shine gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)] flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                {/* SVG Lightning Bolt */}
                <svg className="w-6 h-6 group-hover:animate-pulse" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 leading-tight mb-0.5 transition-all">Zero Wait Time</h3>
                <p className="text-amber-200/70 text-xs font-bold">Priority queue. Eat instantly.</p>
              </div>
            </div>
            
            <div className="relative z-10 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors duration-300">
              <ChevronRight size={20} className="text-amber-400 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </div>
            
            {/* Glowing Accents - Strictly Inside */}
            <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-orange-500/20 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-[-50%] left-[-10%] w-32 h-32 bg-amber-500/20 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      )}
      {/* ORDER AGAIN / FAVORITES SHORTCUT SLIDER */}
      {favoriteItems.length > 0 && !searchQuery && (
        <div className="mb-8">
          <h3 className={`font-bold mb-4 px-5 text-sm uppercase tracking-wider flex items-center gap-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
            <Flame size={15} className="text-amber-500 animate-pulse" /> Order Again (Quick Tap)
          </h3>

          <div className="flex gap-4 overflow-x-auto px-5 pb-3 no-scrollbar">
            {favoriteItems.map(item => (
              <div
                key={item.id}
                className={`w-40 flex-shrink-0 p-3 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/60 shadow-sm'
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
          <h3 className={`font-bold mb-4 px-5 text-sm uppercase tracking-wider flex items-center gap-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
            <Sparkles size={15} className="text-amber-500" /> Trending on Campus
          </h3>

          <div className="flex gap-4 overflow-x-auto px-5 pb-3 no-scrollbar">
            {trendingDishes.map(item => (
              <Link
                key={item.id}
                to={`/canteen/${item.canteenId}`}
                className={`w-64 flex-shrink-0 p-4 rounded-[24px] border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/60 hover:border-slate-200 shadow-sm'
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
                className="block transform transition duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className={`rounded-[30px] border overflow-hidden relative group transition-all duration-300 shadow-sm hover:shadow-xl translate-z-0 ${darkMode ? 'glass-panel bg-slate-900/60 border-slate-700/50' : 'bg-white border-slate-200/60'
                  }`}>
                  <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden rounded-t-[30px]">
                    <SafeImage
                      src={canteen.image}
                      alt={canteen.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                  <div className="p-5 relative z-10">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-black text-lg leading-snug group-hover:text-christ dark:group-hover:text-accent transition-colors">{canteen.name}</h3>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl shadow-sm font-black border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        <span className="text-[11px]">{canteen.rating?.toFixed(1) || '4.8'}</span>
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                    <p className={`text-xs font-semibold leading-relaxed line-clamp-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'
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
                if (activeStoryIdx! > 0) {
                  setActiveStoryIdx(activeStoryIdx! - 1);
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
                const targetId = stories[activeStoryIdx!].canteenId;
                setActiveStoryIdx(null);
                navigate(`/canteen/${targetId}`);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-3.5 rounded-2xl shadow-xl flex items-center gap-1 leading-none text-xs"
            >
              Order Delicacy <ChevronRight size={14} />
            </button>

            <button
              onClick={() => {
                if (activeStoryIdx! < stories.length - 1) {
                  setActiveStoryIdx(activeStoryIdx! + 1);
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

          <div className={`w-full max-w-[380px] rounded-3xl p-6 relative z-10 animate-slide-up transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
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
                className={`p-1.5 rounded-full ${darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'
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
                // Mock API call to create story
                const token = localStorage.getItem('canteen_rush_token');
                const res = await fetch('https://canteen-rush-1.onrender.com/api/stories', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error('API failed');
              } catch (err) {
                console.error("API story post failed, showing locally.", err);
                setStories(prev => [{ id: Math.random().toString(), ...payload } as unknown as typeof storiesList[0], ...prev]);
              } finally {
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
                setIsUploading(false);
              }
            }} className="space-y-4">

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Canteen Outlet</label>
                <select
                  value={newStory.canteenId}
                  onChange={(e) => setNewStory(prev => ({ ...prev, canteenId: e.target.value }))}
                  aria-label="Select Canteen Outlet"
                  className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${darkMode ? 'bg-slate-850 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-850'
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
                    className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-850 focus:border-christ'
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
                    className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-850 focus:border-christ'
                      }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Select Story Cover Graphic</label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-5 mb-2 relative z-50">
                    <label htmlFor="story-file-upload" className="block w-full text-center text-sm font-black bg-amber-500 text-white p-3 rounded-xl cursor-pointer hover:bg-amber-600 shadow-md transition-all active:scale-95">
                      📸 Browse Media Gallery
                    </label>
                    <input 
                      id="story-file-upload"
                      type="file" 
                      accept="image/*, image/jpeg, image/png, image/webp" 
                      className="hidden"
                      onChange={handleImageUpload} 
                    />
                  </div>
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
                        className={`p-0.5 rounded-xl border-2 transition-all relative overflow-hidden h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-850 ${isSelected ? 'border-accent scale-105' : 'border-transparent'
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
                  className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-all ${darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-850 focus:border-christ'
                    }`}
                />
              </div>

              <button
                type="submit"
                disabled={isUploading || isProcessingImage}
                className={`w-full bg-accent text-white font-black text-xs py-3.5 rounded-xl hover:opacity-90 shadow-lg shadow-accent/20 active:scale-95 transition-all mt-2 ${(isUploading || isProcessingImage) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isProcessingImage ? 'Processing Image...' : isUploading ? 'Posting...' : 'Post Story'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
