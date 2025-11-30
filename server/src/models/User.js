/**
 * User Model
 * 
 * Represents a user in the SkillSwap platform.
 * Includes authentication, profile, and trust system fields.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { DEFAULT_SKILL_COINS, USER_ROLES, VERIFICATION_STATUS } = require('../config/constants');

const userSchema = new mongoose.Schema({
  // Authentication fields
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  
  // Profile fields
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  
  // Location
  location: {
    city: {
      type: String,
      maxlength: [100, 'City name cannot exceed 100 characters'],
      default: ''
    },
    country: {
      type: String,
      maxlength: [100, 'Country name cannot exceed 100 characters'],
      default: ''
    }
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Skill tags for quick reference
  skillsOffered: [{
    type: String,
    trim: true
  }],
  skillsSeeking: [{
    type: String,
    trim: true
  }],
  
  // Credit system
  skillCoins: {
    type: Number,
    default: DEFAULT_SKILL_COINS,
    min: [0, 'SkillCoins cannot be negative']
  },
  
  // Trust and reputation
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  completedDeals: {
    type: Number,
    default: 0
  },
  cancelledDeals: {
    type: Number,
    default: 0
  },
  
  // Role and verification
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER
  },
  verificationStatus: {
    type: String,
    enum: Object.values(VERIFICATION_STATUS),
    default: VERIFICATION_STATUS.UNVERIFIED
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isDeactivated: {
    type: Boolean,
    default: false
  },
  
  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Refresh token for JWT
  refreshToken: {
    type: String,
    select: false
  },
  
  // Notification preferences
  notificationPreferences: {
    email: {
      newProposal: { type: Boolean, default: true },
      dealUpdates: { type: Boolean, default: true },
      newMessages: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    inApp: {
      newProposal: { type: Boolean, default: true },
      dealUpdates: { type: Boolean, default: true },
      newMessages: { type: Boolean, default: true }
    }
  },
  
  // Timestamps
  lastLogin: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full location string
userSchema.virtual('fullLocation').get(function() {
  if (this.location.city && this.location.country) {
    return `${this.location.city}, ${this.location.country}`;
  }
  return this.location.city || this.location.country || '';
});

// Virtual for cancellation rate
userSchema.virtual('cancellationRate').get(function() {
  const totalDeals = this.completedDeals + this.cancelledDeals;
  if (totalDeals === 0) return 0;
  return Math.round((this.cancelledDeals / totalDeals) * 100);
});

// Index for search
userSchema.index({ username: 'text', name: 'text', bio: 'text' });
userSchema.index({ skillsOffered: 1 });
userSchema.index({ skillsSeeking: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate and update trust score
userSchema.methods.calculateTrustScore = function() {
  let score = 0;
  
  // Base score from ratings (40% weight)
  if (this.totalRatings > 0) {
    score += (this.averageRating / 5) * 40;
  }
  
  // Score from completed deals (30% weight)
  const dealScore = Math.min(this.completedDeals * 2, 30);
  score += dealScore;
  
  // Score from low cancellation rate (20% weight)
  const cancellationRate = this.cancellationRate;
  score += Math.max(0, 20 - cancellationRate * 0.2);
  
  // Bonus for verification (10% weight)
  if (this.verificationStatus === VERIFICATION_STATUS.FULLY_VERIFIED) {
    score += 10;
  } else if (this.verificationStatus === VERIFICATION_STATUS.EMAIL_VERIFIED) {
    score += 5;
  }
  
  this.trustScore = Math.round(Math.min(score, 100));
  return this.trustScore;
};

// Method to update rating
userSchema.methods.addRating = function(rating) {
  const totalRatingSum = this.averageRating * this.totalRatings;
  this.totalRatings += 1;
  this.averageRating = (totalRatingSum + rating) / this.totalRatings;
  this.averageRating = Math.round(this.averageRating * 10) / 10;
  this.calculateTrustScore();
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
