import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        toast.success('Welcome Admin', { icon: '🛡️' });
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
    <div className={`min-h-screen flex items-center justify-center p-5 transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      <div className={`w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative overflow-hidden ${
        darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'
      }`}>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black mb-1">Vendor Portal</h1>
          <p className={`text-xs font-bold mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Authorized Access Only</p>
          
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
              <input 
                type="text" 
                placeholder="Admin Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full py-3.5 pl-12 pr-4 rounded-xl text-sm font-bold outline-none border transition-all ${
                  darkMode 
                    ? 'bg-slate-850 border-slate-700 focus:border-amber-500 text-white' 
                    : 'bg-slate-50 border-slate-200 focus:border-christ text-slate-800'
                }`}
              />
            </div>

            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
              <input 
                type="password" 
                placeholder="Passcode" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full py-3.5 pl-12 pr-4 rounded-xl text-sm font-bold outline-none border transition-all ${
                  darkMode 
                    ? 'bg-slate-850 border-slate-700 focus:border-amber-500 text-white' 
                    : 'bg-slate-50 border-slate-200 focus:border-christ text-slate-800'
                }`}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 w-full bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
          </form>

          <button 
            onClick={() => navigate('/')} 
            className={`mt-6 text-xs font-bold transition-colors ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
          >
            ← Return to App
          </button>
        </div>
      </div>
    </div>
  );
}
