const rateLimit = require('express-rate-limit');

// 🛡️ Login limiter: 5 req/min
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Too many login attempts. Please try again after a minute.',
  standardHeaders: true,
  legacyHeaders: false,
});

// 🛡️ Signup limiter: 3 req/hour
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many signup attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  signupLimiter
};
