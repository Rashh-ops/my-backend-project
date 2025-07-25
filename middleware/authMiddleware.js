const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for token
  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // You can access this in your routes/controllers
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = protect;
