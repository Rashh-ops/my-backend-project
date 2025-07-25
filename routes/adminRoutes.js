const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

router.get('/admin-panel', protect, adminOnly, (req, res) => {
  res.json({ message: `Hello Admin ${req.user.id}, welcome to the panel.` });
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const protect = require('../middleware/authMiddleware');

// router.get('/admin-panel', protect, (req, res) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied: You are not an admin.' });
//   }

//   res.json({ message: `Hello Admin ${req.user.id}, welcome to the panel.` });
// });

// module.exports = router;

//const router = express.Router();
const User = require('../models/userModel');


// GET /api/admin/users - Only accessible by admin
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// ✅ Delete any user by ID (Admin only)
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// ✅ Update any user by ID (Admin only)
router.put('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const users = await User.countDocuments({ role: 'user' });

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    res.json({
      totalUsers,
      admins,
      users,
      recentUsers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

module.exports = router;
