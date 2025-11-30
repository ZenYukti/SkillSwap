/**
 * Notification Model
 * 
 * Stores in-app notifications for users.
 * Includes various notification types for different events.
 */

const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../config/constants');

const notificationSchema = new mongoose.Schema({
  // Recipient
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  // Notification type
  type: {
    type: String,
    enum: Object.values(NOTIFICATION_TYPES),
    required: [true, 'Notification type is required']
  },
  
  // Content
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Related entities (optional)
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedDeal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarterDeal'
  },
  relatedSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  },
  relatedConversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  
  // Link to navigate to
  link: {
    type: String,
    trim: true
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  this.readAt = new Date();
  await this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = async function({
  user,
  type,
  title,
  message,
  relatedUser,
  relatedDeal,
  relatedSkill,
  relatedConversation,
  link,
  metadata
}) {
  return await this.create({
    user,
    type,
    title,
    message,
    relatedUser,
    relatedDeal,
    relatedSkill,
    relatedConversation,
    link,
    metadata
  });
};

// Static method to get user's notifications
notificationSchema.statics.getForUser = function(userId, { limit = 20, unreadOnly = false } = {}) {
  const query = { user: userId };
  if (unreadOnly) {
    query.isRead = false;
  }
  
  return this.find(query)
    .populate('relatedUser', 'name username avatar')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  await this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Helper static methods for common notifications
notificationSchema.statics.notifyNewProposal = async function(receiverId, proposerId, dealId, proposerName) {
  return await this.createNotification({
    user: receiverId,
    type: NOTIFICATION_TYPES.NEW_PROPOSAL,
    title: 'New Barter Proposal',
    message: `${proposerName} has sent you a barter proposal`,
    relatedUser: proposerId,
    relatedDeal: dealId,
    link: `/deals/${dealId}`
  });
};

notificationSchema.statics.notifyProposalAccepted = async function(proposerId, receiverId, dealId, receiverName) {
  return await this.createNotification({
    user: proposerId,
    type: NOTIFICATION_TYPES.PROPOSAL_ACCEPTED,
    title: 'Proposal Accepted!',
    message: `${receiverName} has accepted your barter proposal`,
    relatedUser: receiverId,
    relatedDeal: dealId,
    link: `/deals/${dealId}`
  });
};

notificationSchema.statics.notifyProposalRejected = async function(proposerId, receiverId, dealId, receiverName) {
  return await this.createNotification({
    user: proposerId,
    type: NOTIFICATION_TYPES.PROPOSAL_REJECTED,
    title: 'Proposal Declined',
    message: `${receiverName} has declined your barter proposal`,
    relatedUser: receiverId,
    relatedDeal: dealId,
    link: `/deals/${dealId}`
  });
};

notificationSchema.statics.notifyDealCompleted = async function(userId, dealId, otherUserName) {
  return await this.createNotification({
    user: userId,
    type: NOTIFICATION_TYPES.DEAL_COMPLETED,
    title: 'Deal Completed!',
    message: `Your barter deal with ${otherUserName} has been completed`,
    relatedDeal: dealId,
    link: `/deals/${dealId}`
  });
};

notificationSchema.statics.notifyNewMessage = async function(userId, senderId, conversationId, senderName) {
  return await this.createNotification({
    user: userId,
    type: NOTIFICATION_TYPES.NEW_MESSAGE,
    title: 'New Message',
    message: `${senderName} sent you a message`,
    relatedUser: senderId,
    relatedConversation: conversationId,
    link: `/messages/${conversationId}`
  });
};

notificationSchema.statics.notifyNewReview = async function(userId, reviewerId, dealId, reviewerName, rating) {
  return await this.createNotification({
    user: userId,
    type: NOTIFICATION_TYPES.NEW_REVIEW,
    title: 'New Review',
    message: `${reviewerName} left you a ${rating}-star review`,
    relatedUser: reviewerId,
    relatedDeal: dealId,
    link: `/profile`
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
