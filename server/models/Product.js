import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  canteenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  description: { type: String },
  stock: { type: Number, default: 100 },
  calories: { type: Number, default: 350 }, // default mock value
  protein: { type: Number, default: 15 },
  carbs: { type: Number, default: 45 },
  modifiers: [{
    name: { type: String },
    extraPrice: { type: Number }
  }]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
