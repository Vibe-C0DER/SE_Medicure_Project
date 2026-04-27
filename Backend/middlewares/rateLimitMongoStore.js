import RateLimitModel from '../models/rateLimit.model.js';

export default class MongoStore {
    constructor(options = {}) {
        this.storeName = options.storeName || 'default';
        // We defer windowMs configuration until the init() method is called by express-rate-limit 
        // to conform to the v8 store interface
    }

    /**
     * Called by express-rate-limit on initialization
     */
    init(options) {
        this.windowMs = options.windowMs;
    }

    async increment(key) {
        const now = new Date();
        const expireAt = new Date(now.getTime() + this.windowMs);

        const record = await RateLimitModel.findOneAndUpdate(
            { key, storeName: this.storeName },
            {
                $inc: { count: 1 },
                $setOnInsert: { expireAt } // Set expiration only on creation
            },
            { upsert: true, new: true }
        );

        // If the record's expire time has passed (due to TTL deletion lag), recreate it
        if (record.expireAt < now) {
            await RateLimitModel.updateOne(
                 { _id: record._id },
                 { $set: { count: 1, expireAt } }
            );
            return {
                totalHits: 1,
                resetTime: expireAt
            };
        }

        return {
            totalHits: record.count,
            resetTime: record.expireAt
        };
    }

    async decrement(key) {
        await RateLimitModel.updateOne(
            { key, storeName: this.storeName },
            { $inc: { count: -1 } }
        );
    }

    async resetKey(key) {
        await RateLimitModel.deleteOne({ key, storeName: this.storeName });
    }
}
