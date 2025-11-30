/**
 * Application Constants
 * 
 * Centralized configuration for constant values used across the app.
 */

// Skill Categories
const SKILL_CATEGORIES = [
  'Programming',
  'Design',
  'Music',
  'Languages',
  'Writing',
  'Marketing',
  'Business',
  'Fitness',
  'Photography',
  'Video',
  'Arts & Crafts',
  'Cooking',
  'Education',
  'Consulting',
  'Other'
];

// Skill Levels
const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

// Skill Modes
const SKILL_MODES = ['online', 'offline', 'both'];

// Deal Statuses
const DEAL_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
  REJECTED: 'rejected'
};

// Notification Types
const NOTIFICATION_TYPES = {
  NEW_PROPOSAL: 'new_proposal',
  PROPOSAL_ACCEPTED: 'proposal_accepted',
  PROPOSAL_REJECTED: 'proposal_rejected',
  DEAL_COMPLETED: 'deal_completed',
  DEAL_CANCELLED: 'deal_cancelled',
  NEW_MESSAGE: 'new_message',
  NEW_REVIEW: 'new_review',
  ADMIN_WARNING: 'admin_warning',
  SYSTEM: 'system'
};

// User Roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Verification Statuses
const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  EMAIL_VERIFIED: 'email_verified',
  FULLY_VERIFIED: 'fully_verified'
};

// Default SkillCoins for new users
const DEFAULT_SKILL_COINS = 100;

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50
};

// File upload limits
const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

module.exports = {
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SKILL_MODES,
  DEAL_STATUSES,
  NOTIFICATION_TYPES,
  USER_ROLES,
  VERIFICATION_STATUS,
  DEFAULT_SKILL_COINS,
  PAGINATION,
  FILE_UPLOAD
};
