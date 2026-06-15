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
};
export type Canteen = { id: string; name: string; description: string; image: string; waitTime: string; menu: MenuItem[]; isActive?: boolean };
export type CartItem = MenuItem & { quantity: number };
export type SavedCard = { id: number; type: string; last4: string; expiry: string };
export type MealPass = { id: string; name: string; type: 'lunch' | 'coffee'; daysLeft: number };

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

export const canteensData: Canteen[] = [
  {
    id: 'ivy-hall', name: 'Ivy Hall', waitTime: '8-12 mins', description: 'Under Main Auditorium • Fast Food & Beverages', image: '/images/ivy_hall.png',
    menu: [
      { id: 'm1', name: 'Veg Hakka Noodles', description: 'Wok-tossed noodles with fresh veggies and soy.', price: 90, prepTime: 5, type: 'veg', category: 'Meals', tag: 'Bestseller', image: '/images/steaming_noodles.png' },
      { id: 'm2', name: 'Chilli Chicken Dry', description: 'Crispy chicken tossed in spicy Indo-Chinese sauce.', price: 120, prepTime: 8, type: 'non-veg', category: 'Starters', image: '/images/rich_curry.png' },
      { id: 'm3', name: 'Cold Coffee', description: 'Classic thick cold coffee with a hint of cocoa.', price: 50, prepTime: 2, type: 'veg', category: 'Beverages', image: '/images/refreshing_drinks.png' },
      { id: 'm18', name: 'Crispy Veg Burger', description: 'Spiced veg patty with cheese slice, crisp lettuce, and special garlic mayo.', price: 70, prepTime: 6, type: 'veg', category: 'Snacks', tag: 'New', image: '/images/crispy_burger.png' },
      { id: 'm19', name: 'Peri Peri Fries', description: 'Golden potato French fries tossed in spicy peri-peri seasoning dust.', price: 60, prepTime: 4, type: 'veg', category: 'Snacks', image: '/images/crispy_burger.png' }
    ]
  },
  {
    id: 'the-gourmet', name: 'The Gourmet', waitTime: '15-20 mins', description: 'Central Block • Multi-cuisine & Buffet', image: '/images/the_gourmet.png',
    menu: [
      { id: 'm4', name: 'Paneer Butter Masala', description: 'Rich tomato cream gravy with soft cubed paneer.', price: 150, prepTime: 12, type: 'veg', category: 'Meals', tag: 'Trending', image: '/images/rich_curry.png' },
      { id: 'm5', name: 'Chicken Biryani', description: 'Aromatic long grain basmati rice cooked with tender chicken and spices.', price: 180, prepTime: 15, type: 'non-veg', category: 'Meals', image: '/images/chicken_biryani.png' },
      { id: 'm20', name: 'Tandoori Roti', description: 'Fresh clay-oven baked whole wheat traditional tandoori flatbread.', price: 15, prepTime: 3, type: 'veg', category: 'Meals', image: '/images/rich_curry.png' },
      { id: 'm21', name: 'Butter Chicken', description: 'Charcoal smoky chicken chunks in creamy rich tomato butter gravy.', price: 190, prepTime: 10, type: 'non-veg', category: 'Meals', tag: 'Bestseller', image: '/images/rich_curry.png' },
      { id: 'm22', name: 'Dal Makhani Rice Bowl', description: 'Slow-cooked creamy black lentils served over steaming basmati rice.', price: 110, prepTime: 8, type: 'veg', category: 'Meals', image: '/images/rich_curry.png' }
    ]
  },
  {
    id: 'birds-park-kiosk', name: 'The Kiosk (Bird\'s Park)', waitTime: '3-5 mins', description: 'Scenic Bird\'s Park • Quick Snacks & Rolls', image: '/images/birds_park_kiosk.png',
    menu: [
      { id: 'm6', name: 'Veg Mayo Roll', description: 'Crispy veggies wrapped with creamy mayo.', price: 60, prepTime: 3, type: 'veg', category: 'Snacks', tag: 'Quick Bite', image: '/images/savory_rolls.png' },
      { id: 'm7', name: 'Fresh Lime Soda', description: 'Refreshing sweet and salty lime soda.', price: 30, prepTime: 2, type: 'veg', category: 'Beverages', image: '/images/refreshing_drinks.png' },
      { id: 'm23', name: 'Double Egg Chicken Roll', description: 'Flaky flatbread layered with double egg wash, filled with grilled chicken and pepper.', price: 90, prepTime: 5, type: 'non-veg', category: 'Snacks', tag: 'Must Try', image: '/images/savory_rolls.png' },
      { id: 'm24', name: 'Cheese Corn Roll', description: 'Sweet golden corn kernels with heavy mozzarella wrapped in a crispy rolled flatbread.', price: 75, prepTime: 4, type: 'veg', category: 'Snacks', image: '/images/savory_rolls.png' }
    ]
  },
  {
    id: 'christ-bakery', name: 'Christ University Bakery', waitTime: '2-5 mins', description: 'Famous for fresh puffs and iconic Pazham Pori', image: '/images/christ_bakery_outlet.png',
    menu: [
      { id: 'm8', name: 'Pazham Pori', description: 'The iconic golden-fried sweet banana fritter.', price: 20, prepTime: 2, type: 'veg', category: 'Snacks', tag: 'Iconic', image: '/images/bakery_sweets.png' },
      { id: 'm9', name: 'Chicken Puff', description: 'Vibrant crispy puff pastry stuffed with spiced dry minced chicken.', price: 35, prepTime: 2, type: 'non-veg', category: 'Snacks', image: '/images/bakery_sweets.png' },
      { id: 'm25', name: 'Egg Puff', description: 'Bakery pastry with half boiled egg.', price: 25, prepTime: 2, type: 'veg', category: 'Snacks', image: '/images/bakery_sweets.png' },
      { id: 'm26', name: 'Maska Bun Tea Combo', description: 'Hot university chai served with fresh buttered maska buns.', price: 40, prepTime: 3, type: 'veg', category: 'Beverages', tag: 'Classic', image: '/images/refreshing_drinks.png' }
    ]
  },
  {
    id: 'block-iv', name: 'Block IV Canteen', waitTime: '15-20 mins', description: 'Multi-stall Food Court • Diverse Choices', image: '/images/block_iv_foodcourt.png',
    menu: [
      { id: 'm10', name: 'Tandoori Pizza', description: 'Wood-fired crust with paneer tikka toppings.', price: 150, prepTime: 12, type: 'veg', category: 'Fast Food', tag: 'Must Try', image: '/images/crispy_burger.png' },
      { id: 'm11', name: 'Chicken Teriyaki Bowl', description: 'Grilled chicken glazed in teriyaki over sticky rice.', price: 180, prepTime: 15, type: 'non-veg', category: 'Meals', image: '/images/rich_curry.png' },
      { id: 'm27', name: 'Schezwan Fried Rice', description: 'Wok-tossed spicy long grain rice cooked in fiery schezwan paste.', price: 100, prepTime: 8, type: 'veg', category: 'Meals', image: '/images/steaming_noodles.png' },
      { id: 'm28', name: 'Steamed Chicken Momos', description: 'Delicate steamed flour pockets stuffed with ginger minced chicken.', price: 80, prepTime: 7, type: 'non-veg', category: 'Snacks', tag: 'Trending', image: '/images/bakery_sweets.png' }
    ]
  },
  {
    id: 'nandini', name: 'Nandini Milk Parlour', waitTime: '1-3 mins', description: 'Dedicated stall for dairy, shakes & ice creams', image: '/images/nandini_parlour.png',
    menu: [
      { id: 'm12', name: 'Chocolate Milkshake', description: 'Thick and creamy chocolate shake.', price: 45, prepTime: 2, type: 'veg', category: 'Beverages', tag: 'Chilled', image: '/images/refreshing_drinks.png' },
      { id: 'm13', name: 'Sweet Lassi', description: 'Traditional sweetened yogurt drink.', price: 30, prepTime: 1, type: 'veg', category: 'Beverages', image: '/images/refreshing_drinks.png' },
      { id: 'm29', name: 'Nandini Badam Milk', description: 'Traditional thick milk drink sweetened and loaded with badam slices.', price: 30, prepTime: 1, type: 'veg', category: 'Beverages', image: '/images/refreshing_drinks.png' },
      { id: 'm30', name: 'Mango Kulfi Slice', description: 'Slow-cooked milk fudge ice-cream slice loaded with real mango chunks.', price: 35, prepTime: 1, type: 'veg', category: 'Beverages', image: '/images/bakery_sweets.png' }
    ]
  },
  {
    id: 'michaels', name: 'Michael\'s Corner', waitTime: '10-15 mins', description: 'Famous for signature Chole Bhature & Rolls', image: '/images/michaels_corner.png',
    menu: [
      { id: 'm14', name: 'Chole Bhature', description: 'Spicy chickpea curry with 2 fluffy bhatures.', price: 100, prepTime: 8, type: 'veg', category: 'Meals', tag: 'Famous', image: '/images/rich_curry.png' },
      { id: 'm15', name: 'Chicken Tikka Roll', description: 'Smoky chicken wrapped in a flaky paratha.', price: 90, prepTime: 6, type: 'non-veg', category: 'Snacks', image: '/images/savory_rolls.png' },
      { id: 'm31', name: 'Samosa Chaat', description: 'Potato-stuffed pastry samosa broken down, topped with sweet yogurt and tangy chutneys.', price: 60, prepTime: 4, type: 'veg', category: 'Snacks', image: '/images/rich_curry.png' },
      { id: 'm32', name: 'Paneer Tikka Roll', description: 'Layered rumali bread wrapped around cottage cheese.', price: 85, prepTime: 5, type: 'veg', category: 'Snacks', image: '/images/savory_rolls.png' }
    ]
  },
  {
    id: 'fresh-cafe', name: 'Fresh Cafeteria', waitTime: '2-5 mins', description: 'Fresh fruit juices, sandwiches & quick bites', image: '/images/fresh_cafe.png',
    menu: [
      { id: 'm16', name: 'Watermelon Cooler', description: 'Freshly pressed watermelon with mint.', price: 50, prepTime: 2, type: 'veg', category: 'Beverages', tag: 'Refreshing', image: '/images/refreshing_drinks.png' },
      { id: 'm17', name: 'Grilled Cheese Sandwich', description: 'Crispy bread layered with melted cheddar.', price: 70, prepTime: 4, type: 'veg', category: 'Snacks', image: '/images/crispy_burger.png' },
      { id: 'm33', name: 'Double Decker Club Sandwich', description: 'Triple layered toasted bread filled with fresh veggies and cheddar.', price: 90, prepTime: 5, type: 'veg', category: 'Snacks', tag: 'Trending', image: '/images/crispy_burger.png' },
      { id: 'm34', name: 'Healthy Avocado Toast', description: 'Fresh smashed organic avocados over thick toasted multigrain bread.', price: 120, prepTime: 4, type: 'veg', category: 'Snacks', image: '/images/crispy_burger.png' }
    ]
  }
];

interface AppState {
  cart: CartItem[];
  favorites: string[];
  walletBalance: number;
  orderType: 'dine-in' | 'takeaway';
  activeOrderId: string | null;
  pastOrders: { id: string; date: string; amount: number; items: number; status?: 'delivered' | 'cancelled'; itemIds?: string[] }[];
  savedCards: SavedCard[];
  darkMode: boolean;
  
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

  addToCart: (item: MenuItem) => void;
  decreaseQuantity: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setOrderType: (type: 'dine-in' | 'takeaway') => void;
  placeOrder: (totalCost: number) => Promise<string>;
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

  // Auth & Profile Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (user: { name: string; regNo: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<AppState['userProfile']>) => Promise<void>;
  fetchOrders: () => Promise<void>;
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

  addToCart: (item) => set((state) => {
    const exists = state.cart.find(c => c.id === item.id);
    if (exists) return { cart: state.cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c) };
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  decreaseQuantity: (id) => set((state) => ({
    cart: state.cart.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c).filter(c => c.quantity > 0)
  })),
  toggleFavorite: (id) => set((state) => ({
    favorites: state.favorites.includes(id) ? state.favorites.filter(favId => favId !== id) : [...state.favorites, id]
  })),
  setOrderType: (type) => set({ orderType: type }),
  placeOrder: async (totalCost) => {
    const state = get();
    const orderId = 'CR-' + Math.floor(1000 + Math.random() * 9000);
    const addedCoins = Math.floor(totalCost * 0.1); 
    
    const payload = {
      id: orderId,
      amount: totalCost,
      items: state.cart.reduce((sum, item) => sum + item.quantity, 0),
      itemIds: state.cart.flatMap(item => Array(item.quantity).fill(item.id))
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        let finalWalletBalance = state.walletBalance - totalCost;
        if (finalWalletBalance < 100 && state.autoTopUp) {
          finalWalletBalance += 500;
          setTimeout(() => {
            toast.success('Auto-Refilled ₹500 from your default card!', { icon: '🔄' });
          }, 1000);
        }

        // Calculate calorie injection for nutrition dashboard
        let orderCalories = 0;
        state.cart.forEach(item => {
          const itemCal = (item.price * 2) + 120; // mock cal based on price
          orderCalories += itemCal * item.quantity;
        });

        set({ 
          cart: [], 
          activeOrderId: orderId,
          walletBalance: finalWalletBalance,
          rushCoins: state.rushCoins + addedCoins,
          queuePosition: 5, 
          weeklyNutrients: {
            ...state.weeklyNutrients,
            calories: state.weeklyNutrients.calories + orderCalories
          },
          activePromoDiscount: 0,
        });

        await state.fetchOrders();
        return orderId;
      }
    } catch (e) {
      console.error(e);
    }
    return '';
  },
  addWalletBalance: async (amount) => {
    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      if (res.ok) {
        const data = await res.json();
        set({ walletBalance: data.balance });
      }
    } catch (e) {
      console.error(e);
    }
  },
  fetchWallet: async () => {
    try {
      const res = await fetch('/api/wallet/balance');
      if (res.ok) {
        const data = await res.json();
        set({ walletBalance: data.balance });
      }
    } catch (e) {
      console.error(e);
    }
  },
  cancelOrder: async (orderId, amount) => {
    const state = get();
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST'
      });
      if (res.ok) {
        const refundedCoins = Math.floor(amount * 0.1);
        set({
          walletBalance: state.walletBalance + amount,
          activeOrderId: state.activeOrderId === orderId ? null : state.activeOrderId,
          rushCoins: Math.max(0, state.rushCoins - refundedCoins)
        });
        await state.fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  },
  reorder: (orderId) => set((state) => {
    const order = state.pastOrders.find(o => o.id === orderId);
    if (!order || !order.itemIds) return {};
    
    const newCart: CartItem[] = [];
    order.itemIds.forEach(id => {
      const foundItem = canteensData.flatMap(c => c.menu).find(m => m.id === id);
      if (foundItem) {
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

  // Auth & Profile Action Implementation
  login: async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const user = await res.json();
        set({ 
          isAuthenticated: true, 
          userProfile: {
            name: user.name,
            regNo: user.regNo,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatarUrl
          }
        });
        localStorage.setItem('canteen_rush_user', JSON.stringify(user));
        return true;
      }
    } catch (e) {
      console.warn('Backend unavailable, falling back to local state');
    }
    
    // Fallback logic for static deployment
    const state = get();
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      set({ 
        isAuthenticated: true, 
        userProfile: {
          name: user.name,
          regNo: user.regNo,
          email: user.email,
          phone: user.phone,
          avatarUrl: user.avatarUrl
        }
      });
      localStorage.setItem('canteen_rush_user', JSON.stringify(user));
      return true;
    }
    return false;
  },
  signup: async (user) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        const newUser = await res.json();
        set({
          isAuthenticated: true,
          userProfile: {
            name: newUser.name,
            regNo: newUser.regNo,
            email: newUser.email,
            phone: newUser.phone,
            avatarUrl: newUser.avatarUrl
          }
        });
        localStorage.setItem('canteen_rush_user', JSON.stringify(newUser));
        return true;
      }
    } catch (e) {
      console.warn('Backend unavailable, falling back to local state');
    }

    // Fallback logic for static deployment
    const state = get();
    const exists = state.users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) return false;
    
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
    const newUser = { ...user, avatarUrl };
    
    set({
      isAuthenticated: true,
      userProfile: {
        name: newUser.name,
        regNo: newUser.regNo,
        email: newUser.email,
        phone: newUser.phone,
        avatarUrl: newUser.avatarUrl
      },
      users: [...state.users, newUser]
    });
    localStorage.setItem('canteen_rush_user', JSON.stringify(newUser));
    return true;
  },
  logout: () => {
    localStorage.removeItem('canteen_rush_user');
    set({ isAuthenticated: false, cart: [], activeOrderId: null });
  },
  updateProfile: async (profile) => {
    const state = get();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: state.userProfile.email,
          ...profile
        })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        set({
          userProfile: {
            name: updatedUser.name,
            regNo: updatedUser.regNo,
            email: updatedUser.email,
            phone: updatedUser.phone,
            avatarUrl: updatedUser.avatarUrl
          }
        });
        localStorage.setItem('canteen_rush_user', JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.error(e);
    }
  },
  fetchOrders: async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        set({ pastOrders: data });
      }
    } catch (e) {
      console.error(e);
    }
  }
}));