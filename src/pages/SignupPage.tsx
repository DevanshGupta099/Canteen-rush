import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, Award, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useStore(state => state.signup);
  const darkMode = useStore(state => state.darkMode);

  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Prep time...');

  const loadingPhrases = ['Chopping onions...', 'Setting up your tray...', 'Baking your profile...', 'Ready to serve!'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !regNo || !email || !phone || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    let phraseIdx = 0;
    const textInterval = setInterval(() => {
      setLoadingText(loadingPhrases[phraseIdx % loadingPhrases.length]);
      phraseIdx++;
    }, 600);

    setTimeout(async () => {
      clearInterval(textInterval);
      const success = await signup({ name, regNo, email, phone, password });
      setIsLoading(false);

      if (success) {
        toast.success(`Welcome to the club, ${name}!`, { icon: '🎉' });
        navigate('/');
      }
    }, 2400);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 overflow-y-auto relative ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Decorative Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[120%] h-[60%] bg-gradient-to-b from-amber-500/10 to-transparent rounded-[100%] blur-3xl pointer-events-none" />
      
      <div className="relative h-[40vh] w-full flex-shrink-0 animate-slide-up">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10 dark:from-slate-950 dark:via-slate-950/80" />
        <img 
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
          alt="Food spread" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 z-20">
          <h1 className="text-3xl font-black text-white leading-none tracking-tight">Join the Rush</h1>
          <p className="text-white/80 text-xs font-bold mt-1">Faster food, zero queues.</p>
        </div>
      </div>

      {/* Main Form Container with Wavy Merge */}
      <div className={`flex-1 w-full z-20 relative px-6 pb-12 pt-2 flex flex-col animate-slide-up ${
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
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={16} /></span>
              <input
                type="text"
                placeholder="Devansh Gupta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-christ text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Reg No & Phone Row */}
          <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Reg No.</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Award size={14} /></span>
                <input
                  type="text"
                  placeholder="21BCA404"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className={`w-full pl-9 pr-3 py-3 rounded-2xl border-2 text-xs font-bold outline-none transition-all ${
                    darkMode ? 'bg-slate-900 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-christ text-slate-900'
                  }`}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Phone</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={14} /></span>
                <input
                  type="text"
                  placeholder="Phone No"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pl-9 pr-3 py-3 rounded-2xl border-2 text-xs font-bold outline-none transition-all ${
                    darkMode ? 'bg-slate-900 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-christ text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Student Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={16} /></span>
              <input
                type="email"
                placeholder="devansh@christuniversity.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-christ text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Password Row */}
          <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '250ms' }}>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={14} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-3 py-3 rounded-2xl border-2 text-xs font-bold outline-none transition-all ${
                    darkMode ? 'bg-slate-900 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-christ text-slate-900'
                  }`}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Confirm</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={14} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-9 pr-8 py-3 rounded-2xl border-2 text-xs font-bold outline-none transition-all ${
                    darkMode ? 'bg-slate-900 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-christ text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
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
                <span className="animate-bounce text-xl inline-block">🍕</span> 
                <span className="animate-pulse">{loadingText}</span>
              </div>
            ) : (
              <>Create Account <ChevronRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 animate-slide-up" style={{ animationDelay: '350ms' }}>
          <p className={`text-center text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-christ dark:text-accent hover:underline decoration-2 underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
