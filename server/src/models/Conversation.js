/**
 * Conversation and Message Models
 * 
 * Handles in-app messaging between users.
 * Conversations are typically associated with barter deals.
 */

const mongoose = require('mongoose');

// Message Schema (embedded or referenced)
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['text', 'system', 'attachment'],
    default: 'text'
  },
  attachment: {
    url: String,
    type: String,
    name: String
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  // Participants (typically 2 users)
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  
  // Related barter deal (optional)
  deal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarterDeal'
  },
  
  // Messages in this conversation
  messages: [messageSchema],
  
  // Last message for preview
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: Date
  },
  
  // Unread counts per participant
  unreadCounts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    count: {
      type: Number,
      default: 0
    }
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ deal: 1 });
conversationSchema.index({ 'lastMessage.createdAt': -1 });

// Method to add a message
conversationSchema.methods.addMessage = async function(senderId, content, type = 'text', attachment = null) {
  const message = {
    sender: senderId,
    content,
    type,
    attachment,
    readBy: [{ user: senderId }]
  };
  
  this.messages.push(message);
  
  // Update last message
  this.lastMessage = {
    content: content.substring(0, 100),
    sender: senderId,
    createdAt: new Date()
  };
  
  // Update unread counts for other participants
  this.unreadCounts.forEach(uc => {
    if (uc.user.toString() !== senderId.toString()) {
      uc.count += 1;
    }
  });
  
  await this.save();
  return this.messages[this.messages.length - 1];
};

// Method to mark messages as read
conversationSchema.methods.markAsRead = async function(userId) {
  const userIdStr = userId.toString();
  
  // Mark all unread messages as read
  this.messages.forEach(msg => {
    const alreadyRead = msg.readBy.some(r => r.user.toString() === userIdStr);
    if (!alreadyRead) {
      msg.readBy.push({ user: userId });
    }
  });
  
  // Reset unread count for this user
  const userUnread = this.unreadCounts.find(uc => uc.user.toString() === userIdStr);
  if (userUnread) {
    userUnread.count = 0;
  }
  
  await this.save();
};

// Method to get unread count for a user
conversationSchema.methods.getUnreadCount = function(userId) {
  const userUnread = this.unreadCounts.find(uc => uc.user.toString() === userId.toString());
  return userUnread ? userUnread.count : 0;
};

// Static method to find or create conversation
conversationSchema.statics.findOrCreate = async function(participant1, participant2, dealId = null) {
  // Check if conversation exists
  let conversation = await this.findOne({
    participants: { $all: [participant1, participant2] },
    ...(dealId && { deal: dealId })
  });
  
  if (!conversation) {
    conversation = await this.create({
      participants: [participant1, participant2],
      deal: dealId,
      unreadCounts: [
        { user: participant1, count: 0 },
        { user: participant2, count: 0 }
      ]
    });
  }
  
  return conversation;
};

// Static method to get user's conversations
conversationSchema.statics.getUserConversations = function(userId) {
  return this.find({
    participants: userId,
    isActive: true
  })
    .populate('participants', 'name username avatar')
    .populate('deal', 'status proposerOffer.title receiverOffer.title')
    .sort({ 'lastMessage.createdAt': -1 });
};

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
