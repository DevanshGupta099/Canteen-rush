import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Flame, Coffee, Pizza, Croissant, ArrowRight } from 'lucide-react';
import { canteensData, useStore, getFoodEmoji } from '../store/useStore';
import SafeImage from '../components/SafeImage';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
  const allItems = canteensData.flatMap(canteen => 
    canteen.menu.map(item => ({
      ...item,
      canteenId: canteen.id,
      canteenName: canteen.name
    }))
  );

  const toggleCategory = (catName: string) => {
    if (selectedCategory === catName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(catName);
    }
  };

  const filteredItems = allItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.canteenName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory) {
      if (selectedCategory === 'Spicy') {
        return item.description.toLowerCase().includes('spicy') || item.tag?.toLowerCase() === 'famous' || item.name.toLowerCase().includes('chilli');
      }
      if (selectedCategory === 'Drinks') {
        return item.category === 'Beverages';
      }
      if (selectedCategory === 'Meals') {
        return item.category === 'Meals' || item.category === 'Fast Food' || item.category === 'Starters';
      }
      if (selectedCategory === 'Snacks') {
        return item.category === 'Snacks';
      }
    }
    return true;
  });

  return (
    <div className={`animate-fade-in min-h-full px-5 pt-8 pb-24 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      <h2 className="text-3xl font-black tracking-tight mb-2">Explore Campus Food</h2>
      
      {/* Dynamic Weather Banner */}
      <div className={`mb-6 p-3 rounded-xl border flex items-center gap-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-blue-50 border-blue-100 text-blue-900'}`}>
        <span className="text-xl animate-pulse">⛅</span>
        <p className="font-bold text-sm">{weatherMsg}</p>
      </div>
      
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

      {/* Categories */}
      <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-400">Quick Categories</h3>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { name: 'Spicy', icon: Flame, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' },
          { name: 'Drinks', icon: Coffee, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
          { name: 'Meals', icon: Pizza, color: 'text-green-500 bg-green-50 dark:bg-green-950/30' },
          { name: 'Snacks', icon: Croissant, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' }
        ].map(cat => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button 
              key={cat.name} 
              onClick={() => toggleCategory(cat.name)}
              className="flex flex-col items-center gap-2 group focus:outline-none"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-350 active:scale-95 ${
                isSelected 
                  ? 'ring-4 ring-amber-500/40 bg-amber-500 text-white' 
                  : cat.color
              }`}>
                <cat.icon size={24} className={`transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
              </div>
              <span className={`text-xs font-black transition-colors ${
                isSelected 
                  ? 'text-amber-500' 
                  : (darkMode ? 'text-slate-400' : 'text-slate-600')
              }`}>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Results Title */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
          {searchQuery || selectedCategory ? `Results (${filteredItems.length})` : 'Trending Today'}
        </h3>
        {(searchQuery || selectedCategory) && (
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            className="text-xs font-black text-amber-500 hover:text-amber-600"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/canteen/${item.canteenId}`)}
              className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-md cursor-pointer flex items-center gap-4 group active:scale-[0.98] ${
                darkMode 
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
              } ${item.isSoldOut ? 'opacity-60 grayscale-[0.5]' : ''}`}
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800 border dark:border-slate-800 flex-shrink-0">
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
          ))
        ) : (
          <div className="text-center py-12 flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-slate-900 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
              <Pizza size={28} />
            </div>
            <p className="font-bold">No dishes or canteens found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[240px]">We couldn't find anything matching your query. Try searching for 'coffee' or 'biryani'.</p>
          </div>
        )}
      </div>
    </div>
  );
}