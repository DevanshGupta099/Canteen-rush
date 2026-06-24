import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Utensils, Zap, Clock, Smartphone, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function DesktopLandingPage() {
  const darkMode = useStore(state => state.darkMode);
  
  // Stagger variants for list animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background Decor */}
      <div className="fixed top-[-20%] left-[-10%] w-[120%] h-[60%] bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent rounded-[100%] blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-amber-500/10 to-transparent rounded-[100%] blur-[80px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Utensils className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight">Canteen<span className="text-amber-500">Rush</span></span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Link to="/admin" className="font-bold px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors shadow-lg">
            Vendor Portal
          </Link>
        </motion.div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Copy */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Christ University Central Campus
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
              Skip the line.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Taste the fine.
              </span>
            </h1>
            
            <p className={`text-lg lg:text-xl font-medium mb-10 leading-relaxed max-w-xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              The ultimate smart-canteen experience. Pre-order your favorite meals, skip the rush hour queues, and pick up your food exactly when it's hot and ready.
            </p>
          </motion.div>

          {/* Features List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
          >
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <div className="mt-1 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={18} className="text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Zero Waiting</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Order ahead and pick up instantly.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <div className="mt-1 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Zap size={18} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Live Tracking</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Watch your order status in real-time.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Smart Queue</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Algorithms predict exact prep time.</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 mt-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-400">
              <Smartphone size={16} />
              Switch to mobile for the app experience
            </div>
          </motion.div>
        </div>

        {/* Right Side QR / Mobile instructions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex-1 w-full max-w-md"
        >
          <div className={`relative p-8 rounded-3xl border shadow-2xl backdrop-blur-xl ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
            {/* Glossy top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 animate-bounce">
                <Smartphone size={32} />
              </div>
              
              <h2 className="text-2xl font-black mb-3">Designed for Mobile</h2>
              <p className={`mb-8 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Canteen Rush provides the best experience on your phone. Scan the code to open the app on your mobile device instantly!
              </p>

              <div className="bg-white p-4 rounded-2xl shadow-inner mb-6">
                <QRCodeSVG 
                  value={window.location.origin} 
                  size={180} 
                  level="H" 
                  fgColor="#0f172a" 
                  bgColor="#ffffff"
                  imageSettings={{
                    src: "/favicon.svg", // assuming an icon exists, or remove
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>
              
              <p className="text-sm font-bold text-amber-500">Scan me with your camera</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
