import { create } from 'zustand';
import toast from 'react-hot-toast';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  prepTime: number;
  image: string;
  type: 'veg' | 'non-veg';
  category: string;
  tag?: string;
  isSoldOut?: boolean;
  stock?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  modifiers?: { name: string; extraPrice: number }[];
  canteenId?: string;
};
export type CanteenReview = { id: string; user: string; rating: number; comment: string; date: string };
export type Canteen = { id: string; name: string; description: string; image: string; waitTime: string; rating: number; totalRatings: number; menu: MenuItem[]; isActive?: boolean; isOpen?: boolean; reviews?: CanteenReview[] };
export type CartItem = MenuItem & { quantity: number; selectedModifiers?: { name: string; extraPrice: number }[] };
export type SavedCard = { id: number; type: string; last4: string; expiry: string };
export type MealPass = { id: string; name: string; type: 'lunch' | 'coffee'; daysLeft: number; lastUsedDate?: string };

export const getFoodEmoji = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('coffee') || n.includes('shake') || n.includes('cooler') || n.includes('drink') || n.includes('soda') || n.includes('lassi') || n.includes('lime') || n.includes('milkshake') || n.includes('cold brew')) return '🥤';
  if (n.includes('pizza')) return '🍕';
  if (n.includes('burger')) return '🍔';
  if (n.includes('noodle') || n.includes('pasta')) return '🍜';
  if (n.includes('roll') || n.includes('wrap')) return '🌯';
  if (n.includes('rice') || n.includes('biryani') || n.includes('bowl')) return '🍛';
  if (n.includes('puff') || n.includes('pastry') || n.includes('samosa') || n.includes('fritter') || n.includes('pori') || n.includes('pazham')) return '🥐';
  if (n.includes('chicken') || n.includes('tikka') || n.includes('kabab')) return '🍗';
  if (n.includes('paneer') || n.includes('masala') || n.includes('curry')) return '🍲';
  if (n.includes('sandwich') || n.includes('toast') || n.includes('bread') || n.includes('cheese')) return '🥪';
  return '🍽️';
};



interface AppState {
  cart: CartItem[];
  favorites: string[];
  walletBalance: number;
  orderType: 'dine-in' | 'takeaway';
  activeOrderId: string | null;
  pastOrders: { id: string; date: string; amount: number; items: number; status?: 'preparing' | 'ready' | 'delivered' | 'cancelled'; itemIds?: string[]; createdAt?: string; queuePosition?: number; isRated?: boolean }[];
  savedCards: SavedCard[];
  darkMode: boolean;
  selectedLocation: string;
  canteens: Canteen[];
  
  // User Credentials & Auth State
  isAuthenticated: boolean;
  userProfile: {
    name: string;
    regNo: string;
    email: string;
    phone: string;
    avatarUrl: string;
  };
  users: {
    name: string;
    regNo: string;
    email: string;
    phone: string;
    password: string;
    avatarUrl: string;
  }[];
  
  // Roadmap State Extension
  rushCoins: number;
  streakDays: number;
  activePasses: MealPass[];
  outOfStockItems: string[];
  scheduledPickup: string | null; // e.g. "11:15 AM"
  splitBillFriends: string[];
  tableNumber: string | null;
  autoTopUp: boolean;
  canteenCrowd: Record<string, 'low' | 'moderate' | 'high'>;
  queuePosition: number;

  // New Student Roadmap Expansion States
  activePromoDiscount: number; // e.g. 20 for 20% discount
  groupOrderActive: boolean;
  groupLink: string | null;
  groupMembers: { name: string; item: string; price: number }[];
  deliveryOption: 'pickup' | 'hostel';
  deliveryAddress: string;
  weeklyNutrients: { calories: number; protein: number; carbs: number };
  calorieGoal: number;

  addToCart: (item: MenuItem, selectedModifiers?: { name: string; extraPrice: number }[]) => void;
  decreaseQuantity: (id: string) => void;
  toggleFavorite: (id: string) => Promise<void>;
  rateOrder?: (orderId: string, rating: number, review?: string) => Promise<void>;
  setOrderType: (type: 'dine-in' | 'takeaway') => void;
  placeOrder: (totalCost: number, paymentMethod: string) => Promise<string>;
  addWalletBalance: (amount: number) => Promise<void>;
  fetchWallet: () => Promise<void>;
  cancelOrder: (orderId: string, amount: number) => Promise<void>;
  reorder: (orderId: string) => void;
  addSavedCard: (card: Omit<SavedCard, 'id'>) => void;
  removeSavedCard: (id: number) => void;
  toggleDarkMode: () => void;
  
  // Roadmap Actions
  addRushCoins: (amount: number) => void;
  redeemCoins: (cost: number) => boolean;
  purchasePass: (passName: string, price: number, type: 'lunch' | 'coffee') => boolean;
  redeemPass: (passId: string) => boolean;
  setScheduledPickup: (time: string | null) => void;
  setSplitBillFriends: (friends: string[]) => void;
  setTableNumber: (table: string | null) => void;
  toggleAutoTopUp: () => void;
  decrementQueue: () => void;
  resetQueue: (pos?: number) => void;
  incrementStreak: () => void;

  // New Student Roadmap Expansion Actions
  applyPromo: (code: string) => boolean;
  resetPromo: () => void;
  toggleGroupOrder: () => void;
  joinGroupMember: (name: string, item: string, price: number) => void;
  setDeliveryOption: (opt: 'pickup' | 'hostel') => void;
  setDeliveryAddress: (addr: string) => void;
  setCalorieGoal: (kcal: number) => void;

  // Review & Rating Actions
  addReview: (canteenId: string, orderId: string, rating: number, comment: string) => void;

  // Vendor Portal Actions
  updateDishStatus: (canteenId: string, itemId: string, isSoldOut: boolean) => void;
  updateDishStock: (canteenId: string, itemId: string, stock: number) => Promise<void>;
  updateDishPrice: (canteenId: string, itemId: string, price: number, originalPrice?: number | undefined) => void;
  addDish: (canteenId: string, dish: Omit<MenuItem, 'id'>) => void;
  updateOrderStatus: (orderId: string, status: 'preparing' | 'ready' | 'delivered' | 'cancelled') => Promise<void>;
  updateCanteenStatus: (canteenId: string, isOpen: boolean) => void;

  // Auth & Profile Actions
  login: (email: string, password: string) => Promise<boolean>;
  loginGuest: () => Promise<boolean>;
  signup: (user: { name: string; regNo: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<AppState['userProfile']>) => Promise<void>;
  fetchCanteens: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  setSelectedLocation: (loc: string) => void;
}

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('canteen_rush_user');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return {
    name: 'Devansh Gupta',
    regNo: '21BCA404',
    email: 'devansh.gupta@christuniversity.in',
    phone: '+91 98765 43210',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devansh'
  };
};

const initialUser = getInitialUser();
const isAuth = typeof window !== 'undefined' ? !!localStorage.getItem('canteen_rush_user') : false;

export const useStore = create<AppState>((set, get) => ({
  cart: [],
  favorites: ['m8', 'm10', 'm14'],
  walletBalance: 850.00,
  orderType: 'takeaway',
  activeOrderId: null,
  pastOrders: [
    { id: 'CR-4921', date: 'Today, 11:30 AM', amount: 140, items: 2, status: 'delivered', itemIds: ['m1', 'm3'] },
    { id: 'CR-1029', date: 'Yesterday, 1:15 PM', amount: 250, items: 2, status: 'delivered', itemIds: ['m4', 'm14'] },
    { id: 'CR-0881', date: 'Monday, 9:00 AM', amount: 50, items: 1, status: 'delivered', itemIds: ['m3'] },
  ],
  savedCards: [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/28' },
    { id: 2, type: 'Mastercard', last4: '8812', expiry: '09/27' }
  ],
  darkMode: false,
  selectedLocation: 'Central Campus',
  canteens: [],

  // Auth State Default Data
  isAuthenticated: isAuth,
  userProfile: initialUser,
  users: [
    {
      name: 'Devansh Gupta',
      regNo: '21BCA404',
      email: 'devansh.gupta@christuniversity.in',
      phone: '+91 98765 43210',
      password: 'password123',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devansh'
    }
  ],

  // Roadmap State Extension Default Data
  rushCoins: 240,
  streakDays: 4,
  activePasses: [],
  outOfStockItems: ['m2', 'm11'],
  scheduledPickup: null,
  splitBillFriends: [],
  tableNumber: null,
  autoTopUp: false,
  canteenCrowd: {
    'ivy-hall': 'moderate',
    'the-gourmet': 'high',
    'birds-park-kiosk': 'low',
    'christ-bakery': 'high',
    'block-iv': 'moderate',
    'nandini': 'low',
    'michaels': 'moderate',
    'fresh-cafe': 'low'
  },
  queuePosition: 4,

  // New Student Roadmap Expansion Default Data
  activePromoDiscount: 0,
  groupOrderActive: false,
  groupLink: null,
  groupMembers: [],
  deliveryOption: 'pickup',
  deliveryAddress: 'Block IV hostel, Room 402',
  weeklyNutrients: { calories: 1240, protein: 55, carbs: 160 },
  calorieGoal: 2000,

  addToCart: (item, selectedModifiers = []) => set((state) => {
    // Generate a unique ID if there are modifiers, so they don't stack with the same item without modifiers
    const cartItemId = selectedModifiers.length > 0 
      ? `${item.id}-${selectedModifiers.map(m => m.name).sort().join('-')}` 
      : item.id;
      
    const existingItem = state.cart.find(c => c.id === cartItemId);
    if (existingItem) {
      return { cart: state.cart.map(c => c.id === cartItemId ? { ...c, quantity: c.quantity + 1 } : c) };
    }
    
    return { 
      cart: [...state.cart, { 
        ...item, 
        id: cartItemId, // Override ID for cart array
        originalItemId: item.id, // Keep a reference to the original
        quantity: 1, 
        selectedModifiers,
        price: item.price + selectedModifiers.reduce((sum, mod) => sum + mod.extraPrice, 0)
      }] 
    };
  }),
  decreaseQuantity: (id) => set((state) => ({
    cart: state.cart.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c).filter(c => c.quantity > 0)
  })),
  removeFromCart: (id: string) => set((state) => ({ cart: state.cart.filter(item => item.id !== id) })),
  toggleFavorite: async (id) => {
    // Optimistic local update
    set((state) => ({
      favorites: state.favorites.includes(id) 
        ? state.favorites.filter(fid => fid !== id) 
        : [...state.favorites, id]
    }));
    
    // API Call
    const token = localStorage.getItem('canteen_rush_token');
    if (token) {
      try {
        await fetch('https://canteen-rush-1.onrender.com/api/users/favorites/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ productId: id })
        });
      } catch (e) {
        console.error("Failed to sync favorite to backend:", e);
      }
    }
  },
  
  rateOrder: async (orderId, rating, review = '') => {
    const token = localStorage.getItem('canteen_rush_token');
    if (token) {
      try {
        const res = await fetch(`https://canteen-rush-1.onrender.com/api/orders/${orderId}/rate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ rating, review })
        });
        if (res.ok) {
          set((state) => ({
            pastOrders: state.pastOrders.map(o => o.id === orderId ? { ...o, isRated: true } : o)
          }));
        }
      } catch (e) {
        console.error("Failed to rate order:", e);
      }
    }
  },
  setSelectedLocation: (loc: string) => set({ selectedLocation: loc }),
  setOrderType: (type) => set({ orderType: type }),
  placeOrder: async (totalCost, paymentMethod) => {
    const state = get();
    let orderId = 'CR-' + Math.floor(1000 + Math.random() * 9000);
    const addedCoins = Math.floor(totalCost * 0.1); 
    
    const payload = {
      id: orderId,
      amount: totalCost,
      items: state.cart.reduce((sum, item) => sum + item.quantity, 0),
      itemIds: state.cart.flatMap(item => Array(item.quantity).fill(item.id))
    };

    try {
      const token = localStorage.getItem('canteen_rush_token');
      if (token) {
        try {
          const res = await fetch('https://canteen-rush-1.onrender.com/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              items: state.cart.map(i => ({ productId: i.id, quantity: i.quantity, name: i.name, price: i.price })),
              totalAmount: totalCost,
              type: state.orderType,
              deliveryAddress: state.deliveryAddress,
              tableNumber: state.tableNumber,
              canteenId: state.cart[0]?.canteenId,
              paymentMethod
            })
          });
          if (res.ok) {
            const data = await res.json();
            orderId = data._id; // Use MongoDB ID for tracker
          }
        } catch (apiErr) {
          console.error("API write failed. Saving locally.", apiErr);
        }
      }

      if (paymentMethod === 'wallet') {
        let finalWalletBalance = state.walletBalance - totalCost;
        if (finalWalletBalance < 100 && state.autoTopUp) {
          finalWalletBalance += 500;
          setTimeout(() => {
            toast.success('Auto-Refilled ₹500 from your default card!', { icon: '🔄' });
          }, 1000);
        }
        set({ walletBalance: finalWalletBalance });
      }

      // Calculate calorie injection for nutrition dashboard
      let orderCalories = 0;
      state.cart.forEach(item => {
        const itemCal = (item.price * 2) + 120; // mock cal based on price
        orderCalories += itemCal * item.quantity;
      });

      // Stock update logic
      const updatedCanteens = state.canteens.map(c => {
         let menuChanged = false;
         const newMenu = c.menu.map(m => {
            const inCart = state.cart.find(ci => ci.id === m.id);
            if (inCart && m.stock !== undefined) {
               menuChanged = true;
               const newStock = Math.max(0, m.stock - inCart.quantity);
               return { ...m, stock: newStock, isSoldOut: newStock === 0 ? true : m.isSoldOut };
            }
            return m;
         });
         return menuChanged ? { ...c, menu: newMenu } : c;
      });

      set({ 
        cart: [], 
        canteens: updatedCanteens,
        activeOrderId: orderId,
        rushCoins: state.rushCoins + addedCoins,
        queuePosition: 5, 
        weeklyNutrients: {
          ...state.weeklyNutrients,
          calories: state.weeklyNutrients.calories + orderCalories
        },
        activePromoDiscount: 0,
      });

      // Add to past orders locally for immediate UI update
      set((prev) => ({
        pastOrders: [
          { id: orderId, date: 'Just now', amount: totalCost, items: payload.items, status: 'preparing', itemIds: payload.itemIds },
          ...prev.pastOrders
        ]
      }));

      return orderId;
    } catch (e) {
      console.error(e);
    }
    return '';
  },
  addWalletBalance: async (amount) => {
    set((state) => ({ walletBalance: state.walletBalance + amount }));
  },
  fetchWallet: async () => {
    // local state handles this now
  },
  cancelOrder: async (orderId, amount) => {
    const state = get();
    const refundedCoins = Math.floor(amount * 0.1);
    
    const token = localStorage.getItem('canteen_rush_token');
    if (token) {
      try {
        await fetch(`https://canteen-rush-1.onrender.com/api/orders/${orderId}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        console.error("Failed to cancel via API:", e);
      }
    }
    
    set({
      walletBalance: state.walletBalance + amount,
      activeOrderId: state.activeOrderId === orderId ? null : state.activeOrderId,
      rushCoins: Math.max(0, state.rushCoins - refundedCoins),
      pastOrders: state.pastOrders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
    });
  },
  reorder: (orderId) => set((state) => {
    const order = state.pastOrders.find(o => o.id === orderId);
    if (!order || !order.itemIds) return {};
    
    // Append to existing cart, handling duplicates
    const newCart = [...state.cart];
    order.itemIds.forEach(id => {
      const foundItem = state.canteens.flatMap(c => c.menu || []).find(m => m.id === id);
      if (foundItem && !foundItem.isSoldOut) {
        const exists = newCart.find(c => c.id === id);
        if (exists) {
          exists.quantity += 1;
        } else {
          newCart.push({ ...foundItem, quantity: 1 });
        }
      }
    });
    
    return { cart: newCart };
  }),
  addSavedCard: (card) => set((state) => ({
    savedCards: [...state.savedCards, { ...card, id: Math.floor(Date.now() + Math.random() * 1000) }]
  })),
  removeSavedCard: (id) => set((state) => ({
    savedCards: state.savedCards.filter(c => c.id !== id)
  })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // Roadmap Actions
  addRushCoins: (amount) => set((state) => ({ rushCoins: state.rushCoins + amount })),
  redeemCoins: (cost) => {
    const state = get();
    if (state.rushCoins >= cost) {
      set({ rushCoins: state.rushCoins - cost });
      return true;
    }
    return false;
  },
  purchasePass: (passName, price, type) => {
    const state = get();
    if (state.walletBalance >= price) {
      const newPass: MealPass = {
        id: 'PASS-' + Math.floor(100 + Math.random() * 900),
        name: passName,
        type,
        daysLeft: 30
      };
      set({
        walletBalance: state.walletBalance - price,
        activePasses: [...state.activePasses, newPass]
      });
      return true;
    }
    return false;
  },
  redeemPass: (passId) => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    let success = false;

    const updatedPasses = state.activePasses.map(pass => {
      if (pass.id === passId) {
        if (pass.lastUsedDate !== today && pass.daysLeft > 0) {
          success = true;
          return { ...pass, lastUsedDate: today, daysLeft: pass.daysLeft - 1 };
        }
      }
      return pass;
    });

    if (success) {
      set({ activePasses: updatedPasses.filter(p => p.daysLeft > 0) });
    }
    return success;
  },
  setScheduledPickup: (time) => set({ scheduledPickup: time }),
  setSplitBillFriends: (friends) => set({ splitBillFriends: friends }),
  setTableNumber: (table) => set({ tableNumber: table }),
  toggleAutoTopUp: () => set((state) => ({ autoTopUp: !state.autoTopUp })),
  decrementQueue: () => set((state) => ({ queuePosition: Math.max(1, state.queuePosition - 1) })),
  resetQueue: (pos = 4) => set({ queuePosition: pos }),
  incrementStreak: () => set((state) => ({ streakDays: state.streakDays + 1 })),

  // New Student Roadmap Expansion Actions
  applyPromo: (code) => {
    if (code.toUpperCase() === 'CHRIST20') {
      set({ activePromoDiscount: 20 });
      return true;
    }
    return false;
  },
  resetPromo: () => set({ activePromoDiscount: 0 }),
  toggleGroupOrder: () => set((state) => {
    const active = !state.groupOrderActive;
    return {
      groupOrderActive: active,
      groupLink: active ? 'canteenrush.christ/group/ivy-hall-' + Math.floor(100 + Math.random() * 900) : null,
      groupMembers: active ? [
        { name: 'You', item: 'Cold Coffee', price: 50 }
      ] : []
    };
  }),
  joinGroupMember: (name, item, price) => set((state) => ({
    groupMembers: [...state.groupMembers, { name, item, price }]
  })),
  setDeliveryOption: (opt) => set({ deliveryOption: opt }),
  setDeliveryAddress: (addr) => set({ deliveryAddress: addr }),
  setCalorieGoal: (kcal) => set({ calorieGoal: kcal }),

  // Review & Rating Actions Implementation
  addReview: (canteenId, orderId, rating, comment) => set((state) => {
    const newReview = { id: `rev-${Math.floor(Math.random() * 10000)}`, user: state.userProfile.name, rating, comment, date: new Date().toLocaleDateString() };
    return {
      canteens: state.canteens.map(c => {
        if (c.id === canteenId) {
          const updatedReviews = [...(c.reviews || []), newReview];
          const newAvgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return { ...c, reviews: updatedReviews, rating: newAvgRating, totalRatings: c.totalRatings + 1 };
        }
        return c;
      }),
      pastOrders: state.pastOrders.map(o => o.id === orderId ? { ...o, isRated: true } : o)
    };
  }),

  // Vendor Portal Actions Implementation
  updateDishStatus: async (canteenId, itemId, isSoldOut) => {
    set((state) => ({
      canteens: state.canteens.map(c => c.id === canteenId ? {
        ...c,
        menu: c.menu.map(m => m.id === itemId ? { ...m, isSoldOut } : m)
      } : c)
    }));
    const token = localStorage.getItem('admin_token') || localStorage.getItem('canteen_rush_token');
    if (token) {
      try {
        await fetch(`https://canteen-rush-1.onrender.com/api/products/${itemId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ isSoldOut })
        });
      } catch (e) { console.error(e); }
    }
  },
  updateDishStock: async (canteenId, itemId, stock) => {
    // Optimistic local update
    set((state) => ({
      canteens: state.canteens.map(c => c.id === canteenId ? {
        ...c,
        menu: c.menu.map(m => m.id === itemId ? { ...m, stock, isSoldOut: stock === 0 } : m)
      } : c)
    }));

    // API Call
    const token = localStorage.getItem('admin_token') || localStorage.getItem('canteen_rush_token');
    if (token) {
      try {
        await fetch(`https://canteen-rush-1.onrender.com/api/products/${itemId}/stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ stock })
        });
      } catch (e) {
        console.error("Failed to update stock in backend:", e);
      }
    }
  },
  updateDishPrice: async (canteenId, itemId, price, originalPrice) => {
    set((state) => ({
      canteens: state.canteens.map(c => c.id === canteenId ? {
        ...c,
        menu: c.menu.map(m => m.id === itemId ? { ...m, price, originalPrice } : m)
      } : c)
    }));
    const token = localStorage.getItem('admin_token') || localStorage.getItem('canteen_rush_token');
    if (token) {
      try {
        await fetch(`https://canteen-rush-1.onrender.com/api/products/${itemId}/price`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ price, originalPrice })
        });
      } catch (e) { console.error(e); }
    }
  },
  addDish: async (canteenId, dish) => {
    const tempId = 'm' + Math.floor(Math.random() * 10000);
    set((state) => ({
      canteens: state.canteens.map(c => c.id === canteenId ? {
        ...c,
        menu: [...c.menu, { ...dish, id: tempId }]
      } : c)
    }));
    
    const token = localStorage.getItem('admin_token') || localStorage.getItem('canteen_rush_token');
    if (token) {
      try {
        const res = await fetch(`https://canteen-rush-1.onrender.com/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ ...dish, canteenId })
        });
        if (res.ok) {
          const newProduct = await res.json();
          // Update temp ID with real DB ID
          set((state) => ({
            canteens: state.canteens.map(c => c.id === canteenId ? {
              ...c,
              menu: c.menu.map(m => m.id === tempId ? { ...m, id: newProduct._id } : m)
            } : c)
          }));
        }
      } catch (e) { console.error(e); }
    }
  },
  updateOrderStatus: async (orderId, status) => {
    const token = localStorage.getItem('canteen_rush_token');
    if (token) {
      try {
        const res = await fetch(`https://canteen-rush-1.onrender.com/api/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ status })
        });
        if (res.ok) {
          set((state) => ({
            pastOrders: state.pastOrders.map(o => o.id === orderId ? { ...o, status } : o)
          }));
        }
      } catch (e) {
        console.error("Failed to update order status via API:", e);
      }
    }
  },
  updateCanteenStatus: async (canteenId, isOpen) => {
    set((state) => ({
      canteens: state.canteens.map(c => c.id === canteenId ? { ...c, isOpen } : c)
    }));
    const token = localStorage.getItem('admin_token') || localStorage.getItem('canteen_rush_token');
    if (token) {
      try {
        await fetch(`https://canteen-rush-1.onrender.com/api/canteens/${canteenId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ isOpen })
        });
      } catch (e) { console.error(e); }
    }
  },

  // Auth & Profile Action Implementation
  login: async (email, password) => {
    try {
      const res = await fetch('https://canteen-rush-1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        const userProfile = {
          name: data.user.name,
          regNo: data.user.regNo,
          email: data.user.email,
          phone: data.user.phone,
          avatarUrl: data.user.avatarUrl
        };
        set({ isAuthenticated: true, userProfile });
        localStorage.setItem('canteen_rush_user', JSON.stringify(userProfile));
        localStorage.setItem('canteen_rush_token', data.token);
        return true;
      } else {
        toast.error(data.message || 'Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('API login error:', error);
      toast.error('Network error. Trying local offline.');
      // Local fallback
      const state = get();
      const user = state.users.find(u => u.email === email && u.password === password);
      if (user) {
        set({ isAuthenticated: true, userProfile: user });
        localStorage.setItem('canteen_rush_user', JSON.stringify(user));
        return true;
      }
      return false;
    }
  },
  loginGuest: async () => {
    const guestProfile = {
      name: 'Guest Explorer',
      regNo: 'GUEST-' + Math.floor(1000 + Math.random() * 9000),
      email: 'guest@canteenrush.com',
      phone: '+91 00000 00000',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest`
    };
    set({ isAuthenticated: true, userProfile: guestProfile });
    localStorage.setItem('canteen_rush_user', JSON.stringify(guestProfile));
    return true;
  },
  signup: async (user) => {
    try {
      const res = await fetch('https://canteen-rush-1.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      if (res.ok) {
        const userProfile = {
          name: data.user.name,
          regNo: data.user.regNo,
          email: data.user.email,
          phone: data.user.phone,
          avatarUrl: data.user.avatarUrl
        };
        set({ isAuthenticated: true, userProfile });
        localStorage.setItem('canteen_rush_user', JSON.stringify(userProfile));
        localStorage.setItem('canteen_rush_token', data.token);
        return true;
      } else {
        toast.error(data.message || 'Failed to sign up');
        return false;
      }
    } catch (error) {
      console.error('API signup error:', error);
      toast.error('Network error');
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem('canteen_rush_user');
    localStorage.removeItem('canteen_rush_token');
    set({ isAuthenticated: false, cart: [], activeOrderId: null });
  },
  updateProfile: async (profile) => {
    const state = get();
    try {
      const updatedProfile = { ...state.userProfile, ...profile };
      set({ userProfile: updatedProfile });
      localStorage.setItem('canteen_rush_user', JSON.stringify(updatedProfile));
      toast.success('Profile updated locally');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  },
  fetchCanteens: async () => {
    try {
      const [canteensRes, productsRes] = await Promise.all([
        fetch('https://canteen-rush-1.onrender.com/api/canteens'),
        fetch('https://canteen-rush-1.onrender.com/api/products/explore')
      ]);

      if (canteensRes.ok && productsRes.ok) {
        const canteensDataApi = await canteensRes.json();
        const productsData = await productsRes.json();

        const formattedCanteens = canteensDataApi.map((c: any) => {
          const menu = productsData
            .filter((p: any) => p.canteenId && p.canteenId._id === c._id)
            .map((p: any) => ({
              id: p._id,
              name: p.name,
              description: p.description,
              price: p.price,
              prepTime: p.prepTime || 5,
              type: p.isVeg ? 'veg' : 'non-veg',
              category: p.category || 'Meals',
              tag: p.isBestseller ? 'Bestseller' : undefined,
              image: p.image || '/images/rich_curry.png',
              canteenId: c._id
            }));

          return {
            id: c._id,
            name: c.name,
            waitTime: c.deliveryTime || '10-15 mins',
            rating: c.rating || 4.5,
            totalRatings: c.reviews || 0,
            isOpen: true,
            description: c.description || 'Campus Canteen',
            image: c.image || '/images/ivy_hall.png',
            menu: menu
          };
        });
        
        set({ canteens: formattedCanteens });
      }
    } catch (e) {
      console.error('Failed to fetch canteens:', e);
    }
  },
  fetchOrders: async () => {
    try {
      const token = localStorage.getItem('canteen_rush_token');
      if (!token) return;

      const res = await fetch('https://canteen-rush-1.onrender.com/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        let totalCalories = 0, totalProtein = 0, totalCarbs = 0;
        
        const orders = data.map((doc: any) => {
          // Aggregate nutritional info
          doc.items.forEach((item: any) => {
            if (item.productId && typeof item.productId === 'object') {
              totalCalories += (item.productId.calories || 0) * item.quantity;
              totalProtein += (item.productId.protein || 0) * item.quantity;
              totalCarbs += (item.productId.carbs || 0) * item.quantity;
            }
          });
          
          return {
            id: doc._id,
            createdAt: doc.timestamp,
            date: new Date(doc.timestamp).toLocaleDateString() + ' ' + new Date(doc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            amount: doc.totalAmount,
            items: doc.items.reduce((s: number, i: any) => s + i.quantity, 0),
            status: doc.status,
            itemIds: doc.items.map((i: any) => i.productId?._id || i.productId),
            queuePosition: 5
          };
        });
        set({ 
          pastOrders: orders,
          weeklyNutrients: { calories: totalCalories, protein: totalProtein, carbs: totalCarbs }
        });
      }
    } catch (e) {
      console.error('Failed to fetch past orders from API:', e);
    }
  }
}));
