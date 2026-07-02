import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, Smartphone, Shield, 
  ArrowRight, Store, Pizza,
  TrendingUp, Plus, Minus,
  Users, Calendar, Filter, Receipt,
  MonitorSmartphone, MessageCircle, Globe, Share2, Mail, ArrowUpRight, Phone, MapPin
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import { Marquee } from '../components/ui/marquee';
import { UniqueTestimonial } from '../components/ui/unique-testimonial';

export default function DesktopLandingPage() {
  const darkMode = useStore(state => state.darkMode);

  // Fake Data
  const livePulseData = [
    { name: "Mingos", status: "Moderate Crowd", wait: "5m", active: true },
    { name: "Freshet", status: "Fast Moving", wait: "2m", active: false },
    { name: "Gourmet Extension", status: "Busy", wait: "12m", active: false },
  ];

  const trendingEats = [
    { name: "Spicy Chicken Bowl", price: "₹180", canteen: "Mingos", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop", tags: ["Bestseller", "Spicy"] },
    { name: "Iced Caramel Macchiato", price: "₹120", canteen: "Ivy Hall", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500&auto=format&fit=crop", tags: ["Cold Brew"] },
    { name: "Loaded Cheese Fries", price: "₹150", canteen: "Mingos", img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=500&auto=format&fit=crop", tags: ["Snack"] },
    { name: "Classic Caesar Salad", price: "₹140", canteen: "Freshet", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop", tags: ["Healthy"] },
  ];

  const testimonials = [
    { id: 1, author: "Rahul S.", role: "Computer Science, Year 3", quote: "Canteen Rush completely changed my lunch breaks. I used to spend 20 minutes in line at Mingos, now I just walk up and grab my bowl.", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" },
    { id: 2, author: "Priya M.", role: "Design, Year 2", quote: "The wallet feature is a lifesaver. I load it up at the start of the week and tap to pay everywhere. Zero hassle.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
    { id: 3, author: "Arjun K.", role: "Business, Year 4", quote: "Live pulse is insanely accurate. If I see Gourmet Extension is busy, I just order ahead and go when it's ready.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
  ];

  const faqs = [
    { q: "Are there any hidden fees?", a: "No! Canteen Rush is completely free for students. You only pay for the food you order." },
    { q: "How do I add money to my wallet?", a: "You can top up your wallet instantly using UPI, Credit/Debit cards, or Net Banking right from your profile." },
    { q: "What happens if my order gets delayed?", a: "The live wait time adjusts automatically based on the kitchen's load. You'll get a notification the exact second your order is ready for pickup." },
    { q: "Do I need to download an app?", a: "Nope! Canteen Rush is a Progressive Web App (PWA). You can scan a QR code and use it instantly in your browser, or save it to your home screen." },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    // Core scrolling container. Handles all scroll independently.
    <div className={`h-[100dvh] w-full overflow-y-auto overflow-x-hidden scroll-smooth font-sans ${darkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* CINEMATIC NAVBAR */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full px-6 py-4 flex justify-between items-center rounded-full backdrop-blur-2xl bg-slate-950/60 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">
              Canteen<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Rush</span>
            </span>
          </div>
          <div className="flex items-center gap-8 font-bold text-sm">
            <a href="#pulse" className="hover:text-amber-400 transition-colors text-white/70 hover:text-white hidden md:block drop-shadow-sm">Live Pulse</a>
            <a href="#trending" className="hover:text-amber-400 transition-colors text-white/70 hover:text-white hidden md:block drop-shadow-sm">Trending</a>
            <a href="#wallet" className="hover:text-amber-400 transition-colors text-white/70 hover:text-white hidden md:block drop-shadow-sm">Wallet</a>
            <a href="#faq" className="hover:text-amber-400 transition-colors text-white/70 hover:text-white hidden md:block drop-shadow-sm">FAQ</a>
            <Link 
              to="/admin" 
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-300 relative group overflow-hidden border border-white/20"
            >
              <span className="relative z-10">Vendor Portal</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            </Link>
          </div>
        </motion.nav>
      </div>

      {/* 1. CINEMATIC HERO (21st.dev Component) */}
      <section id="hero">
         <HeroGeometric 
           badge="Canteen Rush" 
           title1="Skip the Line." 
           title2="Savor the Moment." 
         />
      </section>

      {/* PARTNERS MARQUEE (21st.dev Component) */}
      <section className="py-12 bg-slate-950 border-b border-white/5 relative z-20">
         <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>
         <div className="text-center mb-6">
            <span className="text-white/40 text-xs font-bold tracking-widest uppercase">Trusted by Campus Favorites</span>
         </div>
         <Marquee speed={40} className="mt-0">
            {["Mingos", "Freshet", "Ivy Hall", "Gourmet Extension", "Bite Club", "Campus Cafe"].map((name, i) => (
               <div key={i} className="flex items-center gap-3 mx-8">
                  <Store className="text-amber-500 opacity-80" size={24} />
                  <span className="text-2xl font-black text-white/80 tracking-tight">{name}</span>
               </div>
            ))}
         </Marquee>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className={`py-32 relative z-20 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-100/50'}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Dine in 3 Simple Steps.</h2>
            <p className="text-xl font-medium opacity-60 max-w-2xl mx-auto">No lines, no fumbling for cash. Just seamless ordering from your pocket.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20 rounded-full z-0"></div>

            {[
              { num: "01", title: "Browse & Order", desc: "Check live menus and wait times from anywhere on campus.", icon: <Smartphone size={28} /> },
              { num: "02", title: "One-Tap Pay", desc: "Use your secure campus wallet for zero-delay transactions.", icon: <Zap size={28} /> },
              { num: "03", title: "Grab & Go", desc: "Get notified the exact moment your food is ready.", icon: <Clock size={28} /> }
            ].map((step, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ duration: 0.6, delay: i * 0.2 }}
                 className="relative z-10 flex flex-col items-center text-center group"
               >
                 <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-900 flex items-center justify-center shadow-xl mb-6 relative group-hover:scale-110 group-hover:border-amber-500 transition-all duration-300">
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-sm flex items-center justify-center">{step.num}</span>
                    <div className="text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">{step.icon}</div>
                 </div>
                 <h3 className="text-2xl font-black mb-2">{step.title}</h3>
                 <p className="font-medium opacity-70 leading-relaxed max-w-xs">{step.desc}</p>
               </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIVE CAMPUS PULSE */}
      <section id="pulse" className={`py-32 relative z-20 ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3">
                Live Pulse <span className="relative flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span></span>
              </h2>
              <p className="text-xl font-medium opacity-60">Real-time canteen capacity and wait times.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {livePulseData.map((data, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-[2rem] border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 shadow-xl' : 'bg-slate-50 border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)]'}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black">{data.name}</h3>
                </div>
                
                <div className={`p-5 rounded-2xl mb-4 ${darkMode ? 'bg-slate-900/80 inset-shadow' : 'bg-white shadow-sm border border-slate-100'}`}>
                   <div className="text-xs uppercase font-bold opacity-60 mb-1">Current Status</div>
                   <div className="text-xl font-black text-amber-500">{data.status}</div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2 font-bold opacity-70">
                    <Clock size={18} /> Wait Time: 
                  </div>
                  <div className="text-xl font-black">{data.wait}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRENDING CAMPUS EATS */}
      <section id="trending" className={`py-32 relative z-20 overflow-hidden ${darkMode ? 'bg-slate-900/30' : 'bg-slate-50'}`}>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3">
              <TrendingUp className="text-amber-500" size={40} /> Trending Right Now
            </h2>
            <p className="text-xl font-medium opacity-60">The most popular items across campus today.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingEats.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold shadow-sm">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-sm font-bold text-amber-500 mb-1">{item.canteen}</div>
                  <h3 className="text-lg font-black leading-tight mb-3">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black">{item.price}</span>
                    <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE WALLET */}
      <section id="wallet" className={`py-32 relative z-20 overflow-hidden ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="flex-1"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">The Power of Tap.</h2>
            <p className="text-2xl font-medium opacity-70 mb-10 leading-relaxed">Top up once, eat all week. Enjoy seamless cashless payments with bank-grade security and zero processing fees.</p>
            
            <div className="flex flex-col gap-6">
              {[
                { title: "Bank-Grade Encryption", desc: "Your funds are stored securely with 256-bit encryption.", icon: <Shield className="text-blue-500" /> },
                { title: "Zero Wait Transactions", desc: "No PINs, no OTPs at the counter. Just tap and grab.", icon: <Zap className="text-amber-500" /> }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-xl mb-1">{item.title}</h4>
                    <p className="opacity-70 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            className="flex-1 w-full flex justify-center perspective-1000"
          >
            {/* Skeuomorphic Wallet Card */}
            <motion.div 
              whileHover={{ rotateY: 15, rotateX: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full max-w-[450px] aspect-[1.6/1] rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] bg-gradient-to-br from-slate-700 via-slate-900 to-black text-white border-t border-l border-white/20"
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/40 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="text-2xl font-black tracking-widest drop-shadow-sm">CANTEEN<span className="text-amber-500">RUSH</span></div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                  <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                  <line x1="12" y1="20" x2="12.01" y2="20"></line>
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 text-slate-300">Available Balance</div>
                <div className="text-5xl font-black tracking-tighter drop-shadow-lg">₹ 4,250.00</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* BENTO GRID FEATURES */}
      <section id="features" className={`py-32 relative z-20 ${darkMode ? 'bg-slate-900/30' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Everything You Need.</h2>
            <p className="text-xl font-medium opacity-60">Smart tools designed for the modern student.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`md:col-span-2 rounded-[2rem] p-8 flex flex-col justify-end overflow-hidden relative group border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full group-hover:bg-amber-500/20 transition-colors duration-500"></div>
              <Users size={40} className="text-amber-500 mb-4" />
              <h3 className="text-2xl font-black mb-2 relative z-10">Group Ordering</h3>
              <p className="font-medium opacity-60 max-w-md relative z-10">Add your friends to a group order and checkout instantly. One person pays, everyone eats.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`rounded-[2rem] p-8 flex flex-col justify-end overflow-hidden relative group border ${darkMode ? 'bg-gradient-to-br from-orange-900/40 to-slate-900 border-orange-900/50' : 'bg-gradient-to-br from-orange-100 to-white border-orange-200 shadow-lg'}`}
            >
              <Filter size={40} className="text-orange-500 mb-4" />
              <h3 className="text-2xl font-black mb-2">Dietary Filters</h3>
              <p className="font-medium opacity-60">Vegan? Gluten-free? Find exactly what you need in seconds.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`rounded-[2rem] p-8 flex flex-col justify-end overflow-hidden relative group border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}
            >
              <Calendar size={40} className="text-blue-500 mb-4" />
              <h3 className="text-2xl font-black mb-2">Pre-Order</h3>
              <p className="font-medium opacity-60">Schedule your lunch pickup hours in advance.</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={`md:col-span-2 rounded-[2rem] p-8 flex flex-col justify-end overflow-hidden relative group border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}`}
            >
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-500"></div>
              <Receipt size={40} className="text-slate-400 mb-4" />
              <h3 className="text-2xl font-black mb-2 relative z-10">Digital Receipts</h3>
              <p className="font-medium opacity-60 max-w-md relative z-10">Keep track of your monthly food expenses automatically within your digital wallet dashboard.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* IMPACT & STATS */}
      <section className="py-32 relative z-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-4">10k+</div>
              <div className="text-xl font-bold text-amber-500 mb-2">Hours Saved</div>
              <p className="opacity-60 font-medium">Students bypass the line entirely every single week.</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-4">5,200</div>
              <div className="text-xl font-bold text-amber-500 mb-2">Active Students</div>
              <p className="opacity-60 font-medium">Trust Canteen Rush as their primary way to dine.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-4">&lt; 2m</div>
              <div className="text-xl font-bold text-amber-500 mb-2">Average Wait</div>
              <p className="opacity-60 font-medium">From the moment you arrive to picking up your hot food.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section id="testimonials" className={`py-32 relative z-20 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
         <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-black mb-4">Loved by Students.</h2>
               <p className="text-xl font-medium opacity-60">Join thousands of students saving time every day.</p>
            </div>
            
            <div className="flex justify-center">
               <UniqueTestimonial testimonials={testimonials} />
            </div>
         </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className={`py-32 relative z-20 ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
         <div className="max-w-3xl mx-auto px-8">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-black mb-4">Got Questions?</h2>
               <p className="text-xl font-medium opacity-60">Everything you need to know about Canteen Rush.</p>
            </div>

            <div className="flex flex-col gap-4">
               {faqs.map((faq, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className={`border rounded-2xl overflow-hidden transition-colors ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}
                  >
                     <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full px-6 py-6 flex items-center justify-between font-black text-left focus:outline-none"
                     >
                        <span className="text-lg pr-8">{faq.q}</span>
                        {openFaq === i ? <Minus className="text-amber-500 shrink-0" /> : <Plus className="text-slate-400 shrink-0" />}
                     </button>
                     <AnimatePresence>
                        {openFaq === i && (
                           <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-6 pb-6"
                           >
                              <p className="opacity-70 font-medium leading-relaxed">{faq.a}</p>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 8. VENDOR CTA */}
      <section className="py-24 relative z-20 bg-amber-500 text-slate-900 overflow-hidden">
         <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
               <h2 className="text-4xl md:text-5xl font-black mb-4">Run a campus canteen?</h2>
               <p className="text-xl font-bold opacity-80 mb-8">Join the Canteen Rush network. Manage orders seamlessly, reduce counter chaos, and boost your daily sales.</p>
               <Link to="/admin" className="px-8 py-4 rounded-full bg-slate-900 text-white font-black text-lg hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-2xl">
                 Go to Vendor Portal <ArrowRight size={20} />
               </Link>
            </div>
            <div className="hidden md:flex w-32 h-32 rounded-full border-8 border-slate-900/10 items-center justify-center">
              <Store size={48} className="opacity-80" />
            </div>
         </div>
      </section>

      {/* APP INSTALL CTA */}
      <section className={`py-32 relative z-20 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} border-t border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Take Canteen Rush with you.</h2>
            <p className="text-xl font-medium opacity-70 mb-10 leading-relaxed">Add our incredibly fast Progressive Web App (PWA) to your home screen. No App Store required, zero storage taken, instant updates.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-colors shadow-xl">
                <MonitorSmartphone size={24} />
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">Install directly</div>
                  <div className="text-lg font-black leading-none">Add to Home Screen</div>
                </div>
              </button>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full flex justify-center"
          >
            <div className="relative w-64 h-[500px] bg-slate-950 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800">
              {/* Phone screen mock */}
              <div className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 rounded-b-3xl w-1/2 mx-auto"></div>
                
                <div className="p-6 pt-12 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                    <Pizza className="text-slate-950" size={32} />
                  </div>
                  <h3 className="text-white text-2xl font-black mb-2">Canteen Rush</h3>
                  <p className="text-white/50 text-sm font-medium mb-8">Ready to install</p>
                  
                  <div className="mt-auto w-full space-y-4">
                    <div className="h-12 w-full bg-white/5 rounded-full flex items-center px-4">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20"></div>
                    </div>
                    <div className="h-12 w-full bg-white/5 rounded-full flex items-center px-4">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20"></div>
                    </div>
                    <div className="h-12 w-full bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-950">
                      Install PWA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`pt-24 pb-12 relative z-20 ${darkMode ? 'bg-slate-950 border-t border-slate-900' : 'bg-slate-900 text-white'}`}>
         <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
              {/* Brand Col */}
              <div className="md:col-span-12 lg:col-span-3 flex flex-col items-start">
                <span className="text-3xl font-black tracking-tight mb-4">
                  Canteen<span className="text-amber-500">Rush</span>
                </span>
                <p className="font-medium opacity-60 text-sm mb-6 max-w-xs leading-relaxed">
                  Elevating the campus dining experience through seamless technology, pre-ordering, and live analytics.
                </p>
                <div className="flex flex-col gap-3 mb-8 opacity-60 text-sm font-medium">
                  <span className="flex items-center gap-2"><MapPin size={16} className="text-amber-500" /> Student Union Building, Rm 104</span>
                  <span className="flex items-center gap-2"><Phone size={16} className="text-amber-500" /> +1 (800) 555-0199</span>
                  <span className="flex items-center gap-2"><Mail size={16} className="text-amber-500" /> hello@canteenrush.edu</span>
                </div>
                <div className="flex items-center gap-3">
                  <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500 hover:text-slate-900 transition-colors flex items-center justify-center">
                    <MessageCircle size={16} />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500 hover:text-slate-900 transition-colors flex items-center justify-center">
                    <Globe size={16} />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500 hover:text-slate-900 transition-colors flex items-center justify-center">
                    <Share2 size={16} />
                  </a>
                </div>
              </div>

              {/* Links Col 1 - Product */}
              <div className="md:col-span-3 lg:col-span-2">
                <h4 className="text-sm font-black uppercase tracking-wider mb-6 text-white/40">Product</h4>
                <div className="flex flex-col gap-4 font-bold opacity-80 text-sm">
                  <a href="#pulse" className="hover:text-amber-500 hover:opacity-100 transition-colors inline-flex items-center gap-1 group">
                    Live Pulse <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                  </a>
                  <a href="#trending" className="hover:text-amber-500 hover:opacity-100 transition-colors inline-flex items-center gap-1 group">
                    Trending <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                  </a>
                  <a href="#wallet" className="hover:text-amber-500 hover:opacity-100 transition-colors inline-flex items-center gap-1 group">
                    Wallet <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                  </a>
                  <a href="/admin" className="hover:text-amber-500 hover:opacity-100 transition-colors inline-flex items-center gap-1 group">
                    Vendor Portal <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                  </a>
                </div>
              </div>

              {/* Links Col 2 - Company */}
              <div className="md:col-span-3 lg:col-span-2">
                <h4 className="text-sm font-black uppercase tracking-wider mb-6 text-white/40">Company</h4>
                <div className="flex flex-col gap-4 font-bold opacity-80 text-sm">
                  <a href="#" className="hover:text-amber-500 hover:opacity-100 transition-colors">About Us</a>
                  <a href="#" className="hover:text-amber-500 hover:opacity-100 transition-colors">Careers</a>
                  <a href="#" className="hover:text-amber-500 hover:opacity-100 transition-colors">Blog</a>
                  <a href="#" className="hover:text-amber-500 hover:opacity-100 transition-colors">Press</a>
                </div>
              </div>

              {/* Links Col 3 - Resources */}
              <div className="md:col-span-3 lg:col-span-2">
                <h4 className="text-sm font-black uppercase tracking-wider mb-6 text-white/40">Resources</h4>
                <div className="flex flex-col gap-4 font-bold opacity-80 text-sm">
                  <a href="#" className="hover:text-amber-500 hover:opacity-100 transition-colors">Help Center</a>
                  <a href="#" className="hover:text-amber-500 hover:opacity-100 transition-colors">System Status</a>
                  <a href="#" className="hover:text-amber-500 hover:opacity-100 transition-colors">API Docs</a>
                  <a href="#" className="hover:text-amber-500 hover:opacity-100 transition-colors">Canteen Guide</a>
                </div>
              </div>

              {/* Newsletter Col */}
              <div className="md:col-span-12 lg:col-span-3">
                <h4 className="text-sm font-black uppercase tracking-wider mb-6 text-white/40">Stay in the loop</h4>
                <p className="font-medium opacity-60 text-sm mb-4">Get updates on new features and canteens.</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center w-full relative">
                    <Mail className="absolute left-4 text-white/30" size={16} />
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-colors text-sm font-medium placeholder:text-white/30 text-white"
                    />
                  </div>
                  <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/10 mb-8"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold opacity-40">
              <p>© 2026 Canteen Rush. All rights reserved.</p>
              <div className="flex items-center gap-8">
                <a href="#" className="hover:opacity-100 hover:text-amber-500 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:opacity-100 hover:text-amber-500 transition-colors">Terms of Service</a>
                <a href="#" className="hover:opacity-100 hover:text-amber-500 transition-colors">Cookie Policy</a>
              </div>
            </div>
         </div>
      </footer>
      
    </div>
  );
}
