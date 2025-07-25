// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  profilePic: String,
  resetToken: String,
  resetTokenExpiry: Date,
  // models/userModel.js
  // models/userModel.js
verified: { type: Boolean, default: false },
emailVerificationToken: String,


}, { timestamps: true });

// ✅ HASH PASSWORD ON SAVE
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
