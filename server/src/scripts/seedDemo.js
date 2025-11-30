/**
 * Seed Script - Add Demo Data
 * 
 * Run with: node src/scripts/seedDemo.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Skill = require('../models/Skill');

const MONGO_URI = process.env.MONGODB_URI;

const demoUsers = [
  {
    name: 'John Developer',
    username: 'johndev',
    email: 'john@example.com',
    password: 'password123',
    bio: 'Full-stack developer with 5 years of experience. Love teaching and learning new technologies!',
    location: 'San Francisco, CA',
    skillCoins: 100
  },
  {
    name: 'Sarah Designer',
    username: 'sarahdesign',
    email: 'sarah@example.com',
    password: 'password123',
    bio: 'UI/UX designer passionate about creating beautiful user experiences.',
    location: 'New York, NY',
    skillCoins: 150
  },
  {
    name: 'Mike Teacher',
    username: 'miketeach',
    email: 'mike@example.com',
    password: 'password123',
    bio: 'Language enthusiast and certified teacher. I speak 5 languages fluently!',
    location: 'London, UK',
    skillCoins: 200
  },
  {
    name: 'Emma Artist',
    username: 'emmaart',
    email: 'emma@example.com',
    password: 'password123',
    bio: 'Digital artist and illustrator. I create stunning visuals for brands and individuals.',
    location: 'Paris, France',
    skillCoins: 75
  },
  {
    name: 'David Marketer',
    username: 'davidmarket',
    email: 'david@example.com',
    password: 'password123',
    bio: 'Digital marketing expert specializing in SEO and content strategy.',
    location: 'Austin, TX',
    skillCoins: 120
  }
];

const categories = [
  'Programming',
  'Design',
  'Marketing',
  'Languages',
  'Music',
  'Writing',
  'Photography',
  'Business',
  'Cooking',
  'Fitness'
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        isVerified: true
      });
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.name}`);
    }

    // Create skills for each user
    const skillsData = [
      // John's skills (Programming)
      {
        user: createdUsers[0]._id,
        title: 'React.js Development',
        description: 'I can teach you React.js from basics to advanced concepts including hooks, context, and Redux.',
        category: 'Programming',
        type: 'offer',
        level: 'advanced',
        estimatedHours: 10,
        tags: ['react', 'javascript', 'frontend', 'web development']
      },
      {
        user: createdUsers[0]._id,
        title: 'Node.js Backend Development',
        description: 'Learn to build scalable backend APIs with Node.js, Express, and MongoDB.',
        category: 'Programming',
        type: 'offer',
        level: 'intermediate',
        estimatedHours: 15,
        tags: ['nodejs', 'express', 'mongodb', 'api']
      },
      {
        user: createdUsers[0]._id,
        title: 'UI/UX Design Basics',
        description: 'Looking to learn the fundamentals of UI/UX design and Figma.',
        category: 'Design',
        type: 'request',
        level: 'beginner',
        estimatedHours: 8,
        tags: ['design', 'figma', 'ui', 'ux']
      },
      
      // Sarah's skills (Design)
      {
        user: createdUsers[1]._id,
        title: 'Figma Masterclass',
        description: 'Complete UI/UX design course using Figma. From wireframes to high-fidelity prototypes.',
        category: 'Design',
        type: 'offer',
        level: 'advanced',
        estimatedHours: 12,
        tags: ['figma', 'ui', 'ux', 'prototyping']
      },
      {
        user: createdUsers[1]._id,
        title: 'Brand Identity Design',
        description: 'I\'ll help you create a complete brand identity including logos, color schemes, and style guides.',
        category: 'Design',
        type: 'offer',
        level: 'intermediate',
        estimatedHours: 8,
        tags: ['branding', 'logo', 'identity', 'graphic design']
      },
      {
        user: createdUsers[1]._id,
        title: 'JavaScript Programming',
        description: 'Want to learn JavaScript to better understand frontend development.',
        category: 'Programming',
        type: 'request',
        level: 'beginner',
        estimatedHours: 10,
        tags: ['javascript', 'programming', 'frontend']
      },
      
      // Mike's skills (Languages)
      {
        user: createdUsers[2]._id,
        title: 'Spanish Conversation Practice',
        description: 'Native-level Spanish speaker offering conversation practice and grammar lessons.',
        category: 'Languages',
        type: 'offer',
        level: 'intermediate',
        estimatedHours: 5,
        tags: ['spanish', 'conversation', 'language learning']
      },
      {
        user: createdUsers[2]._id,
        title: 'French for Beginners',
        description: 'Start your French learning journey with structured lessons and cultural insights.',
        category: 'Languages',
        type: 'offer',
        level: 'beginner',
        estimatedHours: 20,
        tags: ['french', 'beginner', 'language']
      },
      {
        user: createdUsers[2]._id,
        title: 'Python Programming',
        description: 'Looking to learn Python for data analysis and automation.',
        category: 'Programming',
        type: 'request',
        level: 'beginner',
        estimatedHours: 15,
        tags: ['python', 'programming', 'data']
      },
      
      // Emma's skills (Art/Design)
      {
        user: createdUsers[3]._id,
        title: 'Digital Illustration',
        description: 'Learn digital illustration techniques using Procreate and Photoshop.',
        category: 'Design',
        type: 'offer',
        level: 'intermediate',
        estimatedHours: 10,
        tags: ['illustration', 'digital art', 'procreate', 'photoshop']
      },
      {
        user: createdUsers[3]._id,
        title: 'Portrait Drawing',
        description: 'Master the art of portrait drawing with traditional and digital techniques.',
        category: 'Design',
        type: 'offer',
        level: 'beginner',
        estimatedHours: 8,
        tags: ['drawing', 'portrait', 'art', 'sketching']
      },
      {
        user: createdUsers[3]._id,
        title: 'Photography Basics',
        description: 'Want to learn photography composition and camera settings.',
        category: 'Photography',
        type: 'request',
        level: 'beginner',
        estimatedHours: 6,
        tags: ['photography', 'camera', 'composition']
      },
      
      // David's skills (Marketing)
      {
        user: createdUsers[4]._id,
        title: 'SEO Strategy & Implementation',
        description: 'Learn how to optimize your website for search engines and increase organic traffic.',
        category: 'Marketing',
        type: 'offer',
        level: 'intermediate',
        estimatedHours: 8,
        tags: ['seo', 'marketing', 'google', 'organic traffic']
      },
      {
        user: createdUsers[4]._id,
        title: 'Social Media Marketing',
        description: 'Build and execute effective social media strategies for any platform.',
        category: 'Marketing',
        type: 'offer',
        level: 'beginner',
        estimatedHours: 6,
        tags: ['social media', 'marketing', 'instagram', 'twitter']
      },
      {
        user: createdUsers[4]._id,
        title: 'Video Editing',
        description: 'Looking to learn video editing for marketing content creation.',
        category: 'Design',
        type: 'request',
        level: 'beginner',
        estimatedHours: 10,
        tags: ['video', 'editing', 'premiere', 'content']
      }
    ];

    for (const skillData of skillsData) {
      const skill = await Skill.create(skillData);
      console.log(`💡 Created skill: ${skill.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Demo Accounts (password for all: password123):');
    console.log('   - johndev@example.com / john@example.com');
    console.log('   - sarahdesign@example.com / sarah@example.com');
    console.log('   - miketeach@example.com / mike@example.com');
    console.log('   - emmaart@example.com / emma@example.com');
    console.log('   - davidmarket@example.com / david@example.com');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
