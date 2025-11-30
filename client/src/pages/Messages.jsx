import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import './Messages.css'

export default function Messages() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations').catch(() => ({ data: { data: [] } }))
      
      setConversations(res.data.data || [
        // Sample data for UI
        {
          _id: '1',
          participant: { name: 'John Doe', username: 'johndoe' },
          lastMessage: { content: 'Hey, I\'m interested in learning React!', createdAt: new Date() },
          unreadCount: 2
        },
        {
          _id: '2',
          participant: { name: 'Jane Smith', username: 'janesmith' },
          lastMessage: { content: 'Thanks for the Python lessons!', createdAt: new Date(Date.now() - 86400000) },
          unreadCount: 0
        }
      ])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = (conv) => {
    setSelectedConversation(conv)
    setMessages([
      { _id: '1', content: 'Hi! I saw your React skill offer.', sender: { _id: 'other' }, createdAt: new Date(Date.now() - 3600000) },
      { _id: '2', content: 'Yes! I\'d love to help you learn React.', sender: { _id: 'me' }, createdAt: new Date(Date.now() - 3000000) },
      { _id: '3', content: 'What experience do you have?', sender: { _id: 'other' }, createdAt: new Date(Date.now() - 2400000) },
    ])
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    setMessages(prev => [...prev, {
      _id: Date.now().toString(),
      content: newMessage,
      sender: { _id: 'me' },
      createdAt: new Date()
    }])
    setNewMessage('')
  }

  const formatTime = (date) => {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    
    if (diff < 86400000) return formatTime(date)
    if (diff < 172800000) return 'Yesterday'
    return d.toLocaleDateString()
  }

  return (
    <main className="messages-page">
      <div className="messages-container">
        {/* Sidebar */}
        <motion.aside 
          className="conversations-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="sidebar-header">
            <h2>Messages</h2>
            <button className="new-message-btn" title="New Message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          
          <div className="search-messages">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Search conversations..." />
          </div>

          <div className="conversations-list">
            {loading ? (
              <div className="conversations-loading">
                <div className="spinner"></div>
              </div>
            ) : conversations.length > 0 ? (
              conversations.map(conv => (
                <div 
                  key={conv._id}
                  className={`conversation-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="conv-avatar">
                    {conv.participant?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="conv-info">
                    <div className="conv-header">
                      <span className="conv-name">{conv.participant?.name}</span>
                      <span className="conv-time">{formatDate(conv.lastMessage?.createdAt)}</span>
                    </div>
                    <p className="conv-preview">{conv.lastMessage?.content}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
              ))
            ) : (
              <div className="no-conversations">
                <p>No conversations yet</p>
              </div>
            )}
          </div>
        </motion.aside>

        {/* Chat Area */}
        <motion.div 
          className="chat-area"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-user">
                  <div className="chat-avatar">
                    {selectedConversation.participant?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3>{selectedConversation.participant?.name}</h3>
                    <span className="chat-status">Online</span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="chat-action-btn" title="View Profile">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </button>
                  <button className="chat-action-btn" title="More Options">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="messages-list">
                {messages.map(msg => (
                  <div 
                    key={msg._id} 
                    className={`message ${msg.sender._id === 'me' ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{msg.content}</p>
                      <span className="message-time">{formatTime(msg.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form className="message-input-form" onSubmit={sendMessage}>
                <div className="message-input-wrapper">
                  <button type="button" className="attach-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  </button>
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the sidebar or start a new one</p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
