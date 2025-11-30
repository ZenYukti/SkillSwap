/**
 * Upload Controller
 */

const path = require('path');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const { FILE_UPLOAD } = require('../config/constants');

exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError('No file uploaded', 400);

  // Basic type and size checks
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(req.file.mimetype)) {
    throw new ApiError('Unsupported file type', 400);
  }
  if (req.file.size > FILE_UPLOAD.MAX_SIZE) {
    throw new ApiError('File too large', 400);
  }

  // Return path
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, data: { url } });
});

module.exports = exports;