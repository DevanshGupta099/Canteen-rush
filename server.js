import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'server', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const TICKETS_FILE = path.join(DATA_DIR, 'tickets.json');
const STORIES_FILE = path.join(DATA_DIR, 'stories.json');
const CANTEENS_FILE = path.join(DATA_DIR, 'canteens.json');
const WALLET_FILE = path.join(DATA_DIR, 'wallet.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

// Helper functions for reading/writing JSON files safely
function readJSON(file, defaultData = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file ${file}:`, err);
    return defaultData;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing file ${file}:`, err);
  }
}

// Initial default seeds
const defaultUsers = [
  {
    name: "Devansh Gupta",
    regNo: "21BCA404",
    email: "devansh.gupta@christuniversity.in",
    phone: "+91 98765 43210",
    password: "password123",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Devansh"
  }
];

const defaultStories = [
  {
    canteenId: "christ-bakery",
    title: "Pazham Hot! 🥟",
    image: "/images/bakery_sweets.png",
    highlightText: "Christ Bakery: Fresh batch of Pazham Pori golden banana fritters just fried! Crispy outside, sweet inside. 🍌",
    headline: "Fresh Fritters Out!"
  },
  {
    canteenId: "ivy-hall",
    title: "Cold Brews ☕",
    image: "/images/refreshing_drinks.png",
    highlightText: "Ivy Hall: Stay fueled through morning classes with classic Cold Coffee topped with thick cocoa powder! ❄️",
    headline: "Chilled Shakes Ready"
  },
  {
    canteenId: "birds-park-kiosk",
    title: "Mayo Rolls 🌯",
    image: "/images/savory_rolls.png",
    highlightText: "The Kiosk: Wok-seared crisp vegetables layered with heavy cream mayo and rolled into flaky parathas! 🤤",
    headline: "Hot Wraps Served"
  },
  {
    canteenId: "block-iv",
    title: "Pizza Fresh 🍕",
    image: "/images/crispy_burger.png",
    highlightText: "Block IV: Wood-fired crusts layered with smoky tandoori paneer tikka and melted cheddar! 🍕",
    headline: "Happy Hour Slice"
  }
];

const defaultOrders = [
  {
    id: "CR-4921",
    date: "Today, 11:30 AM",
    amount: 140,
    items: 2,
    status: "delivered",
    itemIds: ["m1", "m3"],
    timestamp: Date.now() - 3 * 3600 * 1000 // 3 hours ago
  },
  {
    id: "CR-1029",
    date: "Yesterday, 1:15 PM",
    amount: 250,
    items: 2,
    status: "delivered",
    itemIds: ["m4", "m14"],
    timestamp: Date.now() - 28 * 3600 * 1000 // Yesterday
  },
  {
    id: "CR-0881",
    date: "Monday, 9:00 AM",
    amount: 50,
    items: 1,
    status: "delivered",
    itemIds: ["m3"],
    timestamp: Date.now() - 5 * 24 * 3600 * 1000 // 5 days ago
  }
];

const defaultTickets = [
  {
    id: "TK-8492",
    category: "Refunds & Wallet",
    subject: "Double charge on Gpay",
    message: "I was charged twice when topping up my student wallet at Nandini Milk Parlour.",
    status: "resolved",
    date: "Yesterday, 2:14 PM",
    messages: [
      { sender: "user", text: "My wallet top-up failed but the money was debited.", time: "2:14 PM" },
      { sender: "agent", text: "Hi Devansh! I verified the transaction logs. The duplicate charge has been rolled back and ₹100 is credited to your wallet.", time: "2:30 PM" },
      { sender: "user", text: "Awesome, got the credit. Thanks!", time: "2:35 PM" }
    ],
    timestamp: Date.now() - 24 * 3600 * 1000
  }
];

const defaultCanteens = [
  {
    id: 'ivy-hall', name: 'Ivy Hall', waitTime: '8-12 mins', description: 'Under Main Auditorium • Fast Food & Beverages', image: '/images/ivy_hall.png', isActive: true,
    menu: [
      { id: 'm1', name: 'Veg Hakka Noodles', description: 'Wok-tossed noodles with fresh veggies and soy.', price: 90, prepTime: 5, type: 'veg', category: 'Meals', tag: 'Bestseller', image: '/images/steaming_noodles.png' },
      { id: 'm2', name: 'Chilli Chicken Dry', description: 'Crispy chicken tossed in spicy Indo-Chinese sauce.', price: 120, prepTime: 8, type: 'non-veg', category: 'Starters', image: '/images/rich_curry.png' },
      { id: 'm3', name: 'Cold Coffee', description: 'Classic thick cold coffee with a hint of cocoa.', price: 50, prepTime: 2, type: 'veg', category: 'Beverages', image: '/images/refreshing_drinks.png' },
      { id: 'm18', name: 'Crispy Veg Burger', description: 'Spiced veg patty with cheese slice, crisp lettuce, and special garlic mayo.', price: 70, prepTime: 6, type: 'veg', category: 'Snacks', tag: 'New', image: '/images/crispy_burger.png' },
      { id: 'm19', name: 'Peri Peri Fries', description: 'Golden potato French fries tossed in spicy peri-peri seasoning dust.', price: 60, prepTime: 4, type: 'veg', category: 'Snacks', image: '/images/crispy_burger.png' }
    ]
  },
  {
    id: 'the-gourmet', name: 'The Gourmet', waitTime: '15-20 mins', description: 'Central Block • Multi-cuisine & Buffet', image: '/images/the_gourmet.png', isActive: true,
    menu: [
      { id: 'm4', name: 'Paneer Butter Masala', description: 'Rich tomato cream gravy with soft cubed paneer.', price: 150, prepTime: 12, type: 'veg', category: 'Meals', tag: 'Trending', image: '/images/rich_curry.png' },
      { id: 'm5', name: 'Chicken Biryani', description: 'Aromatic long grain basmati rice cooked with tender chicken and spices.', price: 180, prepTime: 15, type: 'non-veg', category: 'Meals', image: '/images/chicken_biryani.png' },
      { id: 'm20', name: 'Tandoori Roti', description: 'Fresh clay-oven baked whole wheat traditional tandoori flatbread.', price: 15, prepTime: 3, type: 'veg', category: 'Meals', image: '/images/rich_curry.png' },
      { id: 'm21', name: 'Butter Chicken', description: 'Charcoal smoky chicken chunks in creamy rich tomato butter gravy.', price: 190, prepTime: 10, type: 'non-veg', category: 'Meals', tag: 'Bestseller', image: '/images/rich_curry.png' },
      { id: 'm22', name: 'Dal Makhani Rice Bowl', description: 'Slow-cooked creamy black lentils served over steaming basmati rice.', price: 110, prepTime: 8, type: 'veg', category: 'Meals', image: '/images/rich_curry.png' }
    ]
  },
  {
    id: 'birds-park-kiosk', name: 'The Kiosk (Bird\'s Park)', waitTime: '3-5 mins', description: 'Scenic Bird\'s Park • Quick Snacks & Rolls', image: '/images/birds_park_kiosk.png', isActive: true,
    menu: [
      { id: 'm6', name: 'Veg Mayo Roll', description: 'Crispy veggies wrapped with creamy mayo.', price: 60, prepTime: 3, type: 'veg', category: 'Snacks', tag: 'Quick Bite', image: '/images/savory_rolls.png' },
      { id: 'm7', name: 'Fresh Lime Soda', description: 'Refreshing sweet and salty lime soda.', price: 30, prepTime: 2, type: 'veg', category: 'Beverages', image: '/images/refreshing_drinks.png' },
      { id: 'm23', name: 'Double Egg Chicken Roll', description: 'Flaky flatbread layered with double egg wash, filled with grilled chicken and pepper.', price: 90, prepTime: 5, type: 'non-veg', category: 'Snacks', tag: 'Must Try', image: '/images/savory_rolls.png' },
      { id: 'm24', name: 'Cheese Corn Roll', description: 'Sweet golden corn kernels with heavy mozzarella wrapped in a crispy rolled flatbread.', price: 75, prepTime: 4, type: 'veg', category: 'Snacks', image: '/images/savory_rolls.png' }
    ]
  },
  {
    id: 'christ-bakery', name: 'Christ University Bakery', waitTime: '2-5 mins', description: 'Famous for fresh puffs and iconic Pazham Pori', image: '/images/christ_bakery_outlet.png', isActive: true,
    menu: [
      { id: 'm8', name: 'Pazham Pori', description: 'The iconic golden-fried sweet banana fritter.', price: 20, prepTime: 2, type: 'veg', category: 'Snacks', tag: 'Iconic', image: '/images/bakery_sweets.png' },
      { id: 'm9', name: 'Chicken Puff', description: 'Vibrant crispy puff pastry stuffed with spiced dry minced chicken.', price: 35, prepTime: 2, type: 'non-veg', category: 'Snacks', image: '/images/bakery_sweets.png' },
      { id: 'm25', name: 'Egg Puff', description: 'Bakery pastry with half boiled egg.', price: 25, prepTime: 2, type: 'veg', category: 'Snacks', image: '/images/bakery_sweets.png' },
      { id: 'm26', name: 'Maska Bun Tea Combo', description: 'Hot university chai served with fresh buttered maska buns.', price: 40, prepTime: 3, type: 'veg', category: 'Beverages', tag: 'Classic', image: '/images/refreshing_drinks.png' }
    ]
  },
  {
    id: 'block-iv', name: 'Block IV Canteen', waitTime: '15-20 mins', description: 'Multi-stall Food Court • Diverse Choices', image: '/images/block_iv_foodcourt.png', isActive: true,
    menu: [
      { id: 'm10', name: 'Tandoori Pizza', description: 'Wood-fired crust with paneer tikka toppings.', price: 150, prepTime: 12, type: 'veg', category: 'Fast Food', tag: 'Must Try', image: '/images/crispy_burger.png' },
      { id: 'm11', name: 'Chicken Teriyaki Bowl', description: 'Grilled chicken glazed in teriyaki over sticky rice.', price: 180, prepTime: 15, type: 'non-veg', category: 'Meals', image: '/images/rich_curry.png' },
      { id: 'm27', name: 'Schezwan Fried Rice', description: 'Wok-tossed spicy long grain rice cooked in fiery schezwan paste.', price: 100, prepTime: 8, type: 'veg', category: 'Meals', image: '/images/steaming_noodles.png' },
      { id: 'm28', name: 'Steamed Chicken Momos', description: 'Delicate steamed flour pockets stuffed with ginger minced chicken.', price: 80, prepTime: 7, type: 'non-veg', category: 'Snacks', tag: 'Trending', image: '/images/bakery_sweets.png' }
    ]
  },
  {
    id: 'nandini', name: 'Nandini Milk Parlour', waitTime: '1-3 mins', description: 'Dedicated stall for dairy, shakes & ice creams', image: '/images/nandini_parlour.png', isActive: true,
    menu: [
      { id: 'm12', name: 'Chocolate Milkshake', description: 'Thick and creamy chocolate shake.', price: 45, prepTime: 2, type: 'veg', category: 'Beverages', tag: 'Chilled', image: '/images/refreshing_drinks.png' },
      { id: 'm13', name: 'Sweet Lassi', description: 'Traditional sweetened yogurt drink.', price: 30, prepTime: 1, type: 'veg', category: 'Beverages', image: '/images/refreshing_drinks.png' },
      { id: 'm29', name: 'Nandini Badam Milk', description: 'Traditional thick milk drink sweetened and loaded with badam slices.', price: 30, prepTime: 1, type: 'veg', category: 'Beverages', image: '/images/refreshing_drinks.png' },
      { id: 'm30', name: 'Mango Kulfi Slice', description: 'Slow-cooked milk fudge ice-cream slice loaded with real mango chunks.', price: 35, prepTime: 1, type: 'veg', category: 'Beverages', image: '/images/bakery_sweets.png' }
    ]
  },
  {
    id: 'michaels', name: 'Michael\'s Corner', waitTime: '10-15 mins', description: 'Famous for signature Chole Bhature & Rolls', image: '/images/michaels_corner.png', isActive: true,
    menu: [
      { id: 'm14', name: 'Chole Bhature', description: 'Spicy chickpea curry with 2 fluffy bhatures.', price: 100, prepTime: 8, type: 'veg', category: 'Meals', tag: 'Famous', image: '/images/rich_curry.png' },
      { id: 'm15', name: 'Chicken Tikka Roll', description: 'Smoky chicken wrapped in a flaky paratha.', price: 90, prepTime: 6, type: 'non-veg', category: 'Snacks', image: '/images/savory_rolls.png' },
      { id: 'm31', name: 'Samosa Chaat', description: 'Potato-stuffed pastry samosa broken down, topped with sweet yogurt and tangy chutneys.', price: 60, prepTime: 4, type: 'veg', category: 'Snacks', image: '/images/rich_curry.png' },
      { id: 'm32', name: 'Paneer Tikka Roll', description: 'Layered rumali bread wrapped around cottage cheese.', price: 85, prepTime: 5, type: 'veg', category: 'Snacks', image: '/images/savory_rolls.png' }
    ]
  },
  {
    id: 'fresh-cafe', name: 'Fresh Cafeteria', waitTime: '2-5 mins', description: 'Fresh fruit juices, sandwiches & quick bites', image: '/images/fresh_cafe.png', isActive: true,
    menu: [
      { id: 'm16', name: 'Watermelon Cooler', description: 'Freshly pressed watermelon with mint.', price: 50, prepTime: 2, type: 'veg', category: 'Beverages', tag: 'Refreshing', image: '/images/refreshing_drinks.png' },
      { id: 'm17', name: 'Grilled Cheese Sandwich', description: 'Crispy bread layered with melted cheddar.', price: 70, prepTime: 4, type: 'veg', category: 'Snacks', image: '/images/crispy_burger.png' },
      { id: 'm33', name: 'Double Decker Club Sandwich', description: 'Triple layered toasted bread filled with fresh veggies and cheddar.', price: 90, prepTime: 5, type: 'veg', category: 'Snacks', tag: 'Trending', image: '/images/crispy_burger.png' },
      { id: 'm34', name: 'Healthy Avocado Toast', description: 'Fresh smashed organic avocados over thick toasted multigrain bread.', price: 120, prepTime: 4, type: 'veg', category: 'Snacks', image: '/images/crispy_burger.png' }
    ]
  }
];

const defaultWallet = { balance: 850.0 };
const defaultFeedback = [];
const defaultAdmin = [{ username: "admin", password: "password123" }];

// Initialize database files if empty or not present
readJSON(USERS_FILE, defaultUsers);
readJSON(STORIES_FILE, defaultStories);
readJSON(ORDERS_FILE, defaultOrders);
readJSON(TICKETS_FILE, defaultTickets);
readJSON(CANTEENS_FILE, defaultCanteens);
readJSON(WALLET_FILE, defaultWallet);
readJSON(FEEDBACK_FILE, defaultFeedback);
readJSON(ADMIN_FILE, defaultAdmin);

// AUTH ENDPOINTS
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readJSON(USERS_FILE, defaultUsers);
  const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (matchedUser) {
    return res.status(200).json(matchedUser);
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, regNo, email, phone, password } = req.body;
  const users = readJSON(USERS_FILE, defaultUsers);
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  const newUser = { name, regNo, email, phone, password, avatarUrl };
  users.push(newUser);
  writeJSON(USERS_FILE, users);
  return res.status(201).json(newUser);
});

app.post('/api/auth/profile', (req, res) => {
  const { currentEmail, name, regNo, email, phone, avatarUrl } = req.body;
  const users = readJSON(USERS_FILE, defaultUsers);
  const userIdx = users.findIndex(u => u.email.toLowerCase() === currentEmail.toLowerCase());
  if (userIdx !== -1) {
    users[userIdx] = { ...users[userIdx], name, regNo, email, phone, avatarUrl };
    writeJSON(USERS_FILE, users);
    return res.status(200).json(users[userIdx]);
  }
  return res.status(404).json({ message: 'User not found' });
});

// STORIES ENDPOINTS
app.get('/api/stories', (req, res) => {
  const stories = readJSON(STORIES_FILE, defaultStories);
  res.status(200).json(stories);
});

app.post('/api/stories', (req, res) => {
  const { canteenId, title, headline, highlightText, image } = req.body;
  const stories = readJSON(STORIES_FILE, defaultStories);
  const newStory = { canteenId, title, headline, highlightText, image };
  // Prepend to show fresh stories first
  stories.unshift(newStory);
  writeJSON(STORIES_FILE, stories);
  res.status(201).json(stories);
});

// ORDERS ENDPOINTS
app.get('/api/orders', (req, res) => {
  const orders = readJSON(ORDERS_FILE, defaultOrders);
  // Sort by newest
  const sorted = [...orders].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  res.status(200).json(sorted);
});

app.post('/api/orders', (req, res) => {
  const { id, amount, items, itemIds, date } = req.body;
  const orders = readJSON(ORDERS_FILE, defaultOrders);
  const newOrder = {
    id: id || 'CR-' + Math.floor(1000 + Math.random() * 9000),
    date: date || 'Just Now',
    amount,
    items,
    status: 'accepted',
    itemIds,
    timestamp: Date.now()
  };
  orders.push(newOrder);
  writeJSON(ORDERS_FILE, orders);
  res.status(201).json(newOrder);
});

// GET SINGLE ORDER AND COMPUTE DYNAMIC STATUS
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const orders = readJSON(ORDERS_FILE, defaultOrders);
  const orderIdx = orders.findIndex(o => o.id === id);
  if (orderIdx === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const order = orders[orderIdx];
  
  // Skip calculating status if the order was already completed or cancelled prior
  if (order.status === 'cancelled' || order.status === 'delivered') {
    return res.status(200).json({ ...order, queuePosition: 0 });
  }

  // Calculate elapsed time in seconds
  const elapsedSeconds = Math.floor((Date.now() - order.timestamp) / 1000);
  
  let currentStatus = 'accepted';
  let queuePosition = 5;

  if (elapsedSeconds >= 180) {
    currentStatus = 'delivered';
    queuePosition = 0;
  } else if (elapsedSeconds >= 90) {
    currentStatus = 'ready';
    queuePosition = 0;
  } else if (elapsedSeconds >= 20) {
    currentStatus = 'preparing';
    // queue position goes from 4 to 1 between 20s and 90s (70 seconds span)
    const progress = (elapsedSeconds - 20) / 70;
    queuePosition = Math.max(1, Math.floor(4 - progress * 4));
  } else {
    currentStatus = 'accepted';
    queuePosition = 5;
  }

  // Update status in orders.json if it changed
  if (order.status !== currentStatus) {
    order.status = currentStatus;
    writeJSON(ORDERS_FILE, orders);
  }

  res.status(200).json({ ...order, queuePosition });
});

// CANCEL ORDER
app.post('/api/orders/:id/cancel', (req, res) => {
  const { id } = req.params;
  const orders = readJSON(ORDERS_FILE, defaultOrders);
  const orderIdx = orders.findIndex(o => o.id === id);
  if (orderIdx === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const order = orders[orderIdx];
  const elapsedSeconds = Math.floor((Date.now() - order.timestamp) / 1000);
  
  // Can only cancel within 2 minutes (120 seconds)
  if (elapsedSeconds > 120) {
    return res.status(400).json({ message: 'Orders cannot be cancelled after 2 minutes.' });
  }

  order.status = 'cancelled';
  writeJSON(ORDERS_FILE, orders);
  res.status(200).json(order);
});

// SUPPORT TICKETS ENDPOINTS
app.get('/api/support/tickets', (req, res) => {
  const tickets = readJSON(TICKETS_FILE, defaultTickets);
  // Sort by newest
  const sorted = [...tickets].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  res.status(200).json(sorted);
});

app.post('/api/support/tickets', (req, res) => {
  const { category, subject, message } = req.body;
  const tickets = readJSON(TICKETS_FILE, defaultTickets);
  const newId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
  const newTicket = {
    id: newId,
    category,
    subject,
    message,
    status: 'submitted',
    date: 'Just Now',
    messages: [
      { sender: 'user', text: message, time: 'Just Now' }
    ],
    timestamp: Date.now()
  };

  tickets.push(newTicket);
  writeJSON(TICKETS_FILE, tickets);
  res.status(201).json(newTicket);

  // Background simulation of agent joining after 3 seconds
  setTimeout(() => {
    const currentTickets = readJSON(TICKETS_FILE, defaultTickets);
    const tkIdx = currentTickets.findIndex(t => t.id === newId);
    if (tkIdx !== -1 && currentTickets[tkIdx].status === 'submitted') {
      currentTickets[tkIdx].status = 'processing';
      currentTickets[tkIdx].messages.push({
        sender: 'agent',
        text: `Hi there! I am Arjun from Christ Canteen Helpdesk. I have claimed your ticket #${newId} and I am investigating the issue now.`,
        time: 'Just Now'
      });
      writeJSON(TICKETS_FILE, currentTickets);
    }
  }, 3000);

  // Background simulation of agent resolving after 12 seconds
  setTimeout(() => {
    const currentTickets = readJSON(TICKETS_FILE, defaultTickets);
    const tkIdx = currentTickets.findIndex(t => t.id === newId);
    if (tkIdx !== -1 && currentTickets[tkIdx].status === 'processing') {
      currentTickets[tkIdx].status = 'resolved';
      currentTickets[tkIdx].messages.push({
        sender: 'agent',
        text: 'Hey there! I reviewed your support ticket and applied the fix! Your wallet balance has been updated accordingly. Let me know if you need anything else! 🎓',
        time: 'Just Now'
      });
      writeJSON(TICKETS_FILE, currentTickets);
    }
  }, 12000);
});

app.post('/api/support/tickets/:id/message', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const tickets = readJSON(TICKETS_FILE, defaultTickets);
  const tkIdx = tickets.findIndex(t => t.id === id);
  if (tkIdx === -1) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  const ticket = tickets[tkIdx];
  ticket.messages.push({ sender: 'user', text, time: 'Just Now' });
  writeJSON(TICKETS_FILE, tickets);

  res.status(200).json(ticket);

  // Background reply simulation after 2 seconds
  setTimeout(() => {
    const currentTickets = readJSON(TICKETS_FILE, defaultTickets);
    const idx = currentTickets.findIndex(t => t.id === id);
    if (idx !== -1) {
      currentTickets[idx].messages.push({
        sender: 'agent',
        text: 'Thank you for the update. Our campus field manager is on it!',
        time: 'Just Now'
      });
      writeJSON(TICKETS_FILE, currentTickets);
    }
  }, 2000);
});

// CANTEENS ENDPOINTS
app.get('/api/canteens', (req, res) => {
  const canteens = readJSON(CANTEENS_FILE, defaultCanteens);
  res.status(200).json(canteens);
});

app.get('/api/canteens/:id/menu', (req, res) => {
  const { id } = req.params;
  const canteens = readJSON(CANTEENS_FILE, defaultCanteens);
  const canteen = canteens.find(c => c.id === id);
  if (canteen) {
    res.status(200).json(canteen.menu);
  } else {
    res.status(404).json({ message: 'Canteen not found' });
  }
});

app.put('/api/canteens/:id', (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const canteens = readJSON(CANTEENS_FILE, defaultCanteens);
  const canteenIdx = canteens.findIndex(c => c.id === id);
  if (canteenIdx !== -1) {
    canteens[canteenIdx].isActive = isActive;
    writeJSON(CANTEENS_FILE, canteens);
    return res.status(200).json(canteens[canteenIdx]);
  }
  res.status(404).json({ message: 'Canteen not found' });
});

// ADMIN MENU MANAGEMENT
app.post('/api/admin/canteens/:canteenId/menu', (req, res) => {
  const { canteenId } = req.params;
  const newItem = req.body;
  const canteens = readJSON(CANTEENS_FILE, defaultCanteens);
  const canteenIdx = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIdx === -1) {
    return res.status(404).json({ message: 'Canteen not found' });
  }
  
  // Assign a random unique ID if one wasn't provided
  const itemToAdd = { 
    ...newItem, 
    id: newItem.id || `m${Date.now()}` 
  };
  
  canteens[canteenIdx].menu.push(itemToAdd);
  writeJSON(CANTEENS_FILE, canteens);
  res.status(201).json(itemToAdd);
});

app.put('/api/admin/canteens/:canteenId/menu/:itemId', (req, res) => {
  const { canteenId, itemId } = req.params;
  const updates = req.body;
  const canteens = readJSON(CANTEENS_FILE, defaultCanteens);
  const canteenIdx = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIdx === -1) {
    return res.status(404).json({ message: 'Canteen not found' });
  }
  
  const menuIdx = canteens[canteenIdx].menu.findIndex(m => m.id === itemId);
  if (menuIdx === -1) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  
  canteens[canteenIdx].menu[menuIdx] = { 
    ...canteens[canteenIdx].menu[menuIdx], 
    ...updates 
  };
  
  writeJSON(CANTEENS_FILE, canteens);
  res.status(200).json(canteens[canteenIdx].menu[menuIdx]);
});

// WALLET ENDPOINTS
app.get('/api/wallet/balance', (req, res) => {
  const wallet = readJSON(WALLET_FILE, defaultWallet);
  res.status(200).json(wallet);
});

app.post('/api/wallet/topup', (req, res) => {
  const { amount } = req.body;
  const wallet = readJSON(WALLET_FILE, defaultWallet);
  wallet.balance += amount;
  writeJSON(WALLET_FILE, wallet);
  res.status(200).json(wallet);
});

// FEEDBACK ENDPOINT
app.post('/api/feedback', (req, res) => {
  const { rating, feedback } = req.body;
  const feedbacks = readJSON(FEEDBACK_FILE, defaultFeedback);
  const newFeedback = { id: Date.now(), rating, feedback, date: new Date().toISOString() };
  feedbacks.push(newFeedback);
  writeJSON(FEEDBACK_FILE, feedbacks);
  res.status(201).json(newFeedback);
});

// ADMIN ENDPOINTS
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admins = readJSON(ADMIN_FILE, defaultAdmin);
  const match = admins.find(a => a.username === username && a.password === password);
  if (match) {
    res.status(200).json({ token: 'mock-admin-jwt-token-123', username: match.username });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

app.get('/api/admin/stats', (req, res) => {
  const orders = readJSON(ORDERS_FILE, defaultOrders);
  const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = orders.length;
  res.status(200).json({ totalSales, totalOrders, recentOrders: orders.slice(0, 10) });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orders = readJSON(ORDERS_FILE, defaultOrders);
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    orders[idx].status = status;
    writeJSON(ORDERS_FILE, orders);
    return res.status(200).json(orders[idx]);
  }
  res.status(404).json({ message: 'Order not found' });
});

app.get('/api/recommendations', (req, res) => {
  // Mock AI recommendations based on trending tags
  res.status(200).json([
    { id: 'm1', name: 'Veg Hakka Noodles', reason: 'Because you love Asian Cuisine', canteen: 'Ivy Hall' },
    { id: 'm4', name: 'Paneer Butter Masala', reason: 'Trending on Campus right now', canteen: 'The Gourmet' },
    { id: 'm8', name: 'Pazham Pori', reason: 'Perfect for the rainy weather!', canteen: 'Christ Bakery' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Canteen Rush backend running on port ${PORT}`);
});
