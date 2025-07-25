const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const User = require('../models/userModel');


const { loginLimiter, signupLimiter } = require('../middleware/rateLimit');

// Apply rate limiter
router.post('/signup', signupLimiter, authController.signup);
router.post('/login', loginLimiter, authController.login);


router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});



// 📄 routes/authRoutes.js

// ✅ Update logged-in user
router.put('/me', protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// ✅ Delete logged-in user
router.delete('/me', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail // ✅ Import this
} = require('../controllers/authController');

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// routes/authRoutes.js
router.get('/verify-email/:token', verifyEmail);

// routes/authRoutes.js

const { resendVerificationEmail } = require('../controllers/authController');

router.post('/resend-verification', resendVerificationEmail);

