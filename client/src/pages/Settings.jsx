import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import './Settings.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Settings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    skills: []
  })

  // Password form state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNewMessage: true,
    emailDealUpdate: true,
    emailNewReview: true,
    emailWeeklyDigest: false,
    pushEnabled: true,
    pushMessages: true,
    pushDeals: true
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    allowMessages: 'everyone'
  })

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
      return
    }
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const user = res.data.user
      setProfile({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        skills: user.skills || []
      })
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('accessToken')
      await axios.put(`${API}/users/me`, {
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        website: profile.website
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Update local storage
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      userData.name = profile.name
      localStorage.setItem('user', JSON.stringify(userData))

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwords.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('accessToken')
      await axios.put(`${API}/users/me/password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setMessage({ type: 'success', text: 'Password changed successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' })
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('accessToken')
      await axios.put(`${API}/users/me/notifications`, notifications, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage({ type: 'success', text: 'Notification preferences saved!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save notification preferences' })
    } finally {
      setSaving(false)
    }
  }

  const handlePrivacySave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('accessToken')
      await axios.put(`${API}/users/me/privacy`, privacy, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage({ type: 'success', text: 'Privacy settings saved!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save privacy settings' })
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )},
    { id: 'security', label: 'Security', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    )},
    { id: 'notifications', label: 'Notifications', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    )},
    { id: 'privacy', label: 'Privacy', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )}
  ]

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-loading">
          <div className="spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <div className="container">
        <motion.div 
          className="settings-header"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1>Settings</h1>
          <p>Manage your account preferences and settings</p>
        </motion.div>

        <div className="settings-layout">
          {/* Sidebar */}
          <motion.aside 
            className="settings-sidebar"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <nav className="settings-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="settings-sidebar-footer">
              <button className="btn btn-outline btn-danger">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete Account
              </button>
            </div>
          </motion.aside>

          {/* Content */}
          <motion.main 
            className="settings-content"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            {message.text && (
              <div className={`settings-message ${message.type}`}>
                {message.type === 'success' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
                <span>{message.text}</span>
                <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2>Profile Information</h2>
                <p className="section-description">Update your personal information and public profile</p>
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        value={profile.username}
                        disabled
                        className="disabled"
                      />
                      <span className="form-hint">Username cannot be changed</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="disabled"
                    />
                    <span className="form-hint">Contact support to change email</span>
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell others about yourself..."
                      rows={4}
                      maxLength={500}
                    />
                    <span className="form-hint">{profile.bio.length}/500 characters</span>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="settings-section">
                <h2>Password & Security</h2>
                <p className="section-description">Manage your password and security settings</p>

                <form onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>

                <div className="security-section">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                  <button className="btn btn-outline" disabled>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Enable 2FA (Coming Soon)
                  </button>
                </div>

                <div className="security-section">
                  <h3>Active Sessions</h3>
                  <p>Manage devices where you're logged in</p>
                  <div className="session-list">
                    <div className="session-item current">
                      <div className="session-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      </div>
                      <div className="session-info">
                        <span className="session-device">Current Device</span>
                        <span className="session-details">Active now</span>
                      </div>
                      <span className="badge badge-success">Current</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2>Notification Preferences</h2>
                <p className="section-description">Choose how you want to be notified</p>

                <div className="notification-group">
                  <h3>Email Notifications</h3>
                  
                  <label className="toggle-item">
                    <div className="toggle-content">
                      <span className="toggle-label">New messages</span>
                      <span className="toggle-description">Get notified when you receive new messages</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNewMessage}
                      onChange={(e) => setNotifications({ ...notifications, emailNewMessage: e.target.checked })}
                    />
                    <span className="toggle-switch"></span>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-content">
                      <span className="toggle-label">Deal updates</span>
                      <span className="toggle-description">Get notified about barter deal status changes</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailDealUpdate}
                      onChange={(e) => setNotifications({ ...notifications, emailDealUpdate: e.target.checked })}
                    />
                    <span className="toggle-switch"></span>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-content">
                      <span className="toggle-label">New reviews</span>
                      <span className="toggle-description">Get notified when someone leaves you a review</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNewReview}
                      onChange={(e) => setNotifications({ ...notifications, emailNewReview: e.target.checked })}
                    />
                    <span className="toggle-switch"></span>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-content">
                      <span className="toggle-label">Weekly digest</span>
                      <span className="toggle-description">Receive a weekly summary of activity</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailWeeklyDigest}
                      onChange={(e) => setNotifications({ ...notifications, emailWeeklyDigest: e.target.checked })}
                    />
                    <span className="toggle-switch"></span>
                  </label>
                </div>

                <div className="notification-group">
                  <h3>Push Notifications</h3>
                  
                  <label className="toggle-item">
                    <div className="toggle-content">
                      <span className="toggle-label">Enable push notifications</span>
                      <span className="toggle-description">Receive notifications in your browser</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushEnabled}
                      onChange={(e) => setNotifications({ ...notifications, pushEnabled: e.target.checked })}
                    />
                    <span className="toggle-switch"></span>
                  </label>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleNotificationSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="settings-section">
                <h2>Privacy Settings</h2>
                <p className="section-description">Control your privacy and visibility</p>

                <div className="form-group">
                  <label>Profile Visibility</label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                  >
                    <option value="public">Public - Anyone can view your profile</option>
                    <option value="members">Members Only - Only logged-in users can view</option>
                    <option value="private">Private - Only you can view your profile</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Who can message you</label>
                  <select
                    value={privacy.allowMessages}
                    onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.value })}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="connections">Only people I've traded with</option>
                    <option value="none">No one</option>
                  </select>
                </div>

                <div className="privacy-toggles">
                  <label className="toggle-item">
                    <div className="toggle-content">
                      <span className="toggle-label">Show email on profile</span>
                      <span className="toggle-description">Allow others to see your email address</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.showEmail}
                      onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                    />
                    <span className="toggle-switch"></span>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-content">
                      <span className="toggle-label">Show location</span>
                      <span className="toggle-description">Display your location on your profile</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.showLocation}
                      onChange={(e) => setPrivacy({ ...privacy, showLocation: e.target.checked })}
                    />
                    <span className="toggle-switch"></span>
                  </label>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handlePrivacySave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>

                <div className="data-section">
                  <h3>Your Data</h3>
                  <p>Download or delete your account data</p>
                  <div className="data-actions">
                    <button className="btn btn-outline">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download My Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  )
}
