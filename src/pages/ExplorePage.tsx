import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Flame, Coffee, Pizza, Croissant, ArrowRight, ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import { useStore, getFoodEmoji } from '../store/useStore';
import type { MenuItem } from '../store/useStore';
import SafeImage from '../components/SafeImage';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherMsg, setWeatherMsg] = useState('Fetching local weather...');
  const darkMode = useStore(state => state.darkMode);
  const navigate = useNavigate();

  // Public Visible API 1: Weather (Open-Meteo)
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current_weather=true')
      .then(res => res.json())
      .then(data => {
        const code = data.current_weather.weathercode;
        const temp = data.current_weather.temperature;
        if (code <= 3) setWeatherMsg(`Sunny & ${temp}°C. Grab a cold shake! 🥤`);
        else if (code >= 51 && code <= 65) setWeatherMsg(`Rainy & ${temp}°C. Perfect for hot coffee! ☕`);
        else setWeatherMsg(`Cloudy & ${temp}°C. Good day for a hot meal! 🍲`);
      })
      .catch(() => setWeatherMsg('Campus Weather: Always perfect for food! 🌟'));
  }, []);

  // Map all items and append their canteen's ID and name
  const canteensList = useStore(state => state.canteens);
  const allItems = canteensList.flatMap(canteen => 
    canteen.menu.map(item => ({
      ...item,
      canteenId: canteen.id,
      canteenName: canteen.name
    }))
  );

  const filteredItems = allItems.filter(item => {
    if (!searchQuery) return true;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.canteenName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const topPicks = allItems.filter(item => item.tag === 'Bestseller' || item.tag === 'Trending').slice(0, 5);

  const renderResultItem = (item: MenuItem & { canteenId: string, canteenName: string }) => (
    <div 
      key={item.id} 
      onClick={() => navigate(`/canteen/${item.canteenId}`)}
      className={`p-4 rounded-[24px] border transition-all duration-300 hover:shadow-md cursor-pointer flex items-center gap-4 group active:scale-[0.98] ${
        darkMode 
          ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
          : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
      } ${item.isSoldOut ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800 border dark:border-slate-800 flex-shrink-0">
        <SafeImage 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover" 
          fallbackEmoji={getFoodEmoji(item.name)}
        />
        {item.isSoldOut && (
          <div className="absolute top-1 left-1 bg-red-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow z-10">
            SOLD OUT
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded-[3px] ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`} />
          </div>
          <span className={`text-[10px] font-black truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.canteenName}</span>
        </div>
        <h4 className="font-black text-base truncate">{item.name}</h4>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex flex-col items-end leading-none">
          {item.originalPrice && <span className="text-[10px] text-slate-400 line-through mb-0.5">₹{item.originalPrice}</span>}
          <span className="font-black text-lg text-amber-500">₹{item.price}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 mt-1">
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`animate-fade-in min-h-full px-5 pt-8 pb-24 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      {!searchQuery && (
        <>
          <h2 className="text-3xl font-black tracking-tight mb-2">Explore</h2>
          
          {/* Dynamic Weather Banner */}
          <div className={`mb-6 p-3 rounded-2xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-blue-50 border-blue-100 text-blue-900'}`}>
            <span className="text-2xl animate-float">⛅</span>
            <p className="font-bold text-sm leading-tight">{weatherMsg}</p>
          </div>
        </>
      )}
      
      {/* Search Input */}
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Search for 'Biryani', 'Cold Coffee', 'Ivy Hall'..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full py-4 pl-12 pr-4 rounded-2xl outline-none transition-all font-semibold border ${
            darkMode 
              ? 'bg-slate-900 border-slate-800 text-white focus:ring-2 focus:ring-amber-500/20' 
              : 'bg-white border-slate-100 text-slate-800 shadow-sm focus:ring-2 focus:ring-christ/20'
          }`}
        />
        <Search className="absolute left-4 top-4 text-slate-400" size={20} />
      </div>

      {!searchQuery ? (
        <>
          {/* Discover Sections */}
          
          {/* Categories */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-lg">Cravings</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {[
                { name: 'Spicy', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-950/50' },
                { name: 'Drinks', icon: Coffee, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-950/50' },
                { name: 'Meals', icon: Pizza, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-950/50' },
                { name: 'Snacks', icon: Croissant, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-950/50' }
              ].map(cat => (
                <div key={cat.name} onClick={() => setSearchQuery(cat.name)} className="cursor-pointer active:scale-95 transition-transform flex flex-col items-center gap-2 shrink-0">
                  <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center shadow-sm ${cat.bg} ${cat.color} border border-white/5`}>
                    <cat.icon size={28} />
                  </div>
                  <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Collections */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-black text-lg mb-4">Collections</h3>
            <div className="grid grid-cols-2 gap-3">
              <div onClick={() => setSearchQuery('meals')} className="relative h-32 rounded-3xl overflow-hidden cursor-pointer group active:scale-95 transition-transform shadow-sm border dark:border-slate-800">
                <SafeImage src="/images/food/item_2.jpg" fallbackEmoji="🍲" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Meals under 100" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-black text-sm tracking-wide">Under ₹100</h4>
                  <p className="text-[10px] font-bold text-amber-400 flex items-center gap-1 mt-0.5">Wallet friendly <ChevronRight size={10} /></p>
                </div>
              </div>
              <div onClick={() => setSearchQuery('healthy')} className="relative h-32 rounded-3xl overflow-hidden cursor-pointer group active:scale-95 transition-transform shadow-sm border dark:border-slate-800">
                <SafeImage src="/images/food/item_54.jpg" fallbackEmoji="🥗" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Healthy Choices" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-black text-sm tracking-wide">Healthy Fit</h4>
                  <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mt-0.5">Guilt free <ChevronRight size={10} /></p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Picks Horizontal Scroll */}
          <div className="mb-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-amber-500" size={20} />
              <h3 className="font-black text-lg">Top Picks For You</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
              {topPicks.map(item => (
                <div key={item.id} onClick={() => navigate(`/canteen/${item.canteenId}`)} className={`w-52 shrink-0 rounded-[28px] border overflow-hidden transition-transform cursor-pointer active:scale-95 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'}`}>
                  <div className="h-32 w-full bg-slate-100 relative">
                    <SafeImage src={item.image} alt={item.name} className="w-full h-full object-cover" fallbackEmoji={getFoodEmoji(item.name)} />
                    <div className="absolute top-3 left-3 bg-amber-400 text-slate-900 px-2.5 py-1 rounded-xl text-[9px] font-black shadow flex items-center gap-1 uppercase tracking-wider">
                      <TrendingUp size={10} /> HOT
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1.5 opacity-70">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{item.canteenName}</span>
                    </div>
                    <h4 className="font-black text-base truncate">{item.name}</h4>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-black text-lg text-amber-500">₹{item.price}</span>
                      <div className="w-8 h-8 rounded-full bg-christ/10 text-christ flex items-center justify-center">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Dynamic Results Title */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
              Results ({filteredItems.length})
            </h3>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-black text-amber-500 hover:text-amber-600"
            >
              Clear Search
            </button>
          </div>

          {/* Results List */}
          <div className="flex flex-col gap-4">
            {filteredItems.length > 0 ? (
              filteredItems.map(renderResultItem)
            ) : (
              <div className="text-center py-12 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-slate-900 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Search size={28} />
                </div>
                <p className="font-bold">No dishes or canteens found</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[240px]">We couldn't find anything matching your query. Try searching for 'coffee' or 'biryani'.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}