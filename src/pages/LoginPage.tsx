import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ChevronRight, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useStore(state => state.login);
  const darkMode = useStore(state => state.darkMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cooking...');

  const loadingPhrases = ['Warming the oven...', 'Flipping the burger...', 'Packing your meal...', 'Almost ready!'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    let phraseIdx = 0;
    const textInterval = setInterval(() => {
      setLoadingText(loadingPhrases[phraseIdx % loadingPhrases.length]);
      phraseIdx++;
    }, 600);

    // Give them time to see the fun loader
    setTimeout(async () => {
      clearInterval(textInterval);
      const success = await login(email, password);
      setIsLoading(false);
      if (success) {
        toast.success('Logged in successfully!', { icon: '🍔' });
        navigate('/');
      } else {
        toast.error('Invalid credentials. Try the Guest Account!');
      }
    }, 2400);
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      const success = await useStore.getState().loginGuest();
      setIsLoading(false);
      if (success) {
        toast.success('Welcome, Guest Explorer!', { icon: '🍕' });
        navigate('/');
      }
    }, 1200);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 overflow-hidden relative ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] bg-gradient-to-b from-christ/20 to-transparent rounded-[100%] blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 text-6xl opacity-5 dark:opacity-10 rotate-12 pointer-events-none animate-float">🍔</div>
      <div className="absolute top-40 left-10 text-5xl opacity-5 dark:opacity-10 -rotate-12 pointer-events-none animate-float" style={{ animationDelay: '1s' }}>🍕</div>
      <div className="absolute bottom-40 right-20 text-6xl opacity-5 dark:opacity-10 rotate-45 pointer-events-none animate-float" style={{ animationDelay: '2s' }}>🍟</div>

      {/* Header Image Area (Swiggy/Zomato style immersive top) */}
      <div className="relative h-[45vh] w-full flex-shrink-0 animate-slide-up">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10 dark:from-slate-950 dark:via-slate-950/60" />
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop" 
          alt="Delicious food collage" 
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute bottom-6 left-6 z-20">
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white inline-flex items-center gap-1.5 mb-2">
            <Utensils size={12} /> CHRIST UNIVERSITY
          </div>
          <h1 className="text-4xl font-black text-white leading-none tracking-tight">Canteen Rush</h1>
          <p className="text-white/80 text-sm font-bold mt-1">Skip the line. Taste the fine.</p>
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
        
        <h2 className="text-2xl font-black mb-6">Welcome Back 👋</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
          <div className="flex flex-col gap-1.5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Student Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></span>
              <input
                type="email"
                placeholder="student@christuniversity.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 text-sm font-bold outline-none transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800 focus:border-christ text-white' : 'bg-slate-50 border-slate-100 focus:border-christ text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-11 pr-11 py-3.5 rounded-2xl border-2 text-sm font-bold outline-none transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800 focus:border-christ text-white' : 'bg-slate-50 border-slate-100 focus:border-christ text-slate-900'
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

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-christ hover:bg-christ-light text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-christ/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 animate-slide-up ${
              isLoading ? 'opacity-90 cursor-not-allowed scale-95' : ''
            }`}
            style={{ animationDelay: '300ms' }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-bounce text-xl inline-block">🍔</span> 
                <span className="animate-pulse">{loadingText}</span>
              </div>
            ) : (
              <>Sign In <ChevronRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-auto pt-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or continue with</span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className={`w-full py-3.5 rounded-2xl border-2 border-dashed font-black flex items-center justify-center gap-2 transition-colors ${
              darkMode ? 'border-slate-800 hover:bg-slate-900 text-amber-500' : 'border-slate-200 hover:bg-slate-50 text-christ'
            }`}
          >
            👤 Guest Explorer Mode
          </button>

          <p className={`text-center text-sm font-bold mt-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            New to campus?{' '}
            <Link to="/signup" className="text-christ dark:text-accent hover:underline decoration-2 underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
