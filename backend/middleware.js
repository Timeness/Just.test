

const rateLimit = {};
const windowTime = 10 * 1000;
const maxRequests = 5;

module.exports = function rateLimiter(req, res, next) {
  const ip = req.ip;
  const currentTime = Date.now();

  if (!rateLimit[ip]) {
    rateLimit[ip] = [];
  }

  rateLimit[ip] = rateLimit[ip].filter(ts => currentTime - ts < windowTime);

  if (rateLimit[ip].length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  rateLimit[ip].push(currentTime);
  next();
};
