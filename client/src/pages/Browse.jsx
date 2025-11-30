import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import './Browse.css'

const categories = [
  'All Categories',
  'Programming',
  'Design',
  'Marketing',
  'Writing',
  'Music',
  'Languages',
  'Photography',
  'Video',
  'Business',
  'Other'
]

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
const types = ['All Types', 'Offer', 'Request']

function SkillCard({ skill }) {
  return (
    <motion.div 
      className="skill-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      <div className="skill-card-header">
        <span className={`skill-type-tag ${skill.type}`}>
          {skill.type === 'offer' ? 'Offering' : 'Seeking'}
        </span>
        <span className="skill-level-tag">{skill.level || 'Intermediate'}</span>
      </div>
      
      <h3 className="skill-card-title">{skill.title}</h3>
      <p className="skill-card-category">{skill.category}</p>
      <p className="skill-card-description">
        {skill.description?.slice(0, 120)}{skill.description?.length > 120 ? '...' : ''}
      </p>
      
      <div className="skill-card-footer">
        <Link to={`/profile/${skill.user?.username || skill.user}`} className="skill-card-user">
          <div className="skill-user-avatar">
            {skill.user?.name?.charAt(0) || 'U'}
          </div>
          <span>{skill.user?.name || 'User'}</span>
        </Link>
        <Link to={`/skill/${skill._id}`} className="btn btn-primary btn-sm">View Details</Link>
      </div>
    </motion.div>
  )
}

export default function Browse() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [selectedType, setSelectedType] = useState('All Types')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const res = await api.get('/skills')
      setSkills(res.data.data || [])
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || skill.category === selectedCategory
    const matchesLevel = selectedLevel === 'All Levels' || skill.proficiencyLevel === selectedLevel
    const matchesType = selectedType === 'All Types' || skill.type === selectedType.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesLevel && matchesType
  })

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All Categories')
    setSelectedLevel('All Levels')
    setSelectedType('All Types')
  }

  const hasActiveFilters = searchQuery || 
    selectedCategory !== 'All Categories' || 
    selectedLevel !== 'All Levels' || 
    selectedType !== 'All Types'

  return (
    <main className="browse-page">
      <div className="container">
        {/* Page Header */}
        <motion.div 
          className="browse-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="browse-header-content">
            <h1 className="browse-title">Discover Skills</h1>
            <p className="browse-subtitle">Find the perfect skill exchange partner from our community</p>
          </div>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input 
                type="text"
                className="search-input"
                placeholder="Search skills, categories, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              Filters
              {hasActiveFilters && <span className="filter-badge"></span>}
            </button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Category</label>
                  <select 
                    className="filter-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Level</label>
                  <select 
                    className="filter-select"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Type</label>
                  <select 
                    className="filter-select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group filter-actions">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="browse-results-bar">
          <span className="results-count">
            {loading ? 'Loading...' : `${filteredSkills.length} skills found`}
          </span>
          {hasActiveFilters && (
            <button className="clear-filters-link" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="browse-loading">
            <div className="spinner-lg"></div>
            <p>Loading skills...</p>
          </div>
        ) : filteredSkills.length > 0 ? (
          <motion.div 
            className="skills-grid"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map(skill => (
                <SkillCard key={skill._id} skill={skill} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="browse-empty">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h3>No skills found</h3>
            <p>Try adjusting your search or filters to find what you're looking for</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
