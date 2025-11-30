/**
 * Message Controller
 */

const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

exports.getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.getUserConversations(req.user._id);
  res.json({ success: true, data: conversations });
});

exports.getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId).populate('messages.sender', 'name username avatar');
  if (!conversation) throw new ApiError('Conversation not found', 404);
  res.json({ success: true, data: conversation.messages });
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { toUserId, conversationId, content } = req.body;

  let conversation;
  if (conversationId) {
    conversation = await Conversation.findById(conversationId);
  } else if (toUserId) {
    conversation = await Conversation.findOrCreate(req.user._id, toUserId);
  }

  if (!conversation) throw new ApiError('Conversation not found', 404);

  const message = await conversation.addMessage(req.user._id, content);

  // Notify recipient(s)
  conversation.participants.forEach(async participantId => {
    if (participantId.toString() !== req.user._id.toString()) {
      await Notification.notifyNewMessage(participantId, req.user._id, conversation._id, req.user.name);
    }
  });

  res.json({ success: true, data: message });
});

exports.markConversationRead = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) throw new ApiError('Conversation not found', 404);

  await conversation.markAsRead(req.user._id);
  res.json({ success: true, message: 'Marked as read' });
});

module.exports = exports;