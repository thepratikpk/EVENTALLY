// Simple in-memory cache middleware for events
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = process.env.NODE_ENV === 'production' ? 200 : 100;

export const cacheMiddleware = (duration = CACHE_DURATION) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = req.originalUrl;
        const cachedResponse = cache.get(key);

        if (cachedResponse && Date.now() - cachedResponse.timestamp < duration) {
            // Add cache hit header for debugging
            res.set('X-Cache', 'HIT');
            return res.json(cachedResponse.data);
        }

        // Override res.json to cache the response
        const originalJson = res.json;
        res.json = function(data) {
            // Only cache successful responses
            if (res.statusCode === 200) {
                cache.set(key, {
                    data,
                    timestamp: Date.now()
                });
            }
            
            // Clean up old cache entries periodically
            if (cache.size > MAX_CACHE_SIZE) {
                const now = Date.now();
                let cleaned = 0;
                for (const [cacheKey, value] of cache.entries()) {
                    if (now - value.timestamp > duration) {
                        cache.delete(cacheKey);
                        cleaned++;
                    }
                }
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`🧹 Cache cleanup: removed ${cleaned} expired entries`);
                }
            }
            
            // Add cache miss header for debugging
            res.set('X-Cache', 'MISS');
            return originalJson.call(this, data);
        };

        next();
    };
};

// Clear cache when events are modified
export const clearEventCache = () => {
    for (const key of cache.keys()) {
        if (key.includes('/events')) {
            cache.delete(key);
        }
    }
};