/**
 * Notification Controller
 */

const Notification = require('../models/Notification');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

exports.listNotifications = asyncHandler(async (req, res) => {
  const { unreadOnly, limit = 20 } = req.query;
  const notifications = await Notification.getForUser(req.user._id, { limit: parseInt(limit), unreadOnly: unreadOnly === 'true' });
  res.json({ success: true, data: notifications });
});

exports.markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new ApiError('Notification not found', 404);
  if (notification.user.toString() !== req.user._id.toString()) throw new ApiError('Not authorized', 403);

  await notification.markAsRead();
  res.json({ success: true, data: notification });
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.markAllAsRead(req.user._id);
  res.json({ success: true, message: 'All notifications marked as read' });
});

module.exports = exports;