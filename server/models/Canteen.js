import mongoose from 'mongoose';

const canteenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  deliveryTime: { type: String, required: true },
  tags: [{ type: String }],
  isOpen: { type: Boolean, default: true },
  location: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Canteen', canteenSchema);
