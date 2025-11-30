/**
 * Validation Middleware
 * 
 * Request body validation for various routes.
 * Uses a simple validation approach without external libraries.
 */

const validator = require('validator');

/**
 * Validate registration input
 */
const validateRegister = (req, res, next) => {
  const { email, password, name, username } = req.body;
  const errors = [];

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!validator.isEmail(email)) {
    errors.push('Please provide a valid email');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }

  // Name validation
  if (!name) {
    errors.push('Name is required');
  } else if (name.length < 2 || name.length > 100) {
    errors.push('Name must be between 2 and 100 characters');
  }

  // Username validation
  if (!username) {
    errors.push('Username is required');
  } else if (username.length < 3 || username.length > 30) {
    errors.push('Username must be between 3 and 30 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join('. ')
    });
  }

  // Sanitize inputs
  req.body.email = validator.normalizeEmail(email);
  req.body.name = validator.escape(name.trim());
  req.body.username = username.toLowerCase().trim();

  next();
};

/**
 * Validate login input
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!validator.isEmail(email)) {
    errors.push('Please provide a valid email');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join('. ')
    });
  }

  req.body.email = validator.normalizeEmail(email);
  next();
};

/**
 * Validate skill creation/update
 */
const validateSkill = (req, res, next) => {
  const { title, description, category, level } = req.body;
  const errors = [];

  if (!title) {
    errors.push('Title is required');
  } else if (title.length < 3 || title.length > 100) {
    errors.push('Title must be between 3 and 100 characters');
  }

  if (!description) {
    errors.push('Description is required');
  } else if (description.length < 20 || description.length > 2000) {
    errors.push('Description must be between 20 and 2000 characters');
  }

  if (!category) {
    errors.push('Category is required');
  }

  if (!level) {
    errors.push('Skill level is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join('. ')
    });
  }

  // Sanitize
  req.body.title = validator.escape(title.trim());
  req.body.description = description.trim();

  next();
};

/**
 * Validate barter deal creation
 */
const validateDeal = (req, res, next) => {
  const { receiverId, proposerOffer, receiverOffer } = req.body;
  const errors = [];

  if (!receiverId) {
    errors.push('Receiver is required');
  }

  if (!proposerOffer || !proposerOffer.title) {
    errors.push('Your offer title is required');
  }

  if (!receiverOffer || !receiverOffer.title) {
    errors.push('What you want in return is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join('. ')
    });
  }

  next();
};

/**
 * Validate message
 */
const validateMessage = (req, res, next) => {
  const { content } = req.body;
  const errors = [];

  if (!content) {
    errors.push('Message content is required');
  } else if (content.length > 2000) {
    errors.push('Message cannot exceed 2000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join('. ')
    });
  }

  req.body.content = content.trim();
  next();
};

/**
 * Validate review
 */
const validateReview = (req, res, next) => {
  const { rating, comment } = req.body;
  const errors = [];

  if (!rating) {
    errors.push('Rating is required');
  } else if (rating < 1 || rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  if (comment && comment.length > 1000) {
    errors.push('Comment cannot exceed 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join('. ')
    });
  }

  if (comment) {
    req.body.comment = comment.trim();
  }

  next();
};

/**
 * Validate profile update
 */
const validateProfileUpdate = (req, res, next) => {
  const { name, bio, location } = req.body;
  const errors = [];

  if (name !== undefined) {
    if (name.length < 2 || name.length > 100) {
      errors.push('Name must be between 2 and 100 characters');
    }
  }

  if (bio !== undefined && bio.length > 500) {
    errors.push('Bio cannot exceed 500 characters');
  }

  if (location) {
    if (location.city && location.city.length > 100) {
      errors.push('City name cannot exceed 100 characters');
    }
    if (location.country && location.country.length > 100) {
      errors.push('Country name cannot exceed 100 characters');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join('. ')
    });
  }

  next();
};

/**
 * Validate password change
 */
const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword) {
    errors.push('Current password is required');
  }

  if (!newPassword) {
    errors.push('New password is required');
  } else if (newPassword.length < 8) {
    errors.push('New password must be at least 8 characters');
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    errors.push('New password must contain at least one uppercase letter, one lowercase letter, and one number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join('. ')
    });
  }

  next();
};

/**
 * Sanitize general input
 */
const sanitizeInput = (req, res, next) => {
  // Recursively sanitize string fields in body
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Don't escape passwords or certain fields
        if (!['password', 'currentPassword', 'newPassword', 'description', 'bio', 'content', 'comment', 'terms'].includes(key)) {
          obj[key] = validator.escape(obj[key]);
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) {
    sanitize(req.body);
  }

  next();
};

module.exports = {
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
