import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    
    // Simulate minor network delay for a premium app feel
    setTimeout(async () => {
      const success = await login(email, password);
      setIsLoading(false);
      if (success) {
        toast.success('Logged in successfully! Welcome to Canteen Rush.', {
          icon: '🎓',
          style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
        });
        navigate('/');
      } else {
        toast.error('Invalid email or password. Try the demo account!', {
          style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
        });
      }
    }, 800);
  };

  const handlePreFill = () => {
    setEmail('devansh.gupta@christuniversity.in');
    setPassword('password123');
    toast.success('Demo credentials loaded!', {
      icon: '📝',
      style: { borderRadius: '12px' }
    });
  };

  return (
    <div className={`min-h-full flex flex-col justify-between p-6 transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Decorative Blob */}
      <div className="absolute top-[-100px] left-[-50px] w-72 h-72 rounded-full bg-christ/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-50px] w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Section / Header */}
      <div className="flex flex-col items-center text-center mt-12 z-10 animate-fade-in">
        <div className="w-16 h-16 bg-gradient-to-br from-christ to-blue-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-christ/25 mb-4 animate-pop border border-white/10 relative">
          <Sparkles className="absolute -top-1 -right-1 text-amber-400 w-4 h-4 animate-pulse" />
          <span className="text-2xl font-black italic tracking-tighter">CR</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight leading-none text-christ dark:text-amber-400">
          Canteen Rush
        </h1>
        <p className={`text-xs mt-2 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Smart Campus Dining for Christ University
        </p>
      </div>

      {/* Form Card */}
      <div className={`w-full max-w-[364px] mx-auto rounded-3xl border p-6 my-auto z-10 shadow-xl transition-all duration-300 animate-slide-up ${
        darkMode ? 'bg-slate-900 border-slate-800 shadow-slate-950/50' : 'bg-white border-slate-100 shadow-slate-200/50'
      }`}>
        <h2 className="text-lg font-black tracking-tight mb-5">Welcome back</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Student Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="devansh.gupta@christuniversity.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs font-bold outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-xs font-bold outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-christ hover:bg-christ/95 text-white py-3.5 rounded-2xl font-black text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 mt-2 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} /> Login
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Demo Sandbox</span>
          <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1" />
        </div>

        {/* Demo prefill button */}
        <button
          type="button"
          onClick={handlePreFill}
          className={`w-full py-2.5 rounded-xl border border-dashed text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
            darkMode 
              ? 'border-slate-800 hover:bg-slate-850 text-amber-500' 
              : 'border-slate-200 hover:bg-slate-50 text-christ'
          }`}
        >
          🔑 Use Demo Student Account
        </button>
      </div>

      {/* Bottom Footer Section */}
      <div className="text-center mb-6 z-10 animate-fade-in">
        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-black hover:underline text-christ dark:text-amber-400"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
