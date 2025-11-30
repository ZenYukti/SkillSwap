/**
 * Model Index
 * 
 * Exports all Mongoose models from a single file.
 */

const User = require('./User');
const Skill = require('./Skill');
const BarterDeal = require('./BarterDeal');
const Review = require('./Review');
const Conversation = require('./Conversation');
const Notification = require('./Notification');

module.exports = {
  User,
  Skill,
  BarterDeal,
  Review,
  Conversation,
  Notification
};
