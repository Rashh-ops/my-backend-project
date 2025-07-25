const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

const rateLimit = require('express-rate-limit');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');


app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(globalLimiter); // 💥 applies to all routes
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.info("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/admin', adminRoutes);     // changed from /api/users
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads')); // serve images


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
