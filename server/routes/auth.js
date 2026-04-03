// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d'
  });
};

// POST /api/auth/register — Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with that email or username already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data format' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login — Authenticate a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email AND explicitly select the password field for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/forgotpassword — Send password reset email
router.post('/forgotpassword', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address' });
    }

    // Generate the reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Build the reset URL (points to the Angular frontend)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 2rem;">
        <h2 style="color: #667eea; margin-bottom: 0.5rem;">🔐 Password Reset</h2>
        <p style="color: #475569;">Hi <strong>${user.username}</strong>,</p>
        <p style="color: #475569;">We received a request to reset your SmartNotes password. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; text-decoration: none; border-radius: 10px; font-weight: 600; margin: 1rem 0;">Reset My Password</a>
        <p style="color: #94a3b8; font-size: 0.85rem;">This link expires in <strong>15 minutes</strong>. If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;" />
        <p style="color: #94a3b8; font-size: 0.75rem;">SmartNotes — Your intelligent note-taking companion.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'SmartNotes — Password Reset Request',
      html
    });

    res.json({ message: 'Password reset email sent successfully! Check your inbox.' });
  } catch (err) {
    // If email sending fails, clean up the token
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
  }
});

// PUT /api/auth/resetpassword/:resettoken — Reset the password
router.put('/resetpassword/:resettoken', async (req, res) => {
  try {
    // Hash the token from the URL to match it against the stored hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() } // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token. Please request a new one.' });
    }

    // Set the new password and clear the token fields
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      message: 'Password reset successful! You can now log in.',
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me — Get user profile (Protected route test)
const protect = require('../middleware/auth');
router.get('/me', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email
  });
});

module.exports = router;
