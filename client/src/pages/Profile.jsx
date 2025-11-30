import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Profile.css'

export default function Profile() {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('offers')

  useEffect(() => {
    if (!username) return
    fetchUserData()
  }, [username])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const userRes = await api.get(`/users/public/${username}`)
      setUser(userRes.data.data)
      
      // Try to fetch user's skills
      const skillsRes = await api.get(`/skills?user=${userRes.data.data._id}`).catch(() => ({ data: { data: [] } }))
      setSkills(skillsRes.data.data || [])
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="profile-page">
        <div className="container">
          <div className="profile-loading">
            <div className="spinner-lg"></div>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="profile-page">
        <div className="container">
          <div className="profile-not-found">
            <h2>User not found</h2>
            <p>The user you're looking for doesn't exist.</p>
            <Link to="/browse" className="btn btn-primary">Browse Skills</Link>
          </div>
        </div>
      </main>
    )
  }

  const offeredSkills = skills.filter(s => s.type === 'offer')
  const requestedSkills = skills.filter(s => s.type === 'request')

  return (
    <main className="profile-page">
      <div className="profile-hero">
        <div className="container">
          <motion.div 
            className="profile-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} />
                ) : (
                  <span>{user.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="profile-status online">Online</div>
            </div>
            
            <div className="profile-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{user.name}</h1>
                <span className="profile-username">@{user.username}</span>
                {user.isVerified && (
                  <span className="verified-badge" title="Verified User">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </span>
                )}
              </div>
              
              {user.bio && <p className="profile-bio">{user.bio}</p>}
              
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="stat-value">{user.trustScore || 0}</span>
                  <span className="stat-label">Trust Score</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-value">
                    {user.averageRating?.toFixed(1) || '0.0'}
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-value">{user.completedTrades || 0}</span>
                  <span className="stat-label">Trades</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-value">{user.skillCoins || 0}</span>
                  <span className="stat-label">SkillCoins</span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Propose Trade
                </button>
                <button className="btn btn-outline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Message
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container">
        <motion.div 
          className="profile-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Tabs */}
          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === 'offers' ? 'active' : ''}`}
              onClick={() => setActiveTab('offers')}
            >
              Skills Offered
              <span className="tab-count">{offeredSkills.length}</span>
            </button>
            <button 
              className={`profile-tab ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Skills Wanted
              <span className="tab-count">{requestedSkills.length}</span>
            </button>
            <button 
              className={`profile-tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
              <span className="tab-count">{user.reviewsReceived?.length || 0}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="profile-tab-content">
            {activeTab === 'offers' && (
              <div className="skills-list-profile">
                {offeredSkills.length > 0 ? (
                  offeredSkills.map(skill => (
                    <div key={skill._id} className="skill-card-profile">
                      <div className="skill-card-header">
                        <span className="skill-category-tag">{skill.category}</span>
                        <span className="skill-level">{skill.proficiencyLevel}</span>
                      </div>
                      <h3>{skill.title}</h3>
                      <p>{skill.description?.slice(0, 150)}...</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-tab">
                    <p>No skills offered yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="skills-list-profile">
                {requestedSkills.length > 0 ? (
                  requestedSkills.map(skill => (
                    <div key={skill._id} className="skill-card-profile">
                      <div className="skill-card-header">
                        <span className="skill-category-tag">{skill.category}</span>
                        <span className="skill-level">{skill.proficiencyLevel}</span>
                      </div>
                      <h3>{skill.title}</h3>
                      <p>{skill.description?.slice(0, 150)}...</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-tab">
                    <p>No skill requests yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-list">
                {user.reviewsReceived?.length > 0 ? (
                  user.reviewsReceived.map((review, index) => (
                    <div key={index} className="review-card">
                      <div className="review-header">
                        <div className="review-avatar">{review.reviewer?.name?.charAt(0) || 'U'}</div>
                        <div>
                          <span className="review-author">{review.reviewer?.name || 'Anonymous'}</span>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} viewBox="0 0 24 24" fill={i < review.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className={i < review.rating ? 'star-filled' : 'star-empty'}>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="review-text">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-tab">
                    <p>No reviews yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
