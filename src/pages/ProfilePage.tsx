import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Ticket, ChevronRight, Settings, HelpCircle, Wallet, LogOut, Flame, Sparkles, Coins, X, Gift, Apple } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { 
    walletBalance, 
    rushCoins, 
    streakDays, 
    activePasses, 
    redeemCoins, 
    weeklyNutrients, 
    calorieGoal, 
    setCalorieGoal, 
    darkMode,
    userProfile,
    logout
  } = useStore();
  
  // States
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [goalInput, setGoalInput] = useState(calorieGoal.toString());
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const rewardsCatalog = [
    { id: 'rew-fritter', name: 'Free Pazham Fritter', cost: 100, outlet: 'Christ Bakery' },
    { id: 'rew-lime', name: 'Free Fresh Lime Soda', cost: 150, outlet: "Bird's Park Kiosk" },
    { id: 'rew-coffee', name: 'Free Chilled Cold Coffee', cost: 200, outlet: 'Ivy Hall' }
  ];

  const handleRedeem = (reward: typeof rewardsCatalog[0]) => {
    if (rushCoins < reward.cost) {
      toast.error(`Not enough Rush Coins! You need ${reward.cost - rushCoins} more.`, {
        style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
      });
      return;
    }

    const success = redeemCoins(reward.cost);
    if (success) {
      toast.success(`Coupon Redeemed! Present coupon at ${reward.outlet}.`, {
        icon: '🎟️',
        duration: 4000
      });
    } else {
      toast.error('Redemption failed.');
    }
  };

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const kcal = parseInt(goalInput);
    if (isNaN(kcal) || kcal <= 0) {
      toast.error('Please enter a valid calorie number.');
      return;
    }
    setCalorieGoal(kcal);
    setIsEditingGoal(false);
    toast.success(`Weekly intake goal updated to ${kcal} kcal!`, {
      icon: '🥗'
    });
  };

  const caloriePercentage = Math.min(100, Math.round((weeklyNutrients.calories / calorieGoal) * 100));

  return (
    <div className={`animate-fade-in min-h-full pb-24 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-800 via-blue-600 to-indigo-900 px-6 pt-12 pb-20 rounded-b-[40px] relative shadow-[0_10px_40px_rgba(79,70,229,0.3)] overflow-hidden">
        {/* Animated decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-22 h-22 bg-white/20 backdrop-blur-xl rounded-[1.25rem] border border-white/40 flex items-center justify-center shadow-2xl p-1 animate-pop">
             <div className="w-20 h-20 bg-slate-200 rounded-xl overflow-hidden">
                <img src={userProfile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
             </div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md mb-1.5">
              {userProfile.name}
            </h2>
            <div className="flex flex-col gap-1.5">
              <span className="text-amber-300 text-[10px] font-black tracking-widest uppercase bg-black/20 backdrop-blur-sm w-max px-3 py-1 rounded-md border border-white/10 shadow-sm">
                Reg: {userProfile.regNo}
              </span>
              <span className="text-blue-100 text-[11px] font-bold drop-shadow-sm">
                B.Tech Computer Science • 2026
              </span>
              <span className="text-blue-100/70 text-[10px] font-bold tracking-wide">
                {userProfile.name.toLowerCase().replace(' ','')}@srmist.edu.in
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Metrics Panel */}
      <div className="px-5 -mt-10 relative z-20">
        
        {/* Wallet Balance Card */}
        <div className={`rounded-[1.5rem] border p-4 flex justify-between items-center mb-6 transition-all duration-300 backdrop-blur-xl ${
          darkMode 
            ? 'bg-slate-900/90 border-slate-700/50 shadow-xl' 
            : 'bg-white/90 border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
               <Wallet size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</span>
              <span className="text-2xl font-black tracking-tight">₹{walletBalance.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/wallet')}
            className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-black px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            + Add
          </button>
        </div>

        {/* Loyalty Streaks & Coins widgets */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setIsRewardsOpen(true)}
            className={`rounded-2xl p-4 border flex items-center gap-3 relative overflow-hidden transition-all duration-350 active:scale-95 text-left w-full shadow-sm group ${
              darkMode 
                ? 'bg-slate-900 border-slate-800 hover:border-amber-500/50' 
                : 'bg-gradient-to-br from-white to-amber-50/50 border-amber-100 hover:border-amber-300'
            }`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform" />
            <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center z-10">
              <Coins className="text-amber-500" size={20} />
            </div>
            <div className="z-10">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Rush Coins</p>
              <h3 className="font-black text-2xl leading-none mt-0.5">{rushCoins}</h3>
            </div>
          </button>

          <div className={`rounded-2xl p-4 border flex items-center gap-3 relative overflow-hidden transition-all duration-350 shadow-sm group ${
            darkMode 
              ? 'bg-slate-900 border-slate-800 hover:border-orange-500/50' 
              : 'bg-gradient-to-br from-white to-orange-50/50 border-orange-100 hover:border-orange-300'
          }`}>
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform" />
            <div className="w-11 h-11 rounded-full bg-orange-500/10 flex items-center justify-center z-10">
              <Flame className="text-orange-500" size={20} />
            </div>
            <div className="z-10">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Day Streak</p>
              <h3 className="font-black text-2xl leading-none mt-0.5">{streakDays}</h3>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
           <div className={`rounded-2xl border p-3 flex flex-col items-center justify-center relative overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500/10 rounded-full blur-md" />
             <span className="block text-[9px] uppercase font-bold text-slate-400 relative z-10">Total Orders</span>
             <span className="block text-xl font-black text-blue-500 mt-1 relative z-10">42</span>
           </div>
           <div className={`rounded-2xl border p-3 flex flex-col items-center justify-center relative overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-500/10 rounded-full blur-md" />
             <span className="block text-[9px] uppercase font-bold text-slate-400 relative z-10">Top Outlet</span>
             <span className="block text-[11px] font-black mt-1.5 text-purple-600 dark:text-purple-400 line-clamp-1 relative z-10">Ivy Hall</span>
           </div>
           <div className={`rounded-2xl border p-3 flex flex-col items-center justify-center relative overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500/10 rounded-full blur-md" />
             <span className="block text-[9px] uppercase font-bold text-slate-400 relative z-10">Total Saved</span>
             <span className="block text-xl font-black text-green-500 mt-1 relative z-10">₹450</span>
           </div>
        </div>

      {/* SMART CAMPUS NUTRITIONAL HEALTH DASHBOARD */}
      <div className={`rounded-3xl border p-5 mb-6 transition-all duration-300 relative overflow-hidden group ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
        
        <div className="flex justify-between items-center mb-4 relative z-10">
          <h3 className="font-black text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Apple size={16} className="text-amber-500 animate-pulse" /> Weekly Nutrition
          </h3>
          {isEditingGoal ? (
            <button 
              onClick={() => setIsEditingGoal(false)}
              className="text-xs font-black text-red-500 uppercase"
            >
              Cancel
            </button>
          ) : (
            <button 
              onClick={() => setIsEditingGoal(true)}
              className="text-xs font-black text-amber-500 hover:text-amber-600 uppercase"
            >
              Set Goal
            </button>
          )}
        </div>

        {/* Goal Editor Form */}
        {isEditingGoal ? (
          <form onSubmit={handleUpdateGoal} className="flex gap-2 mb-4 animate-pop relative z-10">
            <input 
              type="number" 
              aria-label="Calorie Goal"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="2000"
              className={`flex-1 p-2.5 rounded-xl border text-xs font-bold outline-none ${
                darkMode ? 'bg-slate-850 border-slate-850 text-white' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-400'
              }`}
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white font-black text-xs px-5 py-2.5 rounded-xl active:scale-95 shadow-md shadow-indigo-500/20"
            >
              Save
            </button>
          </form>
        ) : (
          <div className="flex gap-5 items-center mb-5 animate-pop relative z-10">
            {/* Circular calorie meter overlay */}
            <div className="relative w-22 h-22 flex-shrink-0 flex items-center justify-center filter drop-shadow-md">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke={darkMode ? '#1e293b' : '#f1f5f9'} strokeWidth="8" fill="transparent" />
                <circle cx="40" cy="40" r="32" stroke="url(#gradient-cal)" strokeWidth="8" fill="transparent" 
                  strokeDasharray={201}
                  strokeDashoffset={201 - (201 * caloriePercentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient-cal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center mt-0.5">
                <span className="font-black text-[15px] leading-none">{caloriePercentage}%</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Calorie Budget</p>
              <h4 className="text-xl font-black leading-snug mt-0.5 text-slate-800 dark:text-white">
                {weeklyNutrients.calories} <span className="text-xs font-bold text-slate-400">/ {calorieGoal} kcal</span>
              </h4>
              <p className="text-[9px] text-slate-500 font-semibold leading-relaxed mt-1.5 w-11/12">
                Keep under budget to maintain healthy dining metrics!
              </p>
            </div>
          </div>
        )}

        {/* Macro nutrients grids */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 relative z-10">
          <div className={`p-3 rounded-2xl flex items-center gap-3 border ${darkMode ? 'bg-slate-850/50 border-slate-800' : 'bg-blue-50/50 border-blue-100/50'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex flex-shrink-0 items-center justify-center">
               <div className="w-3 h-3 rounded-full bg-blue-500" />
            </div>
            <div>
               <p className="text-[9px] text-slate-500 font-black uppercase tracking-wide">Protein</p>
               <h4 className="font-black text-sm mt-0.5 text-blue-600 dark:text-blue-400">{weeklyNutrients.protein}g</h4>
            </div>
          </div>
          <div className={`p-3 rounded-2xl flex items-center gap-3 border ${darkMode ? 'bg-slate-850/50 border-slate-800' : 'bg-orange-50/50 border-orange-100/50'}`}>
             <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex flex-shrink-0 items-center justify-center">
               <div className="w-3 h-3 rounded-full bg-orange-500" />
            </div>
            <div>
               <p className="text-[9px] text-slate-500 font-black uppercase tracking-wide">Carbs</p>
               <h4 className="font-black text-sm mt-0.5 text-orange-600 dark:text-orange-400">{weeklyNutrients.carbs}g</h4>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LINKS SECTION */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div 
          onClick={() => navigate('/passes')}
          className={`p-4 rounded-3xl border flex flex-col justify-center cursor-pointer transition-all active:scale-[0.96] shadow-sm relative overflow-hidden group ${
            darkMode 
              ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' 
              : 'bg-white border-slate-100 hover:border-indigo-300'
          }`}
        >
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md mb-3">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Meal Passes</h4>
            <p className="font-black text-xs text-slate-700 dark:text-slate-200 line-clamp-1">
              {activePasses.length > 0 ? `${activePasses.length} active` : 'Browse passes'}
            </p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/admin')}
          className={`p-4 rounded-3xl border flex flex-col justify-center cursor-pointer transition-all active:scale-[0.96] shadow-sm relative overflow-hidden group ${
            darkMode 
              ? 'bg-slate-900 border-slate-800 hover:border-red-500/50' 
              : 'bg-white border-slate-100 hover:border-red-300'
          }`}
        >
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-md mb-3">
            <span className="text-lg leading-none">🏪</span>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Vendor UI</h4>
            <p className="font-black text-xs text-slate-700 dark:text-slate-200 line-clamp-1">
              Open Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Account Options list */}
      <h3 className={`font-black mb-3 px-2 text-xs uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Account & Settings</h3>
      
      <div className={`rounded-[1.5rem] border overflow-hidden mb-8 transition-colors duration-300 shadow-sm ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100/80 backdrop-blur-md'
      }`}>
        {[
          { label: 'Campus Passes', icon: Ticket, sub: 'View meal subscriptions & passes', onClick: () => navigate('/passes'), color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'App Settings', icon: Settings, sub: 'Toggle preferences and dark theme', onClick: () => navigate('/settings'), color: 'text-slate-500 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800' },
          { label: 'Help & Support', icon: HelpCircle, sub: 'Browse FAQs or contact student desk', onClick: () => navigate('/support'), color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={item.onClick} 
            className={`w-full flex items-center justify-between p-4 border-b last:border-0 text-left active:scale-[0.98] transition-colors ${
              darkMode ? 'border-slate-800/50 hover:bg-slate-850' : 'border-slate-50 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center ${item.color} ${item.bg}`}>
                <item.icon size={22} />
              </div>
              <div className="min-w-0">
                <span className="font-black text-sm block leading-snug">{item.label}</span>
                <span className="text-[10px] text-slate-400 font-bold block truncate mt-0.5">{item.sub}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 flex-shrink-0" />
          </button>
        ))}
      </div>

        {/* Logout button */}
        <button 
          onClick={() => {
            logout();
            toast.success('Logged out successfully!', {
              style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
            });
            navigate('/login');
          }}
          className={`w-full font-black py-4 rounded-2xl shadow-sm flex justify-center items-center gap-2 active:scale-95 transition-transform border ${
            darkMode 
              ? 'bg-red-950/20 text-red-400 border-red-900/30' 
              : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100/50'
          }`}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* LOYALTY REWARDS STORE DRAWER */}
      {isRewardsOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0" onClick={() => setIsRewardsOpen(false)} />
          
          <div className={`w-full max-w-[380px] rounded-3xl p-6 relative z-10 animate-slide-up transition-colors duration-300 ${
            darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-black flex items-center gap-1.5">
                <Gift className="text-amber-500" /> Rush Rewards Shop
              </h3>
              <button 
                onClick={() => setIsRewardsOpen(false)} 
                title="Close rewards shop"
                aria-label="Close rewards shop"
                className={`p-1.5 rounded-full ${
                  darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Loyalty coins banner */}
            <div className={`p-4 rounded-2xl mb-6 flex justify-between items-center ${
              darkMode ? 'bg-slate-850' : 'bg-amber-50/70 border border-amber-100/30'
            }`}>
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Your Balance</p>
                <p className="text-2xl font-black text-amber-500 mt-0.5">{rushCoins} Coins</p>
              </div>
              <Coins size={28} className="text-amber-500" />
            </div>

            <div className="flex flex-col gap-3">
              {rewardsCatalog.map(reward => {
                const canAfford = rushCoins >= reward.cost;
                return (
                  <div 
                    key={reward.id}
                    className={`p-4 rounded-2xl border flex justify-between items-center ${
                      darkMode ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-150'
                    }`}
                  >
                    <div>
                      <h4 className="font-black text-sm">{reward.name}</h4>
                      <p className="text-[9px] text-slate-450 font-bold uppercase mt-0.5">Claim at {reward.outlet}</p>
                      <p className="text-xs font-black text-amber-500 mt-1">{reward.cost} Coins</p>
                    </div>
                    <button
                      onClick={() => handleRedeem(reward)}
                      className={`text-xs font-black px-4 py-2 rounded-xl shadow transition ${
                        canAfford
                          ? 'bg-amber-500 text-white active:scale-95'
                          : 'bg-slate-300 dark:bg-slate-850 text-slate-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      Redeem
                    </button>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[9px] text-slate-500 font-bold text-center mt-5 leading-normal">
              * Earn 10% of your meal totals back as Rush Coins with every order!
            </p>
          </div>
        </div>
      )}

    </div>
  );
}