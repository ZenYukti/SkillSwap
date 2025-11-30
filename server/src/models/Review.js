/**
 * Review Model
 * 
 * Represents a review given after a completed barter deal.
 * Each participant can leave a review for the other.
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // The barter deal this review is for
  deal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarterDeal',
    required: [true, 'Deal reference is required']
  },
  
  // Who wrote the review
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer is required']
  },
  
  // Who is being reviewed
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewee is required']
  },
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  // Review text
  comment: {
    type: String,
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  
  // Specific ratings (optional)
  subRatings: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Would recommend
  wouldRecommend: {
    type: Boolean,
    default: true
  },
  
  // Response from reviewee (optional)
  response: {
    text: String,
    createdAt: Date
  },
  
  // Moderation
  isHidden: {
    type: Boolean,
    default: false
  },
  hiddenReason: String
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ deal: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ rating: 1 });

// Ensure one review per user per deal
reviewSchema.index({ deal: 1, reviewer: 1 }, { unique: true });

// Post-save: Update reviewee's average rating
reviewSchema.post('save', async function() {
  const Review = this.constructor;
  const User = mongoose.model('User');
  
  // Calculate new average rating for reviewee
  const result = await Review.aggregate([
    { $match: { reviewee: this.reviewee, isHidden: false } },
    {
      $group: {
        _id: '$reviewee',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);
  
  if (result.length > 0) {
    const { averageRating, totalRatings } = result[0];
    await User.findByIdAndUpdate(this.reviewee, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings
    });
    
    // Also update trust score
    const user = await User.findById(this.reviewee);
    if (user) {
      user.calculateTrustScore();
      await user.save();
    }
  }
});

// Static method to get reviews for a user
reviewSchema.statics.getForUser = function(userId, limit = 10) {
  return this.find({ reviewee: userId, isHidden: false })
    .populate('reviewer', 'name username avatar')
    .populate('deal', 'proposerOffer.title receiverOffer.title')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get average rating breakdown
reviewSchema.statics.getRatingBreakdown = async function(userId) {
  const result = await this.aggregate([
    { $match: { reviewee: mongoose.Types.ObjectId(userId), isHidden: false } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);
  
  // Convert to object with all ratings
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  result.forEach(r => {
    breakdown[r._id] = r.count;
  });
  
  return breakdown;
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
