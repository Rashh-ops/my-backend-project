const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup


const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // your email util


exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const token = crypto.randomBytes(20).toString('hex');

    const newUser = new User({
      name,
      email,
      password,
      role,
      emailVerificationToken: token
    });

    await newUser.save();


    

    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;
    await sendEmail(newUser.email, "Verify your email", `<a href="${verificationUrl}">Click to verify</a>`);

    res.status(201).json({ message: "User registered. Check your email to verify." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Create token
   const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
   );


    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const nodemailer = require('nodemailer');



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(20).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;
  const html = `
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
  `;

  await sendEmail(user.email, "Reset Your Password", html);

  res.json({ message: "Reset email sent" });
};


exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = password; // ✅ Hashing happens in pre('save')
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.verified = true;
    user.emailVerificationToken = undefined; // clear it
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.verified) return res.status(400).json({ message: 'Email already verified' });

  // ✅ Use same field name as in signup
  const emailToken = crypto.randomBytes(20).toString('hex');
  user.emailVerificationToken = emailToken;
  await user.save();

  const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email/${emailToken}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Click below to verify your account:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
    <p>This link will expire in 1 hour.</p>
  `;

  await sendEmail(user.email, "Verify Your Email", html);

  res.json({ message: 'Verification email resent successfully' });
};
