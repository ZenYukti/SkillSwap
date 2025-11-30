/**
 * Admin Controller
 */

const User = require('../models/User');
const Skill = require('../models/Skill');
const BarterDeal = require('../models/BarterDeal');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

exports.getDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalSkills = await Skill.countDocuments();
  const totalDeals = await BarterDeal.countDocuments();

  res.json({ success: true, data: { totalUsers, totalSkills, totalDeals } });
});

exports.listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -refreshToken -resetPasswordToken');
  res.json({ success: true, data: users });
});

exports.deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false, isDeactivated: true }, { new: true });
  if (!user) throw new ApiError('User not found', 404);
  res.json({ success: true, data: user });
});

exports.forceCompleteDeal = asyncHandler(async (req, res) => {
  const deal = await BarterDeal.findById(req.params.id);
  if (!deal) throw new ApiError('Deal not found', 404);

  deal.status = 'completed';
  deal.completedAt = new Date();
  await deal.save();
  res.json({ success: true, data: deal });
});

exports.removeSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) throw new ApiError('Skill not found', 404);
  await skill.remove();
  res.json({ success: true, message: 'Skill removed' });
});

module.exports = exports;