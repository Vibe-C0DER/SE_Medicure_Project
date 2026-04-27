import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import MongoStore from './rateLimitMongoStore.js'; // Our clean Custom Store

// Helper to determine the key: userId if logged in, otherwise IP address
const generateKey = (req) => {
    // Determine user ID if token was decoded via verifyToken
    if (req.user && (req.user.id || req.user._id)) {
        return req.user.id || req.user._id;
    }
    return ipKeyGenerator(req); // Fallback to IP address
};

// Generic error message handler for rate limits
const handler = (req, res, next, options) => {
    res.status(429).json({
        success: false,
        message: "Too many requests, please try again later"
    });
};

/**
 * 1. AI Analysis Limiter: 10 requests / hour / user
 */
export const analyzeLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // Max 10 requests per window
    keyGenerator: generateKey,
    handler,
    store: new MongoStore({ storeName: 'ai_analyze_limit' }),
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * 2. Google Maps Limiter: 30 requests / hour / user
 */
export const mapsLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 30, // Max 30 req per window
    keyGenerator: generateKey,
    handler,
    store: new MongoStore({ storeName: 'maps_limit' }),
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * 3. Reports Creation Limiter: 20 requests / day / user
 */
export const reportsLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours (1 day)
    limit: 20, // Max 20 req per window
    keyGenerator: generateKey,
    handler,
    store: new MongoStore({ storeName: 'reports_create_limit' }),
    standardHeaders: true,
    legacyHeaders: false,
});
