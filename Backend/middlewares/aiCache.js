// In-memory cache using Map
const aiCache = new Map();

export const checkAiCache = (req, res, next) => {
    const { symptoms } = req.body; 
    
    // If no symptoms, skip cache check
    if (!symptoms) return next();

    // Create a normalized string key for the cache
    const cacheKey = symptoms.toLowerCase().trim();

    if (aiCache.has(cacheKey)) {
        console.log("Serving AI response from cache!");
        return res.status(200).json(aiCache.get(cacheKey));
    }

    // Add a custom method to `res` to allow the route controller to save the response to cache
    const originalSend = res.json;
    res.json = function(data) {
        // Only cache successful AI responses
        if (res.statusCode === 200 && data && data.success !== false) {
            aiCache.set(cacheKey, data);
            
            // Optional: Expire cache after 2 hours
            setTimeout(() => {
                aiCache.delete(cacheKey);
            }, 2 * 60 * 60 * 1000);
        }
        
        return originalSend.call(this, data);
    };

    next();
};
