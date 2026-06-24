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
      <main ref={mainRef} className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative z-0 ${isTrackPage ? 'bg-slate-900' : ''}`}>
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
        <div className="flex-none bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] px-6 py-3 pb-6 rounded-t-3xl z-50 transition-colors duration-300">
          <nav className="flex justify-between items-center">
            <Link to="/" className={`flex flex-col items-center gap-1 transition-all ${location.pathname === '/' ? 'text-christ dark:text-amber-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-christ'}`}>
              <Home size={22} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Home</span>
            </Link>
            <Link to="/explore" className={`flex flex-col items-center gap-1 transition-all ${location.pathname === '/explore' ? 'text-christ dark:text-amber-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-christ'}`}>
              <Search size={22} strokeWidth={location.pathname === '/explore' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Explore</span>
            </Link>
            <Link to="/orders" className={`flex flex-col items-center gap-1 transition-all ${location.pathname === '/orders' ? 'text-christ dark:text-amber-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-christ'}`}>
              <ReceiptText size={22} strokeWidth={location.pathname === '/orders' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Orders</span>
            </Link>
            <Link to="/cart" className={`flex flex-col items-center gap-1 relative transition-all ${location.pathname === '/cart' ? 'text-christ dark:text-amber-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-christ'}`}>
              <div className="relative">
                <ShoppingBag size={22} strokeWidth={location.pathname === '/cart' ? 2.5 : 2} />
                {cartItems > 0 && <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-pop">{cartItems}</span>}
              </div>
              <span className="text-[10px] font-bold">Cart</span>
            </Link>
            <Link to="/profile" className={`flex flex-col items-center gap-1 transition-all ${location.pathname === '/profile' ? 'text-christ dark:text-amber-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-christ'}`}>
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