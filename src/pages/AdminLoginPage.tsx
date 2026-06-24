import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const darkMode = useStore(state => state.darkMode);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('admin_token', data.token);
        toast.success('Welcome back, Chef!', { icon: '🧑‍🍳' });
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid admin credentials');
      }
    } catch {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 overflow-hidden relative ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] bg-gradient-to-b from-amber-500/20 to-transparent rounded-[100%] blur-3xl pointer-events-none" />

      {/* Header Image Area */}
      <div className="relative h-[45vh] w-full flex-shrink-0 animate-slide-up">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10 dark:from-slate-950 dark:via-slate-950/60" />
        <img 
          src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1000&auto=format&fit=crop" 
          alt="Chef in kitchen" 
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute bottom-6 left-6 z-20">
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white inline-flex items-center gap-1.5 mb-2">
            <ChefHat size={12} /> PARTNER PORTAL
          </div>
          <h1 className="text-4xl font-black text-white leading-none tracking-tight">Vendor Login</h1>
          <p className="text-white/80 text-sm font-bold mt-1">Manage your campus canteen orders.</p>
        </div>
      </div>

      {/* Main Form Container with Wavy Merge */}
      <div className={`flex-1 w-full z-20 relative px-6 pb-6 pt-2 flex flex-col animate-slide-up ${
        darkMode ? 'bg-slate-950' : 'bg-white'
      }`}>
        {/* Wavy Curtain SVG */}
        <div className="absolute top-0 left-0 w-full -mt-[50px] overflow-hidden leading-[0]">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[55px] block">
            <path 
              fill="currentColor" 
              className={darkMode ? 'text-slate-950' : 'text-white'}
              d="M0,64L60,74.7C120,85,240,107,360,101.3C480,96,600,64,720,53.3C840,43,960,53,1080,69.3C1200,85,1320,107,1380,117.3L1440,128L1440,128L1380,128C1320,128,1200,128,1080,128C960,128,840,128,720,128C600,128,480,128,360,128C240,128,120,128,60,128L0,128Z"
            ></path>
          </svg>
        </div>
        
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6 relative z-10" />
        
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck size={24} className="text-amber-500" />
          <h2 className="text-2xl font-black">Authorized Access</h2>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 flex-1">
          <div className="flex flex-col gap-1.5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Admin Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></span>
              <input
                type="text"
                placeholder="vendor_main"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 text-sm font-bold outline-none transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-amber-500 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Passcode</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pl-11 pr-11 py-3.5 rounded-2xl border-2 text-sm font-bold outline-none transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-amber-500 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mt-auto pt-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <button
              type="submit"
              disabled={isLoading}
              className="relative overflow-hidden w-full bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <div className="absolute inset-0 bg-white/20 blur-[2px] rounded-2xl"></div>
              <span className="relative z-10">{isLoading ? 'Authenticating...' : 'Enter Dashboard'}</span>
            </button>
            
            <p className="text-center mt-6 text-xs font-bold text-slate-500">
              Not a vendor? <button type="button" onClick={() => navigate('/')} className="text-amber-500 underline ml-1">Return to App</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
