/**
 * Authentication Middleware
 * 
 * Protects routes by verifying JWT tokens.
 * Attaches user info to request object.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - require authentication
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Also check cookies
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is active
      if (!user.isActive || user.isDeactivated) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      req.user = user;
      next();
    } catch (err) {
      // Token expired or invalid
      return res.status(401).json({
        success: false,
        message: 'Token is not valid or has expired'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

/**
 * Optional auth - doesn't require authentication but attaches user if token exists
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user && user.isActive && !user.isDeactivated) {
          req.user = user;
        }
      } catch (err) {
        // Token invalid, continue without user
      }
    }

    next();
  } catch (error) {
    next();
  }
};

/**
 * Require admin role
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

/**
 * Check if user owns the resource or is admin
 */
const ownerOrAdmin = (getOwnerId) => {
  return async (req, res, next) => {
    try {
      const ownerId = await getOwnerId(req);
      
      if (!ownerId) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      const isOwner = req.user._id.toString() === ownerId.toString();
      const isAdmin = req.user.role === 'admin';

      if (isOwner || isAdmin) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource'
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking authorization'
      });
    }
  };
};

module.exports = {
  protect,
  optionalAuth,
  admin,
  ownerOrAdmin
};
