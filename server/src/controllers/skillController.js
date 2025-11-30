/**
 * Skill Controller
 */

const Skill = require('../models/Skill');
const User = require('../models/User');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

exports.createSkill = asyncHandler(async (req, res) => {
  const payload = {
    user: req.user._id,
    ...req.body
  };
  
  const skill = await Skill.create(payload);
  res.json({ success: true, data: skill });
});

exports.updateSkill = asyncHandler(async (req, res) => {
  const skillId = req.params.id;
  const skill = await Skill.findById(skillId);
  if (!skill) throw new ApiError('Skill not found', 404);
  if (skill.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') throw new ApiError('Not authorized', 403);

  Object.assign(skill, req.body);
  await skill.save();

  res.json({ success: true, data: skill });
});

exports.deleteSkill = asyncHandler(async (req, res) => {
  const skillId = req.params.id;
  const skill = await Skill.findById(skillId);
  if (!skill) throw new ApiError('Skill not found', 404);
  if (skill.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') throw new ApiError('Not authorized', 403);

  await skill.remove();
  res.json({ success: true, message: 'Skill removed' });
});

exports.getSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id).populate('user', 'name username avatar trustScore averageRating');
  if (!skill) throw new ApiError('Skill not found', 404);
  res.json({ success: true, data: skill });
});

exports.listSkills = asyncHandler(async (req, res) => {
  const { q, category, type, level, mode, page = 1, limit = 12 } = req.query;
  const filters = {};
  if (category) filters.category = category;
  if (type) filters.type = type;
  if (level) filters.level = level;
  if (mode) filters.mode = mode;

  let skills;
  if (q) {
    skills = await Skill.searchSkills(q, filters);
  } else if (category) {
    skills = await Skill.getByCategory(category, type);
  } else {
    skills = await Skill.find({ isActive: true, isPaused: false, ...filters })
      .populate('user', 'name username avatar trustScore averageRating')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
  }

  res.json({ success: true, data: skills });
});

// Increment view count endpoint
exports.incrementView = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) throw new ApiError('Skill not found', 404);
  await skill.incrementViews();
  res.json({ success: true, data: skill });
});

// My offers/requests
exports.mySkills = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const query = { user: req.user._id };
  if (type) query.type = type;
  const skills = await Skill.find(query).sort({ createdAt: -1 });
  res.json({ success: true, data: skills });
});