const User = require('../models/userModel');

/**
 * GET /api/users
 * Supports ?search, ?role, ?page, ?limit
 */
const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 5 } = req.query;

    // Build query object
    const query = {};
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;

    const skip = (page - 1) * limit;

    // Execute query with pagination
    const users = await User.find(query)
                            .skip(skip)
                            .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      total,
      page:  Number(page),
      limit: Number(limit),
      users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getAllUsers };
