/**
 * Seed script to create a default admin user
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await connectDB();
    const existing = await User.findOne({ email: 'admin@skillswap.com' });
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      name: 'SkillSwap Admin',
      username: 'admin',
      email: 'admin@skillswap.com',
      password: 'Admin123!',
      role: 'admin',
      verificationStatus: 'fully_verified'
    });

    await admin.save();
    console.log('Admin created: admin@skillswap.com / Admin123!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

createAdmin();