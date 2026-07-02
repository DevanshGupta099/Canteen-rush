import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  canteenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen', required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  highlightText: { type: String },
  headline: { type: String }
}, { timestamps: true });

export default mongoose.model('Story', storySchema);
