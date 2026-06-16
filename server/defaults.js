export const defaultUsers = [
  {
    name: "Devansh Gupta",
    regNo: "21BCA404",
    email: "devansh.gupta@christuniversity.in",
    phone: "+91 98765 43210",
    password: "password123",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Devansh"
  }
];

export const defaultStories = [
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

export const defaultOrders = [
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

export const defaultTickets = [
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

export const defaultCanteens = [
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

export const defaultWallet = { balance: 850.0 };
export const defaultFeedback = [];
export const defaultAdmin = [{ username: "admin", password: "password123" }];

