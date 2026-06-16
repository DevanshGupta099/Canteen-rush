import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, ReceiptText, ShoppingBag, User, Search } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import CanteensPage from './pages/CanteensPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import TrackerPage from './pages/TrackerPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import WalletPage from './pages/WalletPage';
import { useStore } from './store/useStore';
import AppSettingsPage from './pages/AppSettingsPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import SupportPage from './pages/SupportPage';
import ExplorePage from './pages/ExplorePage';
import PassesPage from './pages/PassesPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminLoginPage from './pages/AdminLoginPage';
import VendorDashboardPage from './pages/VendorDashboardPage';

function AppContent() {
  const location = useLocation();
  const cart = useStore(state => state.cart);
  const darkMode = useStore(state => state.darkMode);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const cartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const hideBottomNav = ['/track', '/checkout', '/cart', '/login', '/signup'].some(path => location.pathname.includes(path));
  const isTrackPage = location.pathname.includes('/track');
  const fetchOrders = useStore(state => state.fetchOrders);
  const fetchWallet = useStore(state => state.fetchWallet);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchWallet();
    }
  }, [isAuthenticated, fetchOrders, fetchWallet]);

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (mainEl) {
      mainEl.scrollTop = 0;
      
      const rafId = requestAnimationFrame(() => {
        mainEl.scrollTop = 0;
      });

      const timer = setTimeout(() => {
        mainEl.scrollTop = 0;
      }, 50);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timer);
      };
    }
  }, [location.pathname]);

  if (!isAuthenticated) {
    const authBackground = darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800';
    return (
      <div className={`flex flex-col h-full relative transition-colors duration-300 ${authBackground}`}>
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: '16px', background: '#333', color: '#fff', fontSize: '14px', fontWeight: 'bold' } }} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative z-0">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<VendorDashboardPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  const appBackground = isTrackPage 
    ? 'bg-slate-900 text-white dark' 
    : (darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800');

  return (
    <div className={`flex flex-col h-full relative transition-colors duration-300 ${appBackground}`}>
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '16px', background: '#333', color: '#fff', fontSize: '14px', fontWeight: 'bold' } }} />
      
      {/* Scrollable Main Area */}
      <main ref={mainRef} className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative z-0 ${isTrackPage ? 'bg-slate-900' : ''}`}>
        <Routes>
          <Route path="/" element={<CanteensPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payments" element={<PaymentMethodsPage />} />
          <Route path="/settings" element={<AppSettingsPage />} />
          <Route path="/passes" element={<PassesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/canteen/:id" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/track/:orderId" element={<TrackerPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<VendorDashboardPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideBottomNav && (
        <div className="flex-none bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] px-6 py-3 pb-6 rounded-t-3xl z-50 transition-colors duration-300">
          <nav className="flex justify-between items-center">
            <Link to="/" className={`flex flex-col items-center gap-1 transition-all ${location.pathname === '/' ? 'text-christ dark:text-amber-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}>
              <Home size={22} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Home</span>
            </Link>
            <Link to="/explore" className={`flex flex-col items-center gap-1 transition-all ${location.pathname === '/explore' ? 'text-christ dark:text-amber-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}>
              <Search size={22} strokeWidth={location.pathname === '/explore' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Explore</span>
            </Link>
            <Link to="/orders" className={`flex flex-col items-center gap-1 transition-all ${location.pathname === '/orders' ? 'text-christ dark:text-amber-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}>
              <ReceiptText size={22} strokeWidth={location.pathname === '/orders' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Orders</span>
            </Link>
            <Link to="/cart" className={`flex flex-col items-center gap-1 relative transition-all ${location.pathname === '/cart' ? 'text-christ dark:text-amber-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}>
              <div className="relative">
                <ShoppingBag size={22} strokeWidth={location.pathname === '/cart' ? 2.5 : 2} />
                {cartItems > 0 && <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-pop">{cartItems}</span>}
              </div>
              <span className="text-[10px] font-bold">Cart</span>
            </Link>
            <Link to="/profile" className={`flex flex-col items-center gap-1 transition-all ${location.pathname === '/profile' ? 'text-christ dark:text-amber-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}>
              <User size={22} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Profile</span>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}