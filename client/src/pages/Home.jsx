import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Home.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Share Your Skills',
    description: 'Create skill offers and showcase your expertise to a community of learners and collaborators.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Direct Barter Trades',
    description: 'Negotiate skill-for-skill exchanges with other members—no money involved, just pure value exchange.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Flexible Scheduling',
    description: 'Set your availability and connect with people across time zones for seamless collaboration.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: 'SkillCoin Credits',
    description: 'Earn SkillCoins for completed trades and use them when you can\'t find a direct skill match.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: 'Trust & Reviews',
    description: 'Build your reputation through verified reviews and trust scores from successful exchanges.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Real-time Messaging',
    description: 'Chat directly with potential partners, discuss terms, and coordinate your skill exchanges.'
  }
]

const howItWorks = [
  {
    step: '01',
    title: 'Create Your Profile',
    description: 'Sign up and list the skills you can offer and the ones you want to learn.'
  },
  {
    step: '02',
    title: 'Browse & Connect',
    description: 'Search for skills, find matching partners, and propose barter trades.'
  },
  {
    step: '03',
    title: 'Exchange & Grow',
    description: 'Complete skill exchanges, earn SkillCoins, and build your reputation.'
  }
]

const stats = [
  { value: '10K+', label: 'Active Members' },
  { value: '5K+', label: 'Skills Listed' },
  { value: '15K+', label: 'Trades Completed' },
  { value: '4.9', label: 'Average Rating' }
]

export default function Home() {
  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient-1"></div>
          <div className="hero-gradient-2"></div>
          <div className="hero-grid"></div>
        </div>
        
        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="hero-badge" variants={fadeInUp}>
              <span className="badge badge-gradient">🚀 The Skill Economy Revolution</span>
            </motion.div>
            
            <motion.h1 className="hero-title" variants={fadeInUp}>
              Trade Skills,<br />
              <span className="text-gradient">Not Money</span>
            </motion.h1>
            
            <motion.p className="hero-description" variants={fadeInUp}>
              SkillSwap is a barter-only marketplace where professionals, creatives, and learners 
              exchange skills without money. Build connections, grow expertise, and trade value for value.
            </motion.p>
            
            <motion.div className="hero-actions" variants={fadeInUp}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Trading Free
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/browse" className="btn btn-outline btn-lg">
                Explore Skills
              </Link>
            </motion.div>

            <motion.div className="hero-stats" variants={fadeInUp}>
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat">
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="hero-cards">
              <div className="floating-card card-1">
                <div className="fc-icon blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  </svg>
                </div>
                <div className="fc-content">
                  <span className="fc-title">Web Development</span>
                  <span className="fc-badge">Offering</span>
                </div>
              </div>
              
              <div className="floating-card card-2">
                <div className="fc-icon green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </div>
                <div className="fc-content">
                  <span className="fc-title">Social Media</span>
                  <span className="fc-badge">Seeking</span>
                </div>
              </div>
              
              <div className="floating-card card-3">
                <div className="swap-indicator">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </div>
              
              <div className="floating-card card-4">
                <div className="coin-display">
                  <span className="coin-icon">🪙</span>
                  <span className="coin-value">+50</span>
                  <span className="coin-label">SkillCoins</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <span className="section-label">Features</span>
            <h2 className="section-title">Everything you need to trade skills</h2>
            <p className="section-description">
              A complete platform for skill exchange with all the tools to connect, 
              negotiate, and grow your expertise.
            </p>
          </motion.div>

          <motion.div 
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div key={index} className="feature-card" variants={fadeInUp}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <span className="section-label">How It Works</span>
            <h2 className="section-title">Get started in 3 simple steps</h2>
          </motion.div>

          <motion.div 
            className="steps-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {howItWorks.map((item, index) => (
              <motion.div key={index} className="step-card" variants={fadeInUp}>
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="cta-bg">
              <div className="cta-gradient"></div>
            </div>
            <div className="cta-content">
              <h2 className="cta-title">Ready to start trading skills?</h2>
              <p className="cta-description">
                Join thousands of members already exchanging value. No fees, no money—just skills.
              </p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-white btn-lg">
                  Create Free Account
                </Link>
                <Link to="/browse" className="btn btn-ghost-white btn-lg">
                  Browse Skills
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
