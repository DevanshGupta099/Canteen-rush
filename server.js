import express from 'express';
import cors from 'cors';
import { getDb, initDb } from './server/db.js';
import * as seedData from './server/defaults.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
(async () => {
  try {
    await initDb(seedData);
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
})();

// AUTH ENDPOINTS
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = await getDb();
  const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email.toLowerCase(), password]);
  if (user) {
    return res.status(200).json(user);
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, regNo, email, phone, password } = req.body;
  const db = await getDb();
  
  try {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    const result = await db.run(
      'INSERT INTO users (name, regNo, email, phone, password, avatarUrl) VALUES (?, ?, ?, ?, ?, ?)',
      [name, regNo, email.toLowerCase(), phone, password, avatarUrl]
    );
    const newUser = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
    return res.status(201).json(newUser);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: users.email')) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/profile', async (req, res) => {
  const { currentEmail, name, regNo, email, phone, avatarUrl } = req.body;
  const db = await getDb();
  try {
    await db.run(
      'UPDATE users SET name = ?, regNo = ?, email = ?, phone = ?, avatarUrl = ? WHERE email = ?',
      [name, regNo, email.toLowerCase(), phone, avatarUrl, currentEmail.toLowerCase()]
    );
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (user) return res.status(200).json(user);
    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: users.email')) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// STORIES ENDPOINTS
app.get('/api/stories', async (req, res) => {
  const db = await getDb();
  // Order by id descending so newest are first
  const stories = await db.all('SELECT * FROM stories ORDER BY id DESC');
  res.status(200).json(stories);
});

app.post('/api/stories', async (req, res) => {
  const { canteenId, title, headline, highlightText, image } = req.body;
  const db = await getDb();
  await db.run(
    'INSERT INTO stories (canteenId, title, image, highlightText, headline) VALUES (?, ?, ?, ?, ?)',
    [canteenId, title, image, highlightText, headline]
  );
  const stories = await db.all('SELECT * FROM stories ORDER BY id DESC');
  res.status(201).json(stories);
});

// ORDERS ENDPOINTS
app.get('/api/orders', async (req, res) => {
  const db = await getDb();
  const orders = await db.all('SELECT * FROM orders ORDER BY timestamp DESC');
  // Parse itemIds back into an array
  const formattedOrders = orders.map(o => ({ ...o, itemIds: JSON.parse(o.itemIds || '[]') }));
  res.status(200).json(formattedOrders);
});

app.post('/api/orders', async (req, res) => {
  const { id, amount, items, itemIds, date } = req.body;
  const db = await getDb();
  const newId = id || 'CR-' + Math.floor(1000 + Math.random() * 9000);
  const newDate = date || 'Just Now';
  const timestamp = Date.now();
  
  await db.run(
    'INSERT INTO orders (id, date, amount, items, status, itemIds, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [newId, newDate, amount, items, 'accepted', JSON.stringify(itemIds), timestamp]
  );
  
  const newOrder = await db.get('SELECT * FROM orders WHERE id = ?', [newId]);
  newOrder.itemIds = JSON.parse(newOrder.itemIds || '[]');
  res.status(201).json(newOrder);
});

// GET SINGLE ORDER AND COMPUTE DYNAMIC STATUS
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const db = await getDb();
  const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.itemIds = JSON.parse(order.itemIds || '[]');
  
  if (order.status === 'cancelled' || order.status === 'delivered') {
    return res.status(200).json({ ...order, queuePosition: 0 });
  }

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
    const progress = (elapsedSeconds - 20) / 70;
    queuePosition = Math.max(1, Math.floor(4 - progress * 4));
  } else {
    currentStatus = 'accepted';
    queuePosition = 5;
  }

  if (order.status !== currentStatus) {
    order.status = currentStatus;
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [currentStatus, id]);
  }

  res.status(200).json({ ...order, queuePosition });
});

// CANCEL ORDER
app.post('/api/orders/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const db = await getDb();
  const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const elapsedSeconds = Math.floor((Date.now() - order.timestamp) / 1000);
  
  if (elapsedSeconds > 120) {
    return res.status(400).json({ message: 'Orders cannot be cancelled after 2 minutes.' });
  }

  await db.run('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', id]);
  order.status = 'cancelled';
  order.itemIds = JSON.parse(order.itemIds || '[]');
  res.status(200).json(order);
});

// SUPPORT TICKETS ENDPOINTS
app.get('/api/support/tickets', async (req, res) => {
  const db = await getDb();
  const tickets = await db.all('SELECT * FROM tickets ORDER BY timestamp DESC');
  
  for (let t of tickets) {
    t.messages = await db.all('SELECT * FROM ticket_messages WHERE ticketId = ?', [t.id]);
  }
  
  res.status(200).json(tickets);
});

app.post('/api/support/tickets', async (req, res) => {
  const { category, subject, message } = req.body;
  const db = await getDb();
  const newId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
  const timestamp = Date.now();
  
  await db.run(
    'INSERT INTO tickets (id, category, subject, message, status, date, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [newId, category, subject, message, 'submitted', 'Just Now', timestamp]
  );
  
  await db.run(
    'INSERT INTO ticket_messages (ticketId, sender, text, time) VALUES (?, ?, ?, ?)',
    [newId, 'user', message, 'Just Now']
  );
  
  const newTicket = await db.get('SELECT * FROM tickets WHERE id = ?', [newId]);
  newTicket.messages = await db.all('SELECT * FROM ticket_messages WHERE ticketId = ?', [newId]);
  res.status(201).json(newTicket);

  // Background simulation of agent joining after 3 seconds
  setTimeout(async () => {
    try {
      const t = await db.get('SELECT status FROM tickets WHERE id = ?', [newId]);
      if (t && t.status === 'submitted') {
        await db.run('UPDATE tickets SET status = ? WHERE id = ?', ['processing', newId]);
        await db.run('INSERT INTO ticket_messages (ticketId, sender, text, time) VALUES (?, ?, ?, ?)', [newId, 'agent', `Hi there! I am Arjun from Christ Canteen Helpdesk. I have claimed your ticket #${newId} and I am investigating the issue now.`, 'Just Now']);
      }
    } catch (e) { console.error(e); }
  }, 3000);

  // Background simulation of agent resolving after 12 seconds
  setTimeout(async () => {
    try {
      const t = await db.get('SELECT status FROM tickets WHERE id = ?', [newId]);
      if (t && t.status === 'processing') {
        await db.run('UPDATE tickets SET status = ? WHERE id = ?', ['resolved', newId]);
        await db.run('INSERT INTO ticket_messages (ticketId, sender, text, time) VALUES (?, ?, ?, ?)', [newId, 'agent', 'Hey there! I reviewed your support ticket and applied the fix! Your wallet balance has been updated accordingly. Let me know if you need anything else! 🎓', 'Just Now']);
      }
    } catch (e) { console.error(e); }
  }, 12000);
});

app.post('/api/support/tickets/:id/message', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const db = await getDb();
  
  const ticket = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  await db.run('INSERT INTO ticket_messages (ticketId, sender, text, time) VALUES (?, ?, ?, ?)', [id, 'user', text, 'Just Now']);
  
  ticket.messages = await db.all('SELECT * FROM ticket_messages WHERE ticketId = ?', [id]);
  res.status(200).json(ticket);

  // Background reply simulation after 2 seconds
  setTimeout(async () => {
    try {
      await db.run('INSERT INTO ticket_messages (ticketId, sender, text, time) VALUES (?, ?, ?, ?)', [id, 'agent', 'Thank you for the update. Our campus field manager is on it!', 'Just Now']);
    } catch (e) { console.error(e); }
  }, 2000);
});

// CANTEENS ENDPOINTS
app.get('/api/canteens', async (req, res) => {
  const db = await getDb();
  const canteens = await db.all('SELECT * FROM canteens');
  const formatted = canteens.map(c => ({ ...c, isActive: c.isActive === 1, menu: JSON.parse(c.menu || '[]') }));
  res.status(200).json(formatted);
});

app.get('/api/canteens/:id/menu', async (req, res) => {
  const { id } = req.params;
  const db = await getDb();
  const canteen = await db.get('SELECT menu FROM canteens WHERE id = ?', [id]);
  if (canteen) {
    res.status(200).json(JSON.parse(canteen.menu || '[]'));
  } else {
    res.status(404).json({ message: 'Canteen not found' });
  }
});

app.put('/api/canteens/:id', async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const db = await getDb();
  const canteen = await db.get('SELECT * FROM canteens WHERE id = ?', [id]);
  if (canteen) {
    await db.run('UPDATE canteens SET isActive = ? WHERE id = ?', [isActive ? 1 : 0, id]);
    canteen.isActive = isActive;
    canteen.menu = JSON.parse(canteen.menu || '[]');
    return res.status(200).json(canteen);
  }
  res.status(404).json({ message: 'Canteen not found' });
});

// ADMIN MENU MANAGEMENT
app.post('/api/admin/canteens/:canteenId/menu', async (req, res) => {
  const { canteenId } = req.params;
  const newItem = req.body;
  const db = await getDb();
  
  const canteen = await db.get('SELECT menu FROM canteens WHERE id = ?', [canteenId]);
  if (!canteen) return res.status(404).json({ message: 'Canteen not found' });
  
  const menu = JSON.parse(canteen.menu || '[]');
  const itemToAdd = { ...newItem, id: newItem.id || `m${Date.now()}` };
  menu.push(itemToAdd);
  
  await db.run('UPDATE canteens SET menu = ? WHERE id = ?', [JSON.stringify(menu), canteenId]);
  res.status(201).json(itemToAdd);
});

app.put('/api/admin/canteens/:canteenId/menu/:itemId', async (req, res) => {
  const { canteenId, itemId } = req.params;
  const updates = req.body;
  const db = await getDb();
  
  const canteen = await db.get('SELECT menu FROM canteens WHERE id = ?', [canteenId]);
  if (!canteen) return res.status(404).json({ message: 'Canteen not found' });
  
  const menu = JSON.parse(canteen.menu || '[]');
  const menuIdx = menu.findIndex(m => m.id === itemId);
  if (menuIdx === -1) return res.status(404).json({ message: 'Menu item not found' });
  
  menu[menuIdx] = { ...menu[menuIdx], ...updates };
  await db.run('UPDATE canteens SET menu = ? WHERE id = ?', [JSON.stringify(menu), canteenId]);
  
  res.status(200).json(menu[menuIdx]);
});

// WALLET ENDPOINTS
app.get('/api/wallet/balance', async (req, res) => {
  const db = await getDb();
  const wallet = await db.get('SELECT * FROM wallet LIMIT 1');
  res.status(200).json(wallet || { balance: 0 });
});

app.post('/api/wallet/topup', async (req, res) => {
  const { amount } = req.body;
  const db = await getDb();
  await db.run('UPDATE wallet SET balance = balance + ?', [amount]);
  const wallet = await db.get('SELECT * FROM wallet LIMIT 1');
  res.status(200).json(wallet);
});

// FEEDBACK ENDPOINT
app.post('/api/feedback', async (req, res) => {
  const { rating, feedback } = req.body;
  const db = await getDb();
  const date = new Date().toISOString();
  const result = await db.run('INSERT INTO feedback (rating, feedback, date) VALUES (?, ?, ?)', [rating, feedback, date]);
  res.status(201).json({ id: result.lastID, rating, feedback, date });
});

// ADMIN ENDPOINTS
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await getDb();
  const admin = await db.get('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password]);
  if (admin) {
    res.status(200).json({ token: 'mock-admin-jwt-token-123', username: admin.username });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  const db = await getDb();
  const orders = await db.all('SELECT * FROM orders ORDER BY timestamp DESC');
  const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = orders.length;
  const recentOrders = orders.slice(0, 10).map(o => ({ ...o, itemIds: JSON.parse(o.itemIds || '[]') }));
  res.status(200).json({ totalSales, totalOrders, recentOrders });
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = await getDb();
  const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
  if (order) {
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    order.status = status;
    order.itemIds = JSON.parse(order.itemIds || '[]');
    return res.status(200).json(order);
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
