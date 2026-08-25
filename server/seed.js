import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Canteen from './models/Canteen.js';
import Product from './models/Product.js';
import Story from './models/Story.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const canteensData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'canteens.json'), 'utf-8'));

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB. Wiping old data...');

    await Canteen.deleteMany({});
    await Product.deleteMany({});
    await Story.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding Canteens & Products from canteens.json...');
    
    const canteenDocs = canteensData.map(c => ({
      name: c.name,
      image: c.image,
      rating: c.rating || 4.7,
      reviews: c.totalRatings || 500,
      deliveryTime: c.waitTime || '10-15 mins',
      tags: [c.menu[0]?.category || 'Meals', 'Snacks', 'Beverages'],
      location: 'Central Campus',
      description: c.description
    }));

    const insertedCanteens = await Canteen.insertMany(canteenDocs);
    const canteenMap = {};
    insertedCanteens.forEach(c => { canteenMap[c.name] = c._id; });

    const products = [];
    canteensData.forEach(c => {
      const cId = canteenMap[c.name];
      if (cId && c.menu && c.menu.length > 0) {
        c.menu.forEach(m => {
          products.push({
            canteenId: cId,
            name: m.name,
            price: m.price,
            image: m.image,
            category: m.category || 'Meals',
            isVeg: m.type === 'veg',
            isBestseller: m.tag === 'Bestseller' || m.tag === 'Trending' || m.tag === 'Iconic',
            description: m.description,
            prepTime: m.prepTime || 5
          });
        });
      }
    });

    await Product.insertMany(products);
    console.log(`Successfully seeded ${insertedCanteens.length} canteens and ${products.length} products!`);

    console.log('Seeding Stories...');
    const stories = [
      { canteenId: canteenMap['Gourmet Central'], title: 'Gourmet Central', image: '/images/the_gourmet.png', highlightText: 'Special', headline: 'Combo Meals at 20% Off' },
      { canteenId: canteenMap['Christ University Bakery'], title: 'Christ Bakery', image: '/images/food/item_29.jpg', highlightText: 'Iconic', headline: 'Pazham Pori Fritters Re-stocked!' },
      { canteenId: canteenMap['Ivy Hall'], title: 'Ivy Hall', image: '/images/food/item_7.jpg', highlightText: 'Trending', headline: 'Spicy Korean Ramen Bowls Ready in 8 mins' },
      { canteenId: canteenMap['Nandini Milk Parlour'], title: 'Nandini Parlour', image: '/images/food/item_43.jpg', highlightText: 'Summer Special', headline: 'Thick Chocolate Fudge Shakes available now' },
      { canteenId: canteenMap['Mingos Kitchen'], title: 'Mingos Kitchen', image: '/images/food/item_6.jpg', highlightText: 'Hot Deal', headline: 'Loaded Cheesy Peri Fries @ ₹150' }
    ];
    await Story.insertMany(stories.filter(s => s.canteenId));

    console.log('Seeding default admin vendor...');
    const hashedAdminPassword = await bcrypt.hash('admin', 10);
    const adminUser = new User({
      name: 'Admin Vendor',
      regNo: 'ADMIN001',
      email: 'vendor@canteenrush.com',
      phone: '9999999999',
      password: hashedAdminPassword,
      role: 'vendor',
      walletBalance: 0
    });
    await adminUser.save();

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
