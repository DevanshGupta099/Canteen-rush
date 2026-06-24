import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Zap, Clock, Smartphone, CheckCircle2, ShoppingBag, CreditCard, Coffee, TrendingUp, Users, Star, ArrowRight, Shield, Store, Flame, HelpCircle, Pizza, UtensilsCrossed } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function DesktopLandingPage() {
  const darkMode = useStore(state => state.darkMode);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Stagger variants for list animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Mock Menu Data
  const popularItems = [
    { name: "Classic Burger", price: "₹80", category: "Fast Food", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" },
    { name: "Cold Coffee", price: "₹60", category: "Beverages", img: "https://images.unsplash.com/photo-1461023058943-07cb1ce8db86?q=80&w=400&auto=format&fit=crop" },
    { name: "Margherita Pizza", price: "₹120", category: "Fast Food", img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400&auto=format&fit=crop" },
    { name: "Masala Dosa", price: "₹70", category: "Indian", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=400&auto=format&fit=crop" },
  ];

  const filteredItems = activeCategory === 'All' ? popularItems : popularItems.filter(item => item.category === activeCategory);

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background Decor - Blue and Orange/Yellow Scheme */}
      <div className="fixed top-[-20%] left-[-10%] w-[120%] h-[60%] bg-gradient-to-br from-blue-600/10 via-amber-500/10 to-transparent rounded-[100%] blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-amber-500/10 via-blue-500/5 to-transparent rounded-[100%] blur-[80px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <span className="text-3xl font-black tracking-tight">Canteen<span className="text-amber-500">Rush</span></span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <a href="#how-it-works" className={`font-bold text-sm hidden md:block hover:text-amber-500 transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>How it works</a>
          <a href="#menu" className={`font-bold text-sm hidden md:block hover:text-amber-500 transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Popular Menu</a>
          <a href="#canteens" className={`font-bold text-sm hidden md:block hover:text-amber-500 transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Canteens</a>
          <a href="#faq" className={`font-bold text-sm hidden md:block hover:text-amber-500 transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>FAQ</a>
          <Link to="/admin" className="font-bold px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95">
            Vendor Portal
          </Link>
        </motion.div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-8 pt-12 pb-24 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Copy */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm mb-8 cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Christ University Central Campus
            </motion.div>
            
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
            <motion.div variants={itemVariants} whileHover={{ x: 10 }} className="flex items-start gap-3 cursor-default">
              <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Zap size={18} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Instant Ordering</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Order ahead from anywhere on campus.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} whileHover={{ x: 10 }} className="flex items-start gap-3 cursor-default">
              <div className="mt-1 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Flame size={18} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Always Hot</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Get notified the exact second it's ready.</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-4 mt-8"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/20 cursor-pointer text-lg"
            >
              <Smartphone size={20} />
              Open Camera to Scan App
            </motion.div>
            <div className="flex -space-x-3 ml-4">
               {[1,2,3,4].map((i) => (
                 <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950" />
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">+1k</div>
            </div>
          </motion.div>
        </div>

        {/* Right Side QR / Mobile instructions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex-1 w-full max-w-md relative"
        >
          {/* Decorative floating badges */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, -2, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -right-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all"
          >
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 p-2 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Order #4092</p>
              <p className="font-black">Ready for Pickup!</p>
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0], rotate: [0, 3, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 -left-12 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all hidden lg:flex"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-2 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="font-black">Wait Time: 0 mins</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`relative p-8 rounded-[2rem] border shadow-2xl backdrop-blur-xl ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'}`}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                <Smartphone size={32} />
              </div>
              
              <h2 className="text-2xl font-black mb-3">Get the App Experience</h2>
              <p className={`mb-8 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Canteen Rush is an exclusive mobile web-app. Scan the QR code to open it instantly on your phone.
              </p>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-2xl shadow-inner mb-6 border border-slate-100 cursor-none"
              >
                <QRCodeSVG 
                  value={window.location.origin} 
                  size={180} 
                  level="H" 
                  fgColor="#0f172a" 
                  bgColor="#ffffff"
                />
              </motion.div>
              
              <p className="text-sm font-bold text-amber-500 flex items-center gap-1">
                <Zap size={16} /> No download required
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* NEW SECTION: Interactive Menu Preview */}
      <section id="menu" className={`relative z-10 w-full py-24 border-y ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Popular on Campus</h2>
            <p className={`text-lg font-medium max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Discover what your peers are loving right now.
            </p>
          </div>

          {/* Interactive Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {['All', 'Fast Food', 'Beverages', 'Indian'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 ${
                  activeCategory === cat 
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' 
                  : `border-2 ${darkMode ? 'border-slate-800 text-slate-300 hover:border-amber-500' : 'border-slate-200 text-slate-600 hover:border-amber-500'}`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div 
                  key={item.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -10 }}
                  className={`group rounded-3xl overflow-hidden border shadow-xl cursor-pointer ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-black text-slate-900 shadow-lg">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider">
                      {item.category === 'Fast Food' ? <Pizza size={14}/> : <UtensilsCrossed size={14}/>} {item.category}
                    </div>
                    <h3 className="text-xl font-black mb-4">{item.name}</h3>
                    <div className={`w-full py-3 rounded-xl font-bold text-center transition-colors ${darkMode ? 'bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-900 text-white' : 'bg-slate-100 group-hover:bg-amber-500 group-hover:text-white text-slate-900'}`}>
                      Order in App
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className={`relative z-10 w-full py-24 ${darkMode ? 'bg-slate-900/30' : 'bg-white/50'}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">How it works</h2>
            <p className={`text-lg font-medium max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Your favorite meals, ready when you are. Say goodbye to long queues and hello to seamless dining.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <ShoppingBag size={32}/>, title: "1. Order Ahead", desc: "Browse the menus of all campus canteens and customize your meal directly from your phone.", color: "blue" },
              { icon: <CreditCard size={32}/>, title: "2. Pay Digitally", desc: "Use your Canteen Rush Wallet or quick UPI for instant, cashless transactions.", color: "amber" },
              { icon: <Coffee size={32}/>, title: "3. Pick Up & Enjoy", desc: "Get notified the exact second your food is ready. Walk to the counter and pick it up!", color: "orange" }
            ].map((step, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.05 }} className={`p-8 rounded-3xl border transition-all shadow-xl cursor-pointer ${darkMode ? 'bg-slate-950 border-slate-800 hover:shadow-blue-500/10' : 'bg-white border-slate-100 hover:shadow-blue-500/10'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:rotate-12
                  ${step.color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/20' : 
                    step.color === 'amber' ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/20' : 
                    'bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/20'}`}
                >
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                <p className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Canteens Section */}
      <section id="canteens" className="relative z-10 w-full py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black mb-4">Partnered Canteens</h2>
              <p className={`text-lg font-medium max-w-xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                We've partnered with the best food spots on campus to bring you an incredible variety of meals.
              </p>
            </div>
            <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2 text-amber-500 font-bold hover:gap-4 transition-all cursor-pointer">
              View all menus <ArrowRight size={20} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Mingos", tag: "Fast Food", rating: "4.8", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop" },
              { name: "Freshet", tag: "Healthy & Salads", rating: "4.9", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop" },
              { name: "Gourmet Extension", tag: "Main Course", rating: "4.7", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
              { name: "Ivy Hall", tag: "Beverages", rating: "4.6", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop" }
            ].map((canteen, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className={`group rounded-3xl overflow-hidden border cursor-pointer shadow-lg ${darkMode ? 'bg-slate-900 border-slate-800 hover:shadow-amber-500/10' : 'bg-white border-slate-200 hover:shadow-amber-500/10'}`}>
                <div className="h-40 overflow-hidden relative">
                  <img src={canteen.img} alt={canteen.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> {canteen.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black mb-1 group-hover:text-amber-500 transition-colors">{canteen.name}</h3>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{canteen.tag}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Student Reviews */}
      <section className={`relative z-10 w-full py-24 overflow-hidden border-y ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-blue-50/50 border-blue-100'}`}>
        <div className="max-w-7xl mx-auto px-8 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Loved by Students</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="fill-amber-400 text-amber-400" size={24} />)}
            </div>
            <p className={`text-lg font-medium max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Over 5,000+ happy students skipping the lines every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "Literally saves me 20 minutes every lunch break. The live tracking is so accurate it's scary.", author: "Rahul M.", role: "BBA Student" },
              { text: "I love being able to order my coffee while I'm still in class. By the time I walk down, it's ready!", author: "Priya S.", role: "BCA Student" },
              { text: "The wallet feature is a lifesaver. I don't need to carry change anymore, just scan and pickup.", author: "Arjun K.", role: "B.Tech Student" },
            ].map((review, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className={`p-8 rounded-[2rem] border shadow-xl relative ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="text-amber-500 mb-6"><Star size={32} className="fill-amber-400/20" /></div>
                <p className={`text-lg font-bold mb-8 italic ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-xl">
                    {review.author[0]}
                  </div>
                  <div>
                    <h4 className="font-black">{review.author}</h4>
                    <p className={`text-xs font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 w-full py-12 mt-12">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className={`rounded-[3rem] p-12 md:p-16 overflow-hidden relative transition-all bg-blue-600 text-white shadow-2xl`}
          >
            {/* Inner Glow */}
            <div className="absolute top-0 right-0 w-full max-w-2xl h-[400px] bg-gradient-to-bl from-amber-400/30 to-transparent blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white leading-tight">
                  Join the smartest way to dine on campus.
                </h2>
                <p className="text-lg font-medium mb-8 text-blue-100">
                  We are transforming the Christ University culinary experience. Get in, get your food, and get back to your day.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-slate-900 font-bold text-lg cursor-pointer shadow-lg shadow-amber-500/20">
                  <Star className="fill-slate-900" size={20} />
                  Rated 4.9/5 by Students
                </motion.div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-all cursor-default">
                  <div className="text-amber-400 mb-2"><TrendingUp size={28} /></div>
                  <div className="text-3xl font-black mb-1 text-white">10,000+</div>
                  <div className="text-sm font-medium text-blue-100">Orders Processed</div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-all cursor-default">
                  <div className="text-amber-400 mb-2"><Clock size={28} /></div>
                  <div className="text-3xl font-black mb-1 text-white">15 Min</div>
                  <div className="text-sm font-medium text-blue-100">Avg. Wait Saved</div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 col-span-2 flex items-center justify-between transition-all cursor-default">
                  <div>
                    <div className="text-amber-400 mb-2"><Users size={28} /></div>
                    <div className="text-3xl font-black mb-1 text-white">5,000+</div>
                    <div className="text-sm font-medium text-blue-100">Active Students</div>
                  </div>
                  <div className="w-16 h-16 opacity-30">
                     <Shield size={64} className="text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 w-full py-24">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-black mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 gap-4 text-left">
            {[
              { q: "Do I need to download an app from the App Store?", a: "No! Canteen Rush is a Progressive Web App (PWA). Just scan the QR code and it opens directly in your browser. You can add it to your home screen for quick access." },
              { q: "How do I pay for my orders?", a: "You can load money into your Canteen Rush Wallet using UPI or Cards. Once loaded, checkout takes literally one tap, ensuring you get your food instantly." },
              { q: "What if I miss my order pickup?", a: "We send you a push notification the second your food is ready. Your food will be kept at the pickup counter for up to 30 minutes." }
            ].map((faq, i) => (
              <motion.div key={i} whileHover={{ x: 5 }} className={`p-6 rounded-2xl border cursor-pointer transition-shadow hover:shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-lg font-black mb-2 flex items-center gap-2"><HelpCircle size={18} className="text-amber-500"/> {faq.q}</h3>
                <p className={`font-medium ml-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Footer */}
      <footer className={`relative z-10 border-t pt-16 pb-8 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <span className="text-2xl font-black tracking-tight mb-4 block">Canteen<span className="text-amber-500">Rush</span></span>
              <p className={`text-sm font-medium leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Making campus dining seamless, fast, and completely cashless. Order ahead, skip the line.
              </p>
            </div>
            
            <div>
              <h4 className="font-black mb-4">Platform</h4>
              <ul className={`space-y-3 text-sm font-medium flex flex-col ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <a href="#how-it-works" className="hover:text-amber-500 transition-colors">How it works</a>
                <a href="#menu" className="hover:text-amber-500 transition-colors">Menu</a>
                <a href="#canteens" className="hover:text-amber-500 transition-colors">Canteens</a>
                <Link to="/admin" className="hover:text-amber-500 transition-colors">Vendor Dashboard</Link>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black mb-4">Support</h4>
              <ul className={`space-y-3 text-sm font-medium flex flex-col ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <a href="#faq" className="hover:text-amber-500 transition-colors">FAQ</a>
                <a href="#" className="hover:text-amber-500 transition-colors">Contact Us</a>
                <a href="#" className="hover:text-amber-500 transition-colors">Help Center</a>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-4">Legal</h4>
              <ul className={`space-y-3 text-sm font-medium flex flex-col ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-amber-500 transition-colors">Refund Policy</a>
              </ul>
            </div>
          </div>
          
          <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              &copy; {new Date().getFullYear()} Canteen Rush. Designed for Christ University.
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/30 text-slate-400 hover:text-amber-500 transition-all">
                <Store size={16} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
