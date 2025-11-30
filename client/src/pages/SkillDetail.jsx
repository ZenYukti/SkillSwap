import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import './SkillDetail.css'

export default function SkillDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [skill, setSkill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showProposalModal, setShowProposalModal] = useState(false)
  const [proposalMessage, setProposalMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData))
      } catch (e) {}
    }
    fetchSkill()
  }, [id])

  const fetchSkill = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/skills/${id}`)
      setSkill(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Skill not found')
    } finally {
      setLoading(false)
    }
  }

  const handleProposeDeal = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    setShowProposalModal(true)
  }

  const submitProposal = async () => {
    if (!proposalMessage.trim()) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem('accessToken')
      
      // First, start a conversation
      await axios.post('/api/messages/conversations', {
        recipientId: skill.user._id,
        message: `Hi! I'm interested in your skill: "${skill.title}"\n\n${proposalMessage}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setShowProposalModal(false)
      setProposalMessage('')
      navigate('/messages')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send proposal')
    } finally {
      setSubmitting(false)
    }
  }

  const isOwner = currentUser && skill?.user?._id === currentUser.id

  if (loading) {
    return (
      <div className="skill-detail-page">
        <div className="container">
          <div className="skill-detail-loading">
            <div className="spinner"></div>
            <p>Loading skill details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !skill) {
    return (
      <div className="skill-detail-page">
        <div className="container">
          <div className="skill-detail-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2>Skill Not Found</h2>
            <p>{error || 'This skill may have been removed or doesn\'t exist.'}</p>
            <Link to="/browse" className="btn btn-primary">Browse Skills</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="skill-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <motion.nav 
          className="breadcrumb"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/browse">Skills</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to={`/browse?category=${skill.category}`}>{skill.category}</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{skill.title}</span>
        </motion.nav>

        <div className="skill-detail-layout">
          {/* Main Content */}
          <motion.div 
            className="skill-detail-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="skill-detail-header">
              <div className="skill-detail-tags">
                <span className={`skill-type-badge ${skill.type}`}>
                  {skill.type === 'offer' ? '🎯 Offering' : '🔍 Seeking'}
                </span>
                <span className="skill-level-badge">{skill.level}</span>
                <span className="skill-category-badge">{skill.category}</span>
              </div>
              
              <h1 className="skill-detail-title">{skill.title}</h1>
              
              <div className="skill-detail-meta">
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {skill.estimatedHours || 10} hours estimated
                </span>
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Posted {new Date(skill.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="skill-detail-section">
              <h2>Description</h2>
              <p className="skill-description">{skill.description}</p>
            </div>

            {skill.tags && skill.tags.length > 0 && (
              <div className="skill-detail-section">
                <h2>Tags</h2>
                <div className="skill-tags">
                  {skill.tags.map((tag, i) => (
                    <span key={i} className="skill-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="skill-detail-section">
              <h2>What You'll Get</h2>
              <ul className="skill-benefits">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {skill.type === 'offer' 
                    ? `Learn ${skill.title} from an experienced practitioner`
                    : `Teach ${skill.title} and earn SkillCoins`
                  }
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Flexible scheduling based on both parties' availability
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Direct communication through SkillSwap messaging
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Leave reviews after successful exchange
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside 
            className="skill-detail-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* User Card */}
            <div className="sidebar-card user-card">
              <Link to={`/profile/${skill.user?.username}`} className="user-card-header">
                <div className="user-avatar-lg">
                  {skill.user?.name?.charAt(0) || 'U'}
                </div>
                <div className="user-info">
                  <h3>{skill.user?.name || 'User'}</h3>
                  <p>@{skill.user?.username || 'username'}</p>
                </div>
              </Link>
              
              <div className="user-stats">
                <div className="user-stat">
                  <span className="stat-value">{skill.user?.skillCoins || 100}</span>
                  <span className="stat-label">SkillCoins</span>
                </div>
                <div className="user-stat">
                  <span className="stat-value">{skill.user?.rating?.toFixed(1) || '5.0'}</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>

              {skill.user?.bio && (
                <p className="user-bio">{skill.user.bio.slice(0, 150)}...</p>
              )}

              <Link to={`/profile/${skill.user?.username}`} className="btn btn-outline btn-block">
                View Full Profile
              </Link>
            </div>

            {/* Action Card */}
            {!isOwner && (
              <div className="sidebar-card action-card">
                <h3>{skill.type === 'offer' ? 'Interested in learning?' : 'Can you teach this?'}</h3>
                <p>
                  {skill.type === 'offer' 
                    ? 'Send a message to discuss exchanging skills with this user.'
                    : 'If you have this skill, reach out to propose a trade.'
                  }
                </p>
                <button className="btn btn-primary btn-block" onClick={handleProposeDeal}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Send Message
                </button>
              </div>
            )}

            {isOwner && (
              <div className="sidebar-card action-card owner-card">
                <h3>This is your skill listing</h3>
                <p>You can edit or delete this listing from your dashboard.</p>
                <Link to="/dashboard" className="btn btn-outline btn-block">
                  Go to Dashboard
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="modal-overlay" onClick={() => setShowProposalModal(false)}>
          <motion.div 
            className="modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Send a Message</h2>
              <button className="modal-close" onClick={() => setShowProposalModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-info">
                Introduce yourself to <strong>{skill.user?.name}</strong> and explain what skill you can offer in exchange.
              </p>
              <div className="form-group">
                <label>Your Message</label>
                <textarea
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  placeholder="Hi! I'm interested in learning this skill. I can offer..."
                  rows={5}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowProposalModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={submitProposal}
                disabled={!proposalMessage.trim() || submitting}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
