/**
 * Skill Model
 * 
 * Represents a skill offer or request in the marketplace.
 * Users can post what they offer and what they're looking for.
 */

const mongoose = require('mongoose');
const { SKILL_CATEGORIES, SKILL_LEVELS, SKILL_MODES } = require('../config/constants');

const skillSchema = new mongoose.Schema({
  // Owner of the skill listing
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  // Type: offer or request
  type: {
    type: String,
    enum: ['offer', 'request'],
    required: [true, 'Skill type is required']
  },
  
  // Basic info
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Categorization
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: SKILL_CATEGORIES
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Details
  level: {
    type: String,
    enum: SKILL_LEVELS,
    required: [true, 'Skill level is required']
  },
  mode: {
    type: String,
    enum: SKILL_MODES,
    default: 'online'
  },
  
  // Time commitment
  estimatedTime: {
    value: {
      type: Number,
      min: [1, 'Estimated time must be at least 1']
    },
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'sessions'],
      default: 'hours'
    }
  },
  
  // SkillCoin pricing (optional)
  skillCoinPrice: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  
  // Availability
  isActive: {
    type: Boolean,
    default: true
  },
  isPaused: {
    type: Boolean,
    default: false
  },
  
  // Stats
  viewCount: {
    type: Number,
    default: 0
  },
  proposalCount: {
    type: Number,
    default: 0
  },
  
  // Images/attachments (optional)
  images: [{
    type: String
  }],
  
  // Additional preferences
  preferredSchedule: {
    type: String,
    maxlength: [200, 'Preferred schedule cannot exceed 200 characters']
  },
  
  // Location preference (for offline skills)
  location: {
    city: String,
    country: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time display
skillSchema.virtual('estimatedTimeDisplay').get(function() {
  if (!this.estimatedTime?.value) return '';
  return `${this.estimatedTime.value} ${this.estimatedTime.unit}`;
});

// Indexes
skillSchema.index({ user: 1, type: 1 });
skillSchema.index({ category: 1 });
skillSchema.index({ tags: 1 });
skillSchema.index({ type: 1, isActive: 1 });
skillSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Pre-save: limit tags
skillSchema.pre('save', function(next) {
  if (this.tags && this.tags.length > 10) {
    this.tags = this.tags.slice(0, 10);
  }
  next();
});

// Method to increment view count
skillSchema.methods.incrementViews = async function() {
  this.viewCount += 1;
  await this.save();
};

// Static method to get skills by category
skillSchema.statics.getByCategory = function(category, type = null) {
  const query = { category, isActive: true, isPaused: false };
  if (type) query.type = type;
  return this.find(query).populate('user', 'name username avatar trustScore');
};

// Static method to search skills
skillSchema.statics.searchSkills = function(searchTerm, filters = {}) {
  const query = {
    isActive: true,
    isPaused: false
  };
  
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.level) {
    query.level = filters.level;
  }
  
  if (filters.mode) {
    query.mode = filters.mode;
  }
  
  return this.find(query).populate('user', 'name username avatar trustScore averageRating');
};

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
