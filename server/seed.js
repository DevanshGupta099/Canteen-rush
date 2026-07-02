import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Canteen from './models/Canteen.js';
import Product from './models/Product.js';
import Story from './models/Story.js';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB. Wiping old data...');

    await Canteen.deleteMany({});
    await Product.deleteMany({});
    await Story.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding Canteens...');
    const canteens = [
      { name: 'Gourmet Central', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', rating: 4.8, reviews: 1250, deliveryTime: '15-20 min', tags: ['North Indian', 'Chinese', 'Beverages'], location: 'Central Block, Ground Floor', description: 'The main campus cafeteria serving diverse multi-cuisine meals.' },
      { name: 'Fresh Bites', image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=1200&q=80', rating: 4.5, reviews: 850, deliveryTime: '10-15 min', tags: ['Healthy', 'Salads', 'Juices'], location: 'Block IV, 2nd Floor', description: 'Your go-to place for healthy salads and fresh juices.' },
      { name: 'Cafe Spice', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', rating: 4.6, reviews: 920, deliveryTime: '20-25 min', tags: ['South Indian', 'Snacks'], location: 'Block II, Ground Floor', description: 'Authentic South Indian breakfast and quick bites.' },
      { name: 'The Bakehouse', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80', rating: 4.9, reviews: 2100, deliveryTime: '5-10 min', tags: ['Bakery', 'Coffee', 'Desserts'], location: 'Library Block', description: 'Freshly baked pastries and artisanal coffee.' }
    ];

    const insertedCanteens = await Canteen.insertMany(canteens);
    const canteenMap = {};
    insertedCanteens.forEach(c => canteenMap[c.name] = c._id);

    console.log('Seeding Products...');
    const products = [
      { canteenId: canteenMap['Gourmet Central'], name: 'Paneer Butter Masala Combo', price: 150, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', category: 'Main Course', isVeg: true, isBestseller: true, description: 'Rich paneer gravy served with 2 butter naans' },
      { canteenId: canteenMap['Gourmet Central'], name: 'Chicken Fried Rice', price: 120, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', category: 'Chinese', isVeg: false, isBestseller: false, description: 'Wok-tossed rice with tender chicken chunks' },
      { canteenId: canteenMap['The Bakehouse'], name: 'Cold Coffee with Ice Cream', price: 80, image: 'https://images.unsplash.com/photo-1461023058943-0708e5269383?auto=format&fit=crop&w=800&q=80', category: 'Beverages', isVeg: true, isBestseller: true, description: 'Thick cold coffee topped with vanilla scoop' },
      { canteenId: canteenMap['Fresh Bites'], name: 'Quinoa Salad Bowl', price: 110, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', category: 'Healthy', isVeg: true, isBestseller: false, description: 'Protein-packed salad with fresh veggies' },
      { canteenId: canteenMap['Cafe Spice'], name: 'Masala Dosa', price: 60, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', category: 'Breakfast', isVeg: true, isBestseller: true, description: 'Crispy crepe with spiced potato filling' }
    ];
    await Product.insertMany(products);

    console.log('Seeding Stories...');
    const stories = [
      { canteenId: canteenMap['Gourmet Central'], title: 'Gourmet Central', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', highlightText: 'Special', headline: 'Combo Meals at 20% Off' },
      { canteenId: canteenMap['The Bakehouse'], title: 'Bakehouse', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', highlightText: 'New', headline: 'Fresh Croissants arrived' }
    ];
    await Story.insertMany(stories);

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
