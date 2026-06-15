import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Award, ChevronRight, Settings, HelpCircle, Wallet, LogOut, Flame, Sparkles, Coins, X, Gift, Apple } from 'lucide-react';
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
      <div className="bg-gradient-to-br from-christ to-blue-950 px-5 pt-12 pb-24 rounded-b-[40px] relative shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-xl p-1 animate-pop">
             <div className="w-full h-full bg-slate-200 rounded-xl overflow-hidden">
                <img src={userProfile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
             </div>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {userProfile.name}
            </h2>
            <div className="flex flex-col gap-0.5 mt-1">
              <span className="text-amber-400 text-[10px] font-black tracking-widest uppercase bg-white/10 w-max px-2.5 py-1 rounded-md">Reg: {userProfile.regNo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Metrics Panel */}
      <div className="px-5 -mt-14 relative z-20">
        
        {/* Wallet Balance Card */}
        <div className={`rounded-3xl border p-5 flex justify-between items-center mb-6 transition-all duration-300 ${
          darkMode 
            ? 'bg-slate-900 border-slate-800 shadow-xl' 
            : 'bg-white border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
        }`}>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Wallet size={13} className="text-amber-500" /> Wallet Balance
            </span>
            <span className="text-3xl font-black">₹{walletBalance.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => navigate('/wallet')}
            className="bg-christ text-white hover:bg-christ/95 text-xs font-black px-5 py-3.5 rounded-xl shadow-md active:scale-95 transition-transform"
          >
            + Add Money
          </button>
        </div>

        {/* Loyalty Streaks & Coins widgets */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setIsRewardsOpen(true)}
            className={`rounded-3xl p-5 border flex flex-col items-center text-center relative overflow-hidden transition-all duration-350 active:scale-95 text-left w-full ${
              darkMode 
                ? 'bg-slate-900 border-slate-800' 
                : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 shadow-sm'
            }`}
          >
            <Coins className="text-amber-500 mb-2 animate-bounce" size={26} />
            <h3 className="font-black text-2.5xl leading-none">{rushCoins}</h3>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-2.5">Rush Coins Store</p>
          </button>

          <div className={`rounded-3xl p-5 border flex flex-col items-center text-center relative overflow-hidden transition-all duration-350 ${
            darkMode 
              ? 'bg-slate-900 border-slate-800' 
              : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100 shadow-sm'
          }`}>
            <Flame className="text-orange-500 mb-2 animate-pulse" size={26} />
            <h3 className="font-black text-2.5xl leading-none">{streakDays} Days</h3>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-2.5">Order streak</p>
          </div>
        </div>

        {/* SMART CAMPUS NUTRITIONAL HEALTH DASHBOARD */}
        <div className={`rounded-3xl border p-5 mb-6 transition-all duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Apple size={16} className="text-amber-500" /> Weekly Nutrition Intake
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
            <form onSubmit={handleUpdateGoal} className="flex gap-2 mb-4 animate-pop">
              <input 
                type="number" 
                aria-label="Calorie Goal"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="2000"
                className={`flex-1 p-2.5 rounded-xl border text-xs font-bold outline-none ${
                  darkMode ? 'bg-slate-850 border-slate-850 text-white' : 'bg-slate-50 border-slate-250 text-slate-850'
                }`}
              />
              <button 
                type="submit"
                className="bg-christ dark:bg-amber-500 text-white font-black text-xs px-4 py-2.5 rounded-xl active:scale-95"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex gap-5 items-center mb-4 animate-pop">
              {/* Circular calorie meter overlay */}
              <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke={darkMode ? '#1e293b' : '#f1f5f9'} strokeWidth="6" fill="transparent" />
                  <circle cx="40" cy="40" r="32" stroke="#f59e0b" strokeWidth="6" fill="transparent" 
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * caloriePercentage) / 100}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                  <span className="font-black text-sm leading-none">{caloriePercentage}%</span>
                  <span className="text-[7px] text-slate-500 font-bold uppercase mt-0.5">Met</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Weekly Calorie Budget</p>
                <h4 className="text-lg font-black leading-snug mt-0.5">
                  {weeklyNutrients.calories} <span className="text-xs font-bold text-slate-400">/ {calorieGoal} kcal</span>
                </h4>
                <p className="text-[9px] text-slate-500 font-semibold leading-relaxed mt-1">
                  Keep under budget to maintain healthy dining metrics!
                </p>
              </div>
            </div>
          )}

          {/* Macro nutrients grids */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
            <div className={`p-3 rounded-2xl text-center border ${darkMode ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-150'}`}>
              <p className="text-[9px] text-slate-500 font-black uppercase">Weekly Protein</p>
              <h4 className="font-black text-base mt-0.5 text-blue-500">{weeklyNutrients.protein}g</h4>
            </div>
            <div className={`p-3 rounded-2xl text-center border ${darkMode ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-150'}`}>
              <p className="text-[9px] text-slate-500 font-black uppercase">Weekly Carbs</p>
              <h4 className="font-black text-base mt-0.5 text-orange-500">{weeklyNutrients.carbs}g</h4>
            </div>
          </div>

        </div>

        {/* MEAL SUBSCRIPTIONS ROUTE LINKER */}
        <div 
          onClick={() => navigate('/passes')}
          className={`p-4 rounded-3xl border mb-6 flex justify-between items-center cursor-pointer transition-all active:scale-[0.98] ${
            darkMode 
              ? 'bg-gradient-to-r from-slate-900 to-slate-850 border-slate-800 hover:border-amber-500/30' 
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Meal Subscriptions</h4>
              <p className="font-black text-sm mt-0.5">
                {activePasses.length > 0 ? `🎟️ ${activePasses.length} active passes running` : '🎟️ Browse student lunch passes'}
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </div>

        {/* VENDOR PORTAL ROUTE LINKER */}
        <div 
          onClick={() => navigate('/admin')}
          className={`p-4 rounded-3xl border mb-6 flex justify-between items-center cursor-pointer transition-all active:scale-[0.98] ${
            darkMode 
              ? 'bg-gradient-to-r from-red-900/30 to-slate-900 border-red-900 hover:border-red-500' 
              : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-100 hover:border-red-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow">
              <span className="text-xl">🏪</span>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-red-500">Vendor Access</h4>
              <p className="font-black text-sm mt-0.5">
                👨‍🍳 Open Vendor Dashboard
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-red-400" />
        </div>

        {/* Account Options list */}
        <h3 className={`font-bold mb-3 px-1 text-xs uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Account Options</h3>
        
        <div className={`rounded-3xl border overflow-hidden mb-8 transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          {[
            { label: 'Payment Methods', icon: Award, sub: 'Manage saved credit & debit cards', onClick: () => navigate('/payments') },
            { label: 'App Settings', icon: Settings, sub: 'Toggle preferences and dark theme', onClick: () => navigate('/settings') },
            { label: 'Help & Support', icon: HelpCircle, sub: 'Browse FAQs or contact student desk', onClick: () => navigate('/support') },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={item.onClick} 
              className={`w-full flex items-center justify-between p-4 border-b last:border-0 text-left active:scale-[0.99] transition-all ${
                darkMode ? 'border-slate-850 hover:bg-slate-850' : 'border-slate-50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-slate-500 shadow-inner ${
                  darkMode ? 'bg-slate-800 border border-slate-750' : 'bg-slate-50 border border-slate-100'
                }`}>
                  <item.icon size={20} className="text-amber-500" />
                </div>
                <div className="min-w-0">
                  <span className="font-black text-sm block leading-snug">{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-bold block truncate mt-0.5">{item.sub}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
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