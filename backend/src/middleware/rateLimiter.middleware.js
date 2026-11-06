/**
 * Lightweight in-memory sliding-window rate limiter
 * Protects endpoints from abuse without introducing heavy Redis/memcached dependencies
 */
const rateLimitMap = new Map();

/**
 * Creates a rate limiting middleware
 * @param {Object} options
 * @param {number} [options.windowMs=60000] - Time window in milliseconds (default 1 min)
 * @param {number} [options.maxRequests=100] - Max allowed requests per IP in the window
 * @param {string} [options.message='Too many requests, please try again later.']
 */
export function rateLimiter({
  windowMs = 60 * 1000,
  maxRequests = 100,
  message = 'Too many requests from this IP, please try again later.',
} = {}) {
  // Cleanup stale IP entries periodically every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now - data.startTime > windowMs) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    let record = rateLimitMap.get(ip);
    if (!record || now - record.startTime > windowMs) {
      record = {
        count: 1,
        startTime: now,
      };
      rateLimitMap.set(ip, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    const resetTime = Math.ceil((record.startTime + windowMs - now) / 1000);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTime);

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          message,
          status: 429,
          retryAfterSeconds: resetTime,
        },
      });
    }

    next();
  };
}

export default rateLimiter;

