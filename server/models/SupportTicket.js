import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['submitted', 'processing', 'resolved'], default: 'submitted' },
  messages: [{
    sender: { type: String, enum: ['user', 'agent'] },
    text: { type: String },
    time: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('SupportTicket', supportTicketSchema);
