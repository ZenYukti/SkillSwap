import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import './Notifications.css'

const notificationIcons = {
  deal_proposal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  ),
  deal_accepted: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  message: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  review: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  skillcoin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M8 10h8M8 14h8" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications').catch(() => ({ data: { data: [] } }))
      
      setNotifications(res.data.data || [
        // Sample data for UI demonstration
        {
          _id: '1',
          type: 'deal_proposal',
          title: 'New Trade Proposal',
          message: 'John Doe wants to trade Web Development for Graphic Design',
          read: false,
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          _id: '2',
          type: 'deal_accepted',
          title: 'Trade Accepted!',
          message: 'Jane Smith accepted your trade proposal for Python lessons',
          read: false,
          createdAt: new Date(Date.now() - 86400000)
        },
        {
          _id: '3',
          type: 'message',
          title: 'New Message',
          message: 'You have a new message from Mike Johnson',
          read: true,
          createdAt: new Date(Date.now() - 172800000)
        },
        {
          _id: '4',
          type: 'skillcoin',
          title: 'SkillCoins Earned',
          message: 'You earned 50 SkillCoins for completing a trade',
          read: true,
          createdAt: new Date(Date.now() - 259200000)
        },
        {
          _id: '5',
          type: 'review',
          title: 'New Review',
          message: 'Sarah left you a 5-star review!',
          read: true,
          createdAt: new Date(Date.now() - 345600000)
        }
      ])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => 
      n._id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const formatTime = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
    return d.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <main className="notifications-page">
      <div className="container">
        <motion.div 
          className="notifications-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-left">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} new</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </motion.div>

        <div className="notifications-filters">
          {['all', 'unread', 'deal_proposal', 'message', 'review'].map(f => (
            <button 
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : 
               f === 'unread' ? 'Unread' :
               f === 'deal_proposal' ? 'Trades' :
               f === 'message' ? 'Messages' : 'Reviews'}
            </button>
          ))}
        </div>

        <motion.div 
          className="notifications-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence>
            {loading ? (
              <div className="notifications-loading">
                <div className="spinner-lg"></div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <motion.div 
                  key={notification._id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification._id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                >
                  <div className={`notification-icon ${notification.type}`}>
                    {notificationIcons[notification.type] || notificationIcons.default}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4>{notification.title}</h4>
                      <span className="notification-time">{formatTime(notification.createdAt)}</span>
                    </div>
                    <p>{notification.message}</p>
                  </div>
                  {!notification.read && <span className="unread-dot"></span>}
                </motion.div>
              ))
            ) : (
              <div className="no-notifications">
                <div className="no-notif-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <h3>No notifications</h3>
                <p>You're all caught up!</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
}
