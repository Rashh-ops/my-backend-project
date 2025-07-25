const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

router.get('/dashboard', protect, (req, res) => {
  res.json({
    message: `Welcome ${req.user.id}, this is a protected dashboard.`,
  });
});

module.exports = router;
