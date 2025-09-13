const Redis = require("ioredis");
const redis = new Redis(); // defaults to 127.0.0.1:6379

// limit: max requests, window: time in seconds
function rateLimiter({ limit, window }) {
  return async (req, res, next) => {
    try {
      const ip = req.ip;
      const key = `rate:${ip}`;

      // increment counter
      const count = await redis.incr(key);

      if (count === 1) {
        // first request, set expiry
        await redis.expire(key, window);
      }

      if (count > limit) {
        return res.status(429).json({
          message: "Too many requests, please try again later.",
        });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      // fail open
      next();
    }
  };
}

module.exports = rateLimiter;
