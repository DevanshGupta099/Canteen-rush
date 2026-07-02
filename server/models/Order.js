import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  canteenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    name: { type: String },
    price: { type: Number },
    modifiers: [{
      name: { type: String },
      extraPrice: { type: Number }
    }]
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['received', 'preparing', 'ready', 'delivered'], default: 'received' },
  type: { type: String, enum: ['takeaway', 'dine-in', 'hostel'], default: 'takeaway' },
  paymentMethod: { type: String, enum: ['wallet', 'upi', 'card'], default: 'wallet' },
  timestamp: { type: Date, default: Date.now },
  deliveryAddress: { type: String },
  tableNumber: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
