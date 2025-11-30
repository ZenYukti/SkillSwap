/**
 * Middleware Index
 * 
 * Exports all middleware from a single file.
 */

const { protect, optionalAuth, admin, ownerOrAdmin } = require('./auth');
const { ApiError, errorHandler, notFound, asyncHandler } = require('./errorHandler');
const { apiLimiter, authLimiter, passwordResetLimiter, uploadLimiter } = require('./rateLimiter');
const {
  validateRegister,
  validateLogin,
  validateSkill,
  validateDeal,
  validateMessage,
  validateReview,
  validateProfileUpdate,
  validatePasswordChange,
  sanitizeInput
} = require('./validation');

module.exports = {
  // Auth
  protect,
  optionalAuth,
  admin,
  ownerOrAdmin,
  
  // Error handling
  ApiError,
  errorHandler,
  notFound,
  asyncHandler,
  
  // Rate limiting
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  
  // Validation
  validateRegister,
  validateLogin,
  validateSkill,
  validateDeal,
  validateMessage,
  validateReview,
  validateProfileUpdate,
  validatePasswordChange,
  sanitizeInput
};
