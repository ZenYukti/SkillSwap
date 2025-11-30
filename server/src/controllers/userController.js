/**
 * User Controller
 * 
 * Handles profile CRUD and account management.
 */

const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const { FILE_UPLOAD } = require('../config/constants');

exports.getPublicProfile = asyncHandler(async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username }).select('-email -refreshToken -resetPasswordToken -resetPasswordExpire');
  if (!user) throw new ApiError('User not found', 404);

  res.json({ success: true, data: user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const update = { ...req.body };

  // Remove sensitive fields
  delete update.role;
  delete update.email;
  delete update.skillCoins;

  // Handle avatar upload path if present
  if (req.file) {
    update.avatar = `/uploads/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });
  res.json({ success: true, data: user });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw new ApiError('User not found', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError('Current password is incorrect', 400);

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated' });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

exports.disableAccount = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, { isActive: false, isDeactivated: true }, { new: true });
  res.json({ success: true, data: user, message: 'Account disabled' });
});

exports.listUsers = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  const query = {};
  if (q) {
    query.$text = { $search: q };
  }

  const users = await User.find(query)
    .select('name username avatar trustScore averageRating completedDeals')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({ success: true, data: users });
});

// Upload avatar removal
exports.removeAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError('User not found', 404);

  if (user.avatar) {
    const p = path.join(__dirname, '../../', user.avatar.replace(/^\//, ''));
    try {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    } catch (err) {
      // ignore
    }
    user.avatar = '';
    await user.save();
  }

  res.json({ success: true, data: user, message: 'Avatar removed' });
});
