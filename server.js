import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './server/models/User.js';
import Canteen from './server/models/Canteen.js';
import Product from './server/models/Product.js';
import Order from './server/models/Order.js';
import Story from './server/models/Story.js';
import SupportTicket from './server/models/SupportTicket.js';
import { requireAuth, requireRole } from './server/middleware/auth.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow frontend vite server
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Synchronous FS Operations for Lab 7
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDataDir = path.join(__dirname, 'server_data');

if (!fs.existsSync(serverDataDir)) {
  fs.mkdirSync(serverDataDir, { recursive: true });
  console.log('Synchronous FS: Created server_data directory securely on the backend.');
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Connect to MongoDB with timeout resilience
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 3000
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.warn('MongoDB connection note (JSON fallback enabled):', err.message));

// AUTH ROUTES
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, regNo, email, phone, password, role } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
      
      const user = new User({
        name, regNo, email: email.toLowerCase(), phone, password: hashedPassword, avatarUrl, role: role || 'student', walletBalance: 500
      });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'supersecret_canteen_rush_key_2026', { expiresIn: '7d' });
      
      const userObj = user.toObject();
      delete userObj.password;
      
      return res.status(201).json({ user: userObj, token });
    }

    // Offline / Standalone Mock Signup Fallback
    const mockUser = {
      _id: 'mock_user_' + Date.now(),
      name,
      regNo: regNo || '21BCA401',
      email: email.toLowerCase(),
      phone: phone || '9876543210',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      role: role || 'student',
      walletBalance: 500
    };
    const token = jwt.sign({ userId: mockUser._id }, process.env.JWT_SECRET || 'supersecret_canteen_rush_key_2026', { expiresIn: '7d' });
    res.status(201).json({ user: mockUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'supersecret_canteen_rush_key_2026', { expiresIn: '7d' });
      
      const userObj = user.toObject();
      delete userObj.password;
      
      return res.status(200).json({ user: userObj, token });
    }

    // Offline / Standalone Mock Login Fallback
    const mockUser = {
      _id: 'mock_devansh',
      name: 'Devansh Gupta',
      regNo: '21BCA401',
      email: email.toLowerCase(),
      phone: '9876543210',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Devansh`,
      role: 'student',
      walletBalance: 750
    };
    const token = jwt.sign({ userId: mockUser._id }, process.env.JWT_SECRET || 'supersecret_canteen_rush_key_2026', { expiresIn: '7d' });
    res.status(200).json({ user: mockUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const userObj = req.user.toObject ? req.user.toObject() : req.user;
  delete userObj.password;
  res.status(200).json(userObj);
});

// CANTEEN ROUTES
app.get('/api/canteens', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const canteens = await Canteen.find();
      if (canteens && canteens.length > 0) return res.status(200).json(canteens);
    }
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'server', 'data', 'canteens.json'), 'utf8'));
    res.status(200).json(data);
  } catch (error) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'server', 'data', 'canteens.json'), 'utf8'));
      return res.status(200).json(data);
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

app.patch('/api/canteens/:id/status', requireAuth, requireRole(['vendor', 'admin']), async (req, res) => {
  try {
    const { isOpen } = req.body;
    const canteen = await Canteen.findByIdAndUpdate(req.params.id, { isOpen }, { new: true });
    if (!canteen) return res.status(404).json({ message: 'Canteen not found' });
    res.status(200).json(canteen);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/canteens/:id', async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id);
    if (!canteen) return res.status(404).json({ message: 'Canteen not found' });
    res.status(200).json(canteen);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PRODUCT ROUTES
app.get('/api/canteens/:canteenId/products', async (req, res) => {
  try {
    const products = await Product.find({ canteenId: req.params.canteenId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/explore', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { q, category } = req.query;
      let query = {};
      if (q) {
        query.name = { $regex: q, $options: 'i' };
      }
      if (category && category !== 'All') {
        query.category = category;
      }
      const products = await Product.find(query).populate('canteenId', 'name');
      if (products && products.length > 0) return res.status(200).json(products);
    }
    const canteensData = JSON.parse(fs.readFileSync(path.join(__dirname, 'server', 'data', 'canteens.json'), 'utf8'));
    const allProducts = canteensData.flatMap(c => (c.menu || []).map(m => ({ ...m, canteenId: { _id: c.id, name: c.name } })));
    res.status(200).json(allProducts);
  } catch (error) {
    try {
      const canteensData = JSON.parse(fs.readFileSync(path.join(__dirname, 'server', 'data', 'canteens.json'), 'utf8'));
      const allProducts = canteensData.flatMap(c => (c.menu || []).map(m => ({ ...m, canteenId: { _id: c.id, name: c.name } })));
      res.status(200).json(allProducts);
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// ORDER ROUTES
app.post('/api/lab7/save-order', async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;
    const orderDetails = `[${new Date().toISOString()}] New Order | Total: ₹${totalAmount} | Payment: ${paymentMethod} | Items: ${items.map(i => i.name).join(', ')}\n`;
    
    // Asynchronous FS Operation
    const filePath = path.join(serverDataDir, 'canteen_orders.txt');
    await fsPromises.appendFile(filePath, orderDetails);
    
    res.status(200).json({ message: 'Order saved securely to server file system' });
  } catch (error) {
    console.error('FS Write Error:', error);
    res.status(500).json({ message: 'Failed to write to file system' });
  }
});

app.post('/api/orders', requireAuth, async (req, res) => {
  try {
    const { items, totalAmount, type, deliveryAddress, tableNumber, canteenId, paymentMethod = 'wallet' } = req.body;
    
    if (paymentMethod === 'wallet') {
      if (req.user.walletBalance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      req.user.walletBalance -= totalAmount;
      await req.user.save();
    }

    const newOrder = new Order({
      userId: req.user._id,
      canteenId,
      items,
      totalAmount,
      type,
      deliveryAddress,
      tableNumber,
      paymentMethod,
      status: 'received'
    });

    await newOrder.save();
    
    if (canteenId) {
      io.to(`canteen_${canteenId}`).emit('new_order', newOrder);
    }
    io.emit('new_order', newOrder);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'vendor' || req.user.role === 'admin') {
      orders = await Order.find().sort({ timestamp: -1 })
        .populate('userId', 'name phone')
        .populate('canteenId', 'name')
        .populate('items.productId', 'calories protein carbs');
    } else {
      orders = await Order.find({ userId: req.user._id }).sort({ timestamp: -1 })
        .populate('canteenId', 'name')
        .populate('items.productId', 'calories protein carbs');
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('canteenId', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/orders/:id/status', requireAuth, requireRole(['vendor', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    io.to(`user_${order.userId}`).emit('order_status_updated', order);
    io.emit('order_status_updated', order);
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/orders/:id/cancel', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status !== 'received') {
      return res.status(400).json({ message: 'Cannot cancel order that is already being prepared' });
    }

    order.status = 'cancelled';
    await order.save();

    // Refund wallet
    req.user.walletBalance += order.totalAmount;
    await req.user.save();

    io.to(`user_${order.userId}`).emit('order_status_updated', order);
    io.emit('order_status_updated', order);

    res.status(200).json({ message: 'Order cancelled', order, newBalance: req.user.walletBalance });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/orders/:id/rate', requireAuth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });
    if (order.status !== 'delivered') return res.status(400).json({ message: 'Order must be delivered to rate' });

    order.rating = rating;
    order.review = review;
    await order.save();
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users/favorites/toggle', requireAuth, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    
    const index = user.favorites.indexOf(productId);
    if (index === -1) {
      user.favorites.push(productId);
    } else {
      user.favorites.splice(index, 1);
    }
    
    await user.save();
    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/products/:id/stock', requireAuth, requireRole(['vendor', 'admin']), async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/products/:id/status', requireAuth, requireRole(['vendor', 'admin']), async (req, res) => {
  try {
    const { isSoldOut } = req.body;
    const stock = isSoldOut ? 0 : 50;
    const product = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/products/:id/price', requireAuth, requireRole(['vendor', 'admin']), async (req, res) => {
  try {
    const { price, originalPrice } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { price }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/products', requireAuth, requireRole(['vendor', 'admin']), async (req, res) => {
  try {
    const { canteenId, name, description, price, type, category, image, prepTime, stock } = req.body;
    const product = new Product({
      canteenId, name, description, price, 
      isVeg: type === 'veg', 
      category, image, stock: stock || 50
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/products/:id', requireAuth, requireRole(['vendor', 'admin']), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/analytics/vendor', requireAuth, requireRole(['vendor', 'admin']), async (req, res) => {
  try {
    // Simple analytics: aggregate completed orders
    const orders = await Order.find({ status: { $in: ['ready', 'delivered'] } });
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    
    // Top items
    const itemCounts = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
      });
    });
    
    const topItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.status(200).json({ totalRevenue, totalOrders, topItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/stats', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total platform revenue
    const orders = await Order.find({ status: 'delivered' });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Support tickets
    const supportTickets = await SupportTicket.find().sort({ createdAt: -1 });

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      supportTickets
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Support Ticket Endpoints ---
app.get('/api/support/tickets', requireAuth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/support/tickets', requireAuth, async (req, res) => {
  try {
    const { category, subject, message } = req.body;
    const newTicket = new SupportTicket({
      userId: req.user.id,
      category,
      subject,
      message,
      status: 'submitted',
      messages: [{ sender: 'user', text: message }]
    });
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/support/tickets/:id/message', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    const ticket = await SupportTicket.findOne({ _id: req.params.id, userId: req.user.id });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    ticket.messages.push({ sender: 'user', text });
    if (ticket.status === 'submitted') ticket.status = 'processing';
    
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// STORY ROUTES
app.get('/api/stories', async (req, res) => {
  try {
    const stories = await Story.find().sort({ _id: -1 });
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
