/**
 * Deal Controller
 */

const BarterDeal = require('../models/BarterDeal');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Conversation = require('../models/Conversation');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

// Create barter proposal
exports.createDeal = asyncHandler(async (req, res) => {
  const proposer = req.user._id;
  const { receiverId, proposerOffer, receiverOffer, skillCoinExchange, estimatedDuration } = req.body;

  const receiver = await User.findById(receiverId);
  if (!receiver) throw new ApiError('Receiver not found', 404);

  const deal = await BarterDeal.create({
    proposer,
    receiver: receiverId,
    proposerOffer,
    receiverOffer,
    skillCoinExchange: skillCoinExchange || { fromProposer: 0, fromReceiver: 0 },
    estimatedDuration
  });

  // Create or find conversation
  const conversation = await Conversation.findOrCreate(proposer, receiverId, deal._id);
  deal.conversation = conversation._id;
  await deal.save();

  // Notify receiver
  await Notification.notifyNewProposal(receiverId, proposer, deal._id, req.user.name);

  res.json({ success: true, data: deal });
});

// Get deal by id
exports.getDeal = asyncHandler(async (req, res) => {
  const deal = await BarterDeal.findById(req.params.id)
    .populate('proposer', 'name username avatar')
    .populate('receiver', 'name username avatar')
    .populate('conversation')
    .populate('proposerOffer.skill receiverOffer.skill');

  if (!deal) throw new ApiError('Deal not found', 404);
  res.json({ success: true, data: deal });
});

// List user's deals
exports.listDeals = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const deals = await BarterDeal.getUserDeals(req.user._id, status);
  res.json({ success: true, data: deals });
});

// Update deal status (accept, reject, start, complete, cancel, dispute)
exports.updateStatus = asyncHandler(async (req, res) => {
  const deal = await BarterDeal.findById(req.params.id);
  if (!deal) throw new ApiError('Deal not found', 404);

  const { action } = req.body; // e.g., accept, reject, start, complete, cancel, dispute
  const userId = req.user._id.toString();

  if (action === 'accept') {
    if (deal.receiver.toString() !== userId) throw new ApiError('Only receiver can accept', 403);
    deal.status = 'accepted';
    await deal.save();
    await Notification.notifyProposalAccepted(deal.proposer, deal.receiver, deal._id, req.user.name);
  } else if (action === 'reject') {
    if (deal.receiver.toString() !== userId) throw new ApiError('Only receiver can reject', 403);
    deal.status = 'rejected';
    await deal.save();
    await Notification.notifyProposalRejected(deal.proposer, deal.receiver, deal._id, req.user.name);
  } else if (action === 'start') {
    if (deal.proposer.toString() !== userId && deal.receiver.toString() !== userId) throw new ApiError('Not a participant', 403);
    deal.status = 'in_progress';
    await deal.save();
  } else if (action === 'complete') {
    const completed = await deal.markComplete(userId);
    if (completed) {
      // Transfer SkillCoins
      const proposer = await User.findById(deal.proposer);
      const receiver = await User.findById(deal.receiver);

      const fromProposer = deal.skillCoinExchange?.fromProposer || 0;
      const fromReceiver = deal.skillCoinExchange?.fromReceiver || 0;

      // Apply transfers
      if (fromProposer > 0) {
        proposer.skillCoins = Math.max(0, proposer.skillCoins - fromProposer);
        receiver.skillCoins += fromProposer;
      }
      if (fromReceiver > 0) {
        receiver.skillCoins = Math.max(0, receiver.skillCoins - fromReceiver);
        proposer.skillCoins += fromReceiver;
      }

      proposer.completedDeals += 1;
      receiver.completedDeals += 1;

      await proposer.save();
      await receiver.save();

      await Notification.notifyDealCompleted(deal.proposer, deal._id, receiver.name);
      await Notification.notifyDealCompleted(deal.receiver, deal._id, proposer.name);
    }
  } else if (action === 'cancel') {
    await deal.cancel(req.user._id, req.body.reason || 'Cancelled by user');
  } else if (action === 'dispute') {
    await deal.dispute(req.user._id, req.body.reason || 'Disputed by user');
  } else {
    throw new ApiError('Unknown action', 400);
  }

  res.json({ success: true, data: deal });
});

// Add review
exports.addReview = asyncHandler(async (req, res) => {
  // For brevity, reviews handled through separate controller; placeholder here
  res.json({ success: true, message: 'Review added (placeholder)' });
});

module.exports = exports;