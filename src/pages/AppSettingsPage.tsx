import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Moon, Volume2, Languages, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

export default function AppSettingsPage() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, autoTopUp, toggleAutoTopUp, userProfile, updateProfile } = useStore();
  
  const [localSettings, setLocalSettings] = useState({
    notifications: true,
    sound: true
  });

  const initialSeed = userProfile.avatarUrl.includes('seed=')
    ? decodeURIComponent(userProfile.avatarUrl.split('seed=')[1])
    : 'Devansh';

  const [profileForm, setProfileForm] = useState({
    name: userProfile.name,
    regNo: userProfile.regNo,
    email: userProfile.email,
    phone: userProfile.phone,
    avatarSeed: initialSeed
  });

  const handleToggle = (id: string) => {
    if (id === 'darkMode') {
      toggleDarkMode();
      toast.success(`Dark theme ${!darkMode ? 'activated' : 'deactivated'}!`, {
        icon: !darkMode ? '🌙' : '☀️',
        style: { borderRadius: '16px', background: !darkMode ? '#1e293b' : '#fff', color: !darkMode ? '#fff' : '#333' }
      });
    } else if (id === 'autoTopUp') {
      toggleAutoTopUp();
      toast.success(`Auto top-up ${!autoTopUp ? 'activated' : 'deactivated'}!`, {
        icon: '🔄',
        style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
      });
    } else {
      setLocalSettings(prev => {
        const key = id as keyof typeof localSettings;
        const newVal = !prev[key];
        toast.success(`${id.charAt(0).toUpperCase() + id.slice(1)} preference updated`, {
          style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
        });
        return { ...prev, [key]: newVal };
      });
    }
  };

  return (
    <div className={`min-h-full pb-10 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Header */}
      <div className={`px-5 pt-8 pb-4 sticky top-0 z-20 shadow-sm flex items-center gap-4 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-slate-100'
      }`}>
        <button 
          aria-label="Go back" 
          onClick={() => navigate(-1)} 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-black text-xl">App Settings</h2>
      </div>

      <div className="px-5 pt-6">
        
        {/* Profile Editing Section */}
        <h3 className={`font-bold mb-4 px-1 text-sm uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Edit Profile</h3>
        
        <div className={`rounded-3xl border p-5 mb-8 transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          {/* Avatar live preview */}
          <div className="flex flex-col items-center gap-2 mb-5">
            <div className="w-20 h-20 bg-slate-150 dark:bg-slate-800 rounded-2xl p-1 shadow-inner relative overflow-hidden border border-slate-250 dark:border-slate-700">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileForm.avatarSeed)}`}
                alt="avatar preview"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Live Avatar Preview</span>
          </div>

          {/* Avatar Presets Grid */}
          <div className="flex flex-col gap-2 mb-6 border-t border-dashed border-slate-200 dark:border-slate-800 pt-4">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 text-center">Tap to Quick-Select Avatar Style</span>
            <div className="grid grid-cols-4 gap-3 justify-items-center">
              {['Devansh', 'Felix', 'Aneka', 'Sasha', 'Oliver', 'Buster', 'Bella', 'Gizmo'].map((seed) => {
                const isSelected = profileForm.avatarSeed.toLowerCase() === seed.toLowerCase();
                return (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => setProfileForm(prev => ({ ...prev, avatarSeed: seed }))}
                    className={`w-12 h-12 rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border-2 transition-all relative overflow-hidden active:scale-90 ${
                      isSelected 
                        ? 'border-amber-500 scale-105 shadow-md shadow-amber-500/20' 
                        : 'border-transparent hover:border-slate-350 dark:hover:border-slate-700'
                    }`}
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                      alt={seed}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Name input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Full Name</label>
              <input 
                id="profileName"
                type="text"
                title="Full Name"
                placeholder="Full Name"
                aria-label="Full Name"
                value={profileForm.name}
                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full p-3 rounded-2xl border text-xs font-bold outline-none transition-colors ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>

            {/* Registration number input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Registration Number</label>
              <input 
                id="profileRegNo"
                type="text"
                title="Registration Number"
                placeholder="Registration Number"
                aria-label="Registration Number"
                value={profileForm.regNo}
                onChange={(e) => setProfileForm(prev => ({ ...prev, regNo: e.target.value }))}
                className={`w-full p-3 rounded-2xl border text-xs font-bold outline-none transition-colors ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>

            {/* Email input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Student Email</label>
              <input 
                id="profileEmail"
                type="email"
                title="Student Email"
                placeholder="Student Email"
                aria-label="Student Email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full p-3 rounded-2xl border text-xs font-bold outline-none transition-colors ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>

            {/* Phone input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Phone Number</label>
              <input 
                id="profilePhone"
                type="text"
                title="Phone Number"
                placeholder="Phone Number"
                aria-label="Phone Number"
                value={profileForm.phone}
                onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full p-3 rounded-2xl border text-xs font-bold outline-none transition-colors ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>

            {/* Avatar Seed input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Avatar Seed (Customizes avatar graphic)</label>
              <input 
                id="profileAvatarSeed"
                type="text"
                title="Avatar Seed"
                placeholder="Avatar Seed"
                aria-label="Avatar Seed"
                value={profileForm.avatarSeed}
                onChange={(e) => setProfileForm(prev => ({ ...prev, avatarSeed: e.target.value }))}
                className={`w-full p-3 rounded-2xl border text-xs font-bold outline-none transition-colors ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                }`}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={() => {
                if (!profileForm.name || !profileForm.regNo || !profileForm.email || !profileForm.phone) {
                  toast.error('All fields except avatar seed must be filled.');
                  return;
                }
                updateProfile({
                  name: profileForm.name,
                  regNo: profileForm.regNo,
                  email: profileForm.email,
                  phone: profileForm.phone,
                  avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileForm.avatarSeed)}`
                });
                toast.success('Profile credentials updated!', {
                  icon: '👤',
                  style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
                });
              }}
              className="bg-christ text-white py-3.5 rounded-2xl font-black text-xs shadow-md active:scale-95 transition-transform mt-2 dark:bg-amber-500 dark:text-slate-950"
            >
              Save Profile Changes
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <h3 className={`font-bold mb-4 px-1 text-sm uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Preferences</h3>
        
        <div className={`rounded-3xl border overflow-hidden mb-8 transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          {[
            { id: 'notifications', label: 'Push Notifications', icon: Bell },
            { id: 'darkMode', label: 'Dark Mode Theme', icon: Moon },
            { id: 'autoTopUp', label: 'Low Balance Auto-Top Up (₹500)', icon: RefreshCw },
            { id: 'sound', label: 'App Sounds', icon: Volume2 }
          ].map((item) => {
            const isChecked = item.id === 'darkMode' 
              ? darkMode 
              : item.id === 'autoTopUp' 
                ? autoTopUp 
                : localSettings[item.id as keyof typeof localSettings];
                
            return (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-5 border-b last:border-0 ${
                  darkMode ? 'border-slate-850' : 'border-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${
                    darkMode ? 'bg-slate-800 text-slate-350' : 'bg-slate-50 text-slate-600'
                  }`}>
                    <item.icon size={18} className={isChecked ? 'text-amber-500' : ''} />
                  </div>
                  <span className="font-black text-sm">{item.label}</span>
                </div>
                
                {/* Toggle Switch */}
                <button 
                  aria-label={`Toggle ${item.label}`}
                  onClick={() => handleToggle(item.id)}
                  className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 focus:outline-none ${
                    isChecked 
                      ? (darkMode ? 'bg-amber-500' : 'bg-christ') 
                      : 'bg-slate-350 dark:bg-slate-700'
                  }`}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                      isChecked ? 'translate-x-6' : 'translate-x-0'
                    }`} 
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* System Section */}
        <h3 className={`font-bold mb-4 px-1 text-sm uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>System</h3>
        
        <div className={`rounded-3xl border overflow-hidden transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                darkMode ? 'bg-slate-800 text-slate-355' : 'bg-slate-50 text-slate-600'
              }`}>
                <Languages size={18} />
              </div>
              <span className="font-black text-sm">Language</span>
            </div>
            <span className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-amber-400' : 'text-christ'}`}>English (US)</span>
          </div>
          
          <div className="p-5 flex flex-col gap-2">
            <h4 className="font-black text-sm flex items-center gap-2">🤖 AI Usage Declaration</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              This application utilizes AI to provide predictive wait times, dynamic UI elements, and mock support agents.
              The AI components are designed for enhanced user experience and do not make autonomous purchasing decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}