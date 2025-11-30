/**
 * BarterDeal Model
 * 
 * Represents a barter deal between two users.
 * Tracks the proposal, acceptance, progress, and completion.
 */

const mongoose = require('mongoose');
const { DEAL_STATUSES } = require('../config/constants');

const barterDealSchema = new mongoose.Schema({
  // Participants
  proposer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Proposer is required']
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver is required']
  },
  
  // Skills being exchanged
  proposerOffer: {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    },
    title: {
      type: String,
      required: [true, 'Proposer offer title is required']
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    }
  },
  receiverOffer: {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    },
    title: {
      type: String,
      required: [true, 'Receiver offer title is required']
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    }
  },
  
  // SkillCoin exchange (optional)
  skillCoinExchange: {
    fromProposer: {
      type: Number,
      default: 0,
      min: 0
    },
    fromReceiver: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Duration/scope
  estimatedDuration: {
    value: {
      type: Number,
      min: 1
    },
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'sessions'],
      default: 'hours'
    }
  },
  numberOfSessions: {
    type: Number,
    min: 1
  },
  
  // Status tracking
  status: {
    type: String,
    enum: Object.values(DEAL_STATUSES),
    default: DEAL_STATUSES.PENDING
  },
  
  // Notes and terms
  terms: {
    type: String,
    maxlength: [2000, 'Terms cannot exceed 2000 characters']
  },
  
  // Counter offer tracking
  counterOffers: [{
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    proposedChanges: {
      proposerOfferTitle: String,
      receiverOfferTitle: String,
      skillCoinFromProposer: Number,
      skillCoinFromReceiver: Number
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Completion tracking
  proposerCompleted: {
    type: Boolean,
    default: false
  },
  receiverCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  
  // Cancellation info
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String,
  cancelledAt: Date,
  
  // Dispute info
  isDisputed: {
    type: Boolean,
    default: false
  },
  disputeReason: String,
  disputedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  disputeResolvedAt: Date,
  disputeResolution: String,
  
  // Reviews (after completion)
  proposerReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  receiverReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  
  // Related conversation
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if deal is active
barterDealSchema.virtual('isActive').get(function() {
  return [DEAL_STATUSES.PENDING, DEAL_STATUSES.ACCEPTED, DEAL_STATUSES.IN_PROGRESS].includes(this.status);
});

// Virtual for total SkillCoins in deal
barterDealSchema.virtual('totalSkillCoins').get(function() {
  return (this.skillCoinExchange?.fromProposer || 0) + (this.skillCoinExchange?.fromReceiver || 0);
});

// Indexes
barterDealSchema.index({ proposer: 1, status: 1 });
barterDealSchema.index({ receiver: 1, status: 1 });
barterDealSchema.index({ status: 1 });
barterDealSchema.index({ createdAt: -1 });

// Pre-save: auto-update timestamps
barterDealSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === DEAL_STATUSES.COMPLETED) {
      this.completedAt = new Date();
    } else if (this.status === DEAL_STATUSES.CANCELLED) {
      this.cancelledAt = new Date();
    }
  }
  next();
});

// Method to accept deal
barterDealSchema.methods.accept = async function() {
  this.status = DEAL_STATUSES.ACCEPTED;
  await this.save();
};

// Method to start deal
barterDealSchema.methods.start = async function() {
  if (this.status !== DEAL_STATUSES.ACCEPTED) {
    throw new Error('Deal must be accepted before starting');
  }
  this.status = DEAL_STATUSES.IN_PROGRESS;
  await this.save();
};

// Method to mark as complete by a participant
barterDealSchema.methods.markComplete = async function(userId) {
  const isProposer = this.proposer.toString() === userId.toString();
  const isReceiver = this.receiver.toString() === userId.toString();
  
  if (!isProposer && !isReceiver) {
    throw new Error('User is not a participant in this deal');
  }
  
  if (isProposer) {
    this.proposerCompleted = true;
  } else {
    this.receiverCompleted = true;
  }
  
  // If both completed, mark deal as completed
  if (this.proposerCompleted && this.receiverCompleted) {
    this.status = DEAL_STATUSES.COMPLETED;
    this.completedAt = new Date();
  }
  
  await this.save();
  return this.status === DEAL_STATUSES.COMPLETED;
};

// Method to cancel deal
barterDealSchema.methods.cancel = async function(userId, reason) {
  this.status = DEAL_STATUSES.CANCELLED;
  this.cancelledBy = userId;
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  await this.save();
};

// Method to raise dispute
barterDealSchema.methods.dispute = async function(userId, reason) {
  this.status = DEAL_STATUSES.DISPUTED;
  this.isDisputed = true;
  this.disputedBy = userId;
  this.disputeReason = reason;
  await this.save();
};

// Static method to get user's deals
barterDealSchema.statics.getUserDeals = function(userId, status = null) {
  const query = {
    $or: [{ proposer: userId }, { receiver: userId }]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('proposer', 'name username avatar')
    .populate('receiver', 'name username avatar')
    .populate('proposerOffer.skill', 'title category')
    .populate('receiverOffer.skill', 'title category')
    .sort({ createdAt: -1 });
};

const BarterDeal = mongoose.model('BarterDeal', barterDealSchema);

module.exports = BarterDeal;
