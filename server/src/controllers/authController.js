/**
 * Auth Controller
 * 
 * Handles user authentication: register, login, refresh tokens, logout, forgot password.
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

// Helper: sign token
const signToken = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn });

// Helper: send tokens (access in response body; refresh as HttpOnly cookie)
const sendTokens = (res, user, accessToken, refreshToken) => {
  // Set refresh token as HttpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    success: true,
    data: {
      user,
      accessToken
    }
  });
};

// Register
exports.register = asyncHandler(async (req, res) => {
  const { email, password, name, username } = req.body;

  // Check if user exists
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    throw new ApiError('Email or username already in use', 400);
  }

  // Create user
  const user = await User.create({ email, password, name, username });

  // Sign tokens
  const accessToken = signToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRE || '15m');
  const refreshToken = signToken({ id: user._id }, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRE || '7d');

  user.refreshToken = refreshToken;
  await user.save();

  const userSafe = user.toJSON();

  sendTokens(res, userSafe, accessToken, refreshToken);
});

// Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    throw new ApiError('Invalid credentials', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError('Invalid credentials', 401);
  }

  // Sign tokens
  const accessToken = signToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRE || '15m');
  const refreshToken = signToken({ id: user._id }, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRE || '7d');

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  const userSafe = user.toJSON();

  sendTokens(res, userSafe, accessToken, refreshToken);
});

// Refresh token
exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken || req.headers['x-refresh-token'];
  if (!token) {
    throw new ApiError('Refresh token missing', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user) throw new ApiError('User not found', 401);

    if (user.refreshToken !== token) {
      // possible reuse or logout
      user.refreshToken = null;
      await user.save();
      throw new ApiError('Invalid refresh token', 401);
    }

    // Issue new tokens
    const accessToken = signToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRE || '15m');
    const refreshToken = signToken({ id: user._id }, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRE || '7d');

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    throw new ApiError('Refresh token invalid or expired', 401);
  }
});

// Logout
exports.logout = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  if (userId) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: true } });
  }

  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

// Forgot password (placeholder) - create reset token and return placeholder
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError('Email is required', 400);

  const user = await User.findOne({ email });
  if (!user) {
    // Do not reveal whether email exists
    return res.json({ success: true, message: 'If that email exists, a reset link was sent' });
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
  await user.save();

  // Placeholder: return token in response for dev use (in production, email it)
  return res.json({ success: true, message: 'Password reset token generated', resetToken });
});

// Reset password (placeholder) - accepts token and new password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) throw new ApiError('Token and new password required', 400);

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: tokenHash, resetPasswordExpire: { $gt: Date.now() } }).select('+password');
  if (!user) throw new ApiError('Invalid or expired token', 400);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: 'Password has been reset' });
});

// Get current authenticated user
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

module.exports = exports;
