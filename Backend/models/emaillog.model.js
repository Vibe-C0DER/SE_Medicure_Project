import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    required: true, 
    default: 'weekly_digest' 
  },
  sentAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model('EmailLog', emailLogSchema);
