import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
    key: { type: String, required: true },
    storeName: { type: String, required: true },
    count: { type: Number, default: 0 },
    expireAt: { type: Date, required: true }
});

// TTL index to automatically delete expired rate limit records
rateLimitSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
// Compound index for fast querying
rateLimitSchema.index({ key: 1, storeName: 1 }, { unique: true });

export default mongoose.models.RateLimit || mongoose.model('RateLimit', rateLimitSchema);
