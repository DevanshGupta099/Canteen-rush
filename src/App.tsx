import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, ReceiptText, ShoppingBag, User, Search } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import CanteensPage from './pages/CanteensPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const MenuPage = lazy(() => import('./pages/MenuPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const TrackerPage = lazy(() => import('./pages/TrackerPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WalletPage = lazy(() => import('./pages/WalletPage'));
const AppSettingsPage = lazy(() => import('./pages/AppSettingsPage'));
const PaymentMethodsPage = lazy(() => import('./pages/PaymentMethodsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const PassesPage = lazy(() => import('./pages/PassesPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const VendorDashboardPage = lazy(() => import('./pages/VendorDashboardPage'));
const LocationPage = lazy(() => import('./pages/LocationPage'));
const DesktopLandingPage = lazy(() => import('./pages/DesktopLandingPage'));
import { useStore } from './store/useStore';
import { useMediaQuery } from './hooks/useMediaQuery';

function AppContent() {
  const location = useLocation();
  const cart = useStore(state => state.cart);
  const darkMode = useStore(state => state.darkMode);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const cartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const hideBottomNav = ['/track', '/checkout', '/cart', '/login', '/signup', '/admin'].some(path => location.pathname.includes(path));
  const isTrackPage = location.pathname.includes('/track');
  const fetchOrders = useStore(state => state.fetchOrders);
  const fetchWallet = useStore(state => state.fetchWallet);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showDesktopLanding = isDesktop && !isAdminRoute;

  useEffect(() => {
    if (showDesktopLanding) {
      document.getElementById('root')?.classList.add('desktop-landing-active');
    } else {
      document.getElementById('root')?.classList.remove('desktop-landing-active');
    }
  }, [showDesktopLanding]);

  useEffect(() => {
    if (isAuthenticated) {
      import('./lib/firebase').then(({ auth }) => {
        import('firebase/auth').then(({ onAuthStateChanged }) => {
          onAuthStateChanged(auth, (user) => {
            if (user || useStore.getState().userProfile?.email === 'devansh.gupta@christuniversity.in') {
              fetchOrders();
              fetchWallet();
            }
          });
        });
      });
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

  if (showDesktopLanding) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-4 border-christ border-t-transparent rounded-full animate-spin"></div></div>}>
        <DesktopLandingPage />
      </Suspense>
    );
  }

  if (!isAuthenticated) {
    const authBackground = darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800';
    return (
      <div className={`flex flex-col h-full relative transition-colors duration-300 ${authBackground}`}>
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: '16px', background: '#333', color: '#fff', fontSize: '14px', fontWeight: 'bold' } }} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative z-0">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-4 border-christ border-t-transparent rounded-full animate-spin"></div></div>}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<VendorDashboardPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
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
      <main ref={mainRef} className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative z-0 ${isTrackPage ? 'bg-slate-900' : ''} ${!hideBottomNav ? 'pb-28' : ''}`}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-4 border-christ border-t-transparent rounded-full animate-spin"></div></div>}>
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
            <Route path="/location" element={<LocationPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!hideBottomNav && (
        <div className="absolute bottom-6 left-4 right-4 z-50">
          {/* Glass background layer - isolated from transition properties to prevent Safari WebKit backdrop-filter glitches */}
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl -webkit-backdrop-blur-xl rounded-full border border-slate-200/60 dark:border-slate-800/80 shadow-[0_12px_36px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] pointer-events-none" />
          
          <nav className="relative z-10 flex justify-between items-center px-3 py-2">
            <Link to="/" className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-full transition-all duration-300 ${location.pathname === '/' ? 'bg-christ/10 dark:bg-amber-400/10 text-christ dark:text-amber-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-christ dark:hover:text-amber-400 hover:scale-105'}`}>
              <Home size={20} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
              <span className="text-[9px] font-black tracking-wider uppercase">Home</span>
            </Link>
            <Link to="/explore" className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-full transition-all duration-300 ${location.pathname === '/explore' ? 'bg-christ/10 dark:bg-amber-400/10 text-christ dark:text-amber-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-christ dark:hover:text-amber-400 hover:scale-105'}`}>
              <Search size={20} strokeWidth={location.pathname === '/explore' ? 2.5 : 2} />
              <span className="text-[9px] font-black tracking-wider uppercase">Explore</span>
            </Link>
            <Link to="/orders" className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-full transition-all duration-300 ${location.pathname === '/orders' ? 'bg-christ/10 dark:bg-amber-400/10 text-christ dark:text-amber-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-christ dark:hover:text-amber-400 hover:scale-105'}`}>
              <ReceiptText size={20} strokeWidth={location.pathname === '/orders' ? 2.5 : 2} />
              <span className="text-[9px] font-black tracking-wider uppercase">Orders</span>
            </Link>
            <Link to="/cart" className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-full transition-all duration-300 ${location.pathname === '/cart' ? 'bg-christ/10 dark:bg-amber-400/10 text-christ dark:text-amber-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-christ dark:hover:text-amber-400 hover:scale-105'}`}>
              <div className="relative">
                <ShoppingBag size={20} strokeWidth={location.pathname === '/cart' ? 2.5 : 2} />
                {cartItems > 0 && <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-slate-900 animate-pop">{cartItems}</span>}
              </div>
              <span className="text-[9px] font-black tracking-wider uppercase">Cart</span>
            </Link>
            <Link to="/profile" className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-full transition-all duration-300 ${location.pathname === '/profile' ? 'bg-christ/10 dark:bg-amber-400/10 text-christ dark:text-amber-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-christ dark:hover:text-amber-400 hover:scale-105'}`}>
              <User size={20} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
              <span className="text-[9px] font-black tracking-wider uppercase">Profile</span>
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