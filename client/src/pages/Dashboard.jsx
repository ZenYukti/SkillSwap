import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import './Dashboard.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    skillCoins: 100,
    activeDeals: 2,
    completedTrades: 15,
    pendingProposals: 3
  })
  const [skills, setSkills] = useState([])
  const [recentDeals, setRecentDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')
    
    if (!token) {
      navigate('/login')
      return
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        navigate('/login')
      }
    }

    fetchDashboardData()
  }, [navigate])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      
      // Fetch user's skills
      const skillsRes = await api.get('/skills/mine').catch(() => ({ data: { data: [] } }))
      setSkills(skillsRes.data.data?.slice(0, 4) || [])
      
      // Fetch recent deals
      const dealsRes = await api.get('/deals').catch(() => ({ data: { data: [] } }))
      setRecentDeals(dealsRes.data.data?.slice(0, 3) || [])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-lg"></div>
      </div>
    )
  }

  return (
    <main className="dashboard-page">
      <div className="container">
        {/* Welcome Section */}
        <motion.section 
          className="dashboard-welcome"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="welcome-content">
            <h1 className="welcome-title">
              Welcome back, <span className="text-gradient">{user.name?.split(' ')[0] || 'User'}</span>! 👋
            </h1>
            <p className="welcome-subtitle">Here's what's happening with your skill trades</p>
          </div>
          <div className="welcome-actions">
            <Link to="/browse" className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              Find Skills
            </Link>
            <button className="btn btn-outline" onClick={() => document.getElementById('createSkillModal')?.showModal()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Post Skill
            </button>
          </div>
        </motion.section>

        {/* Stats Cards */}
        <motion.section 
          className="stats-grid"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="stat-card" variants={fadeInUp}>
            <div className="stat-icon coins">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12M8 10h8M8 14h8" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.skillCoins}</span>
              <span className="stat-label">SkillCoins</span>
            </div>
            <div className="stat-trend positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              +12%
            </div>
          </motion.div>

          <motion.div className="stat-card" variants={fadeInUp}>
            <div className="stat-icon active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.activeDeals}</span>
              <span className="stat-label">Active Deals</span>
            </div>
            <Link to="/deals" className="stat-action">View all →</Link>
          </motion.div>

          <motion.div className="stat-card" variants={fadeInUp}>
            <div className="stat-icon completed">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.completedTrades}</span>
              <span className="stat-label">Completed Trades</span>
            </div>
            <div className="stat-badge">All time</div>
          </motion.div>

          <motion.div className="stat-card" variants={fadeInUp}>
            <div className="stat-icon pending">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.pendingProposals}</span>
              <span className="stat-label">Pending Proposals</span>
            </div>
            {stats.pendingProposals > 0 && (
              <span className="stat-alert">Action needed</span>
            )}
          </motion.div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* My Skills */}
          <motion.section 
            className="dashboard-section"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="section-header">
              <h2 className="section-title">My Skills</h2>
              <Link to="/profile" className="section-link">View all →</Link>
            </div>
            
            {skills.length > 0 ? (
              <div className="skills-list">
                {skills.map((skill, index) => (
                  <div key={skill._id || index} className="skill-item">
                    <div className={`skill-type-badge ${skill.type}`}>
                      {skill.type === 'offer' ? 'Offering' : 'Seeking'}
                    </div>
                    <div className="skill-info">
                      <h4 className="skill-name">{skill.title}</h4>
                      <p className="skill-category">{skill.category}</p>
                    </div>
                    <div className="skill-meta">
                      <span className="skill-level">{skill.proficiencyLevel || 'Intermediate'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h4>No skills yet</h4>
                <p>Start by adding skills you can offer or want to learn</p>
                <button className="btn btn-primary btn-sm">Add Your First Skill</button>
              </div>
            )}
          </motion.section>

          {/* Recent Activity */}
          <motion.section 
            className="dashboard-section"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="section-header">
              <h2 className="section-title">Recent Deals</h2>
              <Link to="/deals" className="section-link">View all →</Link>
            </div>
            
            {recentDeals.length > 0 ? (
              <div className="deals-list">
                {recentDeals.map((deal, index) => (
                  <div key={deal._id || index} className="deal-item">
                    <div className="deal-avatar">
                      {deal.partner?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="deal-info">
                      <h4 className="deal-title">{deal.title || 'Skill Exchange'}</h4>
                      <p className="deal-partner">with {deal.partner?.name || 'User'}</p>
                    </div>
                    <div className={`deal-status ${deal.status || 'pending'}`}>
                      {deal.status || 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4>No deals yet</h4>
                <p>Browse skills and propose your first trade</p>
                <Link to="/browse" className="btn btn-primary btn-sm">Browse Skills</Link>
              </div>
            )}
          </motion.section>

          {/* Quick Actions */}
          <motion.section 
            className="dashboard-section quick-actions"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="section-title">Quick Actions</h2>
            
            <div className="actions-grid">
              <Link to="/browse" className="action-card">
                <div className="action-icon browse">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <span>Browse Skills</span>
              </Link>
              
              <button className="action-card">
                <div className="action-icon offer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span>Post Offer</span>
              </button>
              
              <button className="action-card">
                <div className="action-icon request">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span>Post Request</span>
              </button>
              
              <Link to="/messages" className="action-card">
                <div className="action-icon messages">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <span>Messages</span>
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
