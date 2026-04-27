import express from 'express';
import { mapsLimiter } from '../middlewares/rateLimiter.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route for Google Maps wrapper
router.get('/', verifyToken, mapsLimiter, (req, res) => {
    // Replace with your actual maps logic
    return res.status(200).json({
        success: true,
        message: "Google Maps API data fetched successfully"
    });
});

export default router;
