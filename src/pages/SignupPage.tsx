import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, Phone, Award } from 'lucide-react';
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

    // Simulate minor delay
    setTimeout(async () => {
      const success = await signup({ name, regNo, email, phone, password });
      setIsLoading(false);
      
      if (success) {
        toast.success(`Account created! Welcome, ${name}.`, {
          icon: '🎉',
          style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
        });
        navigate('/');
      }
    }, 800);
  };

  return (
    <div className={`min-h-full flex flex-col justify-between p-6 transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Background Blobs */}
      <div className="absolute top-[-100px] right-[-50px] w-72 h-72 rounded-full bg-christ/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-50px] w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mt-6 z-10 animate-fade-in">
        <h1 className="text-2xl font-black tracking-tight leading-none text-christ dark:text-amber-400">
          Create Account
        </h1>
        <p className={`text-xs mt-2 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Join Canteen Rush to order meals seamlessly
        </p>
      </div>

      {/* Form Card */}
      <div className={`w-full max-w-[364px] mx-auto rounded-3xl border p-6 my-6 z-10 shadow-xl transition-all duration-300 animate-slide-up ${
        darkMode ? 'bg-slate-900 border-slate-800 shadow-slate-950/50' : 'bg-white border-slate-100 shadow-slate-200/50'
      }`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Full Name</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={15} />
              </span>
              <input
                type="text"
                placeholder="Devansh Gupta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-bold outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>
          </div>

          {/* Registration Number */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">University Reg No.</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Award size={15} />
              </span>
              <input
                type="text"
                placeholder="21BCA404"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-bold outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Phone size={15} />
              </span>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-bold outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Student Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={15} />
              </span>
              <input
                type="email"
                placeholder="devansh.gupta@christuniversity.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-bold outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Create Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={15} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 rounded-2xl border text-xs font-bold outline-none transition-all ${
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
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Confirm Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={15} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-bold outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-christ hover:bg-christ/95 text-white py-3 rounded-2xl font-black text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 mt-2 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={16} /> Sign Up
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="text-center mb-4 z-10 animate-fade-in">
        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-black hover:underline text-christ dark:text-amber-400"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
