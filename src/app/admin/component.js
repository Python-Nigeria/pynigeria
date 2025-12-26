"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  
  // Simple password protection (optional)
  const ADMIN_PASSWORD = "python9ja2025" // Change this!
  
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      loadStats()
    } else {
      alert("Wrong password!")
    }
  }
  
  useEffect(() => {
    // Auto-load if no password protection needed
    // loadStats()
  }, [])
  
  const loadStats = async () => {
    setLoading(true)
    try {
      // Get total views
      const totalViews = await window.storage.get('wrap_total_views', true)
      
      // Get all individual view keys
      const allKeys = await window.storage.list('wrap_views:', false)
      
      // Fetch individual user stats
      const userStats = []
      for (const key of allKeys.keys || []) {
        try {
          const data = await window.storage.get(key, false)
          if (data) {
            const parsed = JSON.parse(data.value)
            const userName = key.replace('wrap_views:', '')
            userStats.push({
              user: userName,
              count: parsed.count,
              lastViewed: new Date(parsed.lastViewed).toLocaleString(),
              history: parsed.history || []
            })
          }
        } catch (e) {
          console.error('Error loading user stat:', e)
        }
      }
      
      // Sort by view count
      userStats.sort((a, b) => b.count - a.count)
      
      // Calculate additional metrics
      const totalUniqueViews = userStats.length
      const avgViewsPerUser = totalUniqueViews > 0 ? (parseInt(totalViews?.value || 0) / totalUniqueViews) : 0
      const mostActiveUser = userStats[0]
      
      setStats({
        totalViews: totalViews ? parseInt(totalViews.value) : 0,
        uniqueUsers: totalUniqueViews,
        avgViewsPerUser: avgViewsPerUser.toFixed(1),
        mostActiveUser: mostActiveUser,
        userStats: userStats
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Password protection screen
  if (!authenticated) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="card shadow-lg border-0" style={{maxWidth: '400px', width: '100%'}}>
          <div className="card-body p-5">
            <h2 className="text-center mb-4">🔒 Admin Access</h2>
            <p className="text-center text-muted mb-4">Enter password to view stats</p>
            <input 
              type="password"
              className="form-control form-control-lg mb-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button 
              className="btn btn-primary btn-lg w-100"
              onClick={handleLogin}
            >
              Login
            </button>
            <Link href="/wrapped/individual" className="btn btn-link w-100 mt-3">
              Back to Wrap
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading stats...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-vh-100" style={{background: '#f8f9fa'}}>
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark shadow-sm mb-4">
        <div className="container">
          <span className="navbar-brand mb-0 h1">📊 Python 9ja Wrap Stats</span>
          <Link href="/wrapped/individual" className="btn btn-outline-light btn-sm">
            Back to Wrap
          </Link>
        </div>
      </nav>
      
      <div className="container py-5">
        {/* Summary Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <div className="text-primary mb-2" style={{fontSize: '2rem'}}>👥</div>
                <h3 className="display-5 fw-bold text-primary mb-1">{stats.totalViews}</h3>
                <p className="text-muted mb-0 small">Total Views</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <div className="text-success mb-2" style={{fontSize: '2rem'}}>✨</div>
                <h3 className="display-5 fw-bold text-success mb-1">{stats.uniqueUsers}</h3>
                <p className="text-muted mb-0 small">Unique Users</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <div className="text-warning mb-2" style={{fontSize: '2rem'}}>📈</div>
                <h3 className="display-5 fw-bold text-warning mb-1">{stats.avgViewsPerUser}</h3>
                <p className="text-muted mb-0 small">Avg Views/User</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <div className="text-danger mb-2" style={{fontSize: '2rem'}}>👑</div>
                <h3 className="display-6 fw-bold text-danger mb-1">
                  {stats.mostActiveUser?.count || 0}
                </h3>
                <p className="text-muted mb-0 small">Top User Views</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Most Active User Highlight */}
        {stats.mostActiveUser && (
          <div className="alert alert-success shadow-sm mb-4" role="alert">
            <div className="d-flex align-items-center">
              <div className="fs-1 me-3">🏆</div>
              <div>
                <h5 className="alert-heading mb-1">Most Engaged User</h5>
                <p className="mb-0">
                  <strong>{stats.mostActiveUser.user}</strong> checked their wrap <strong>{stats.mostActiveUser.count} times</strong>!
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* User Stats Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Individual View Counts</h5>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={loadStats}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{width: '80px'}} className="text-center">Rank</th>
                    <th>User (Phone Number)</th>
                    <th className="text-center">Views</th>
                    <th>Last Viewed</th>
                    <th className="text-end">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.userStats.length > 0 ? (
                    stats.userStats.map((user, idx) => (
                      <tr key={idx}>
                        <td className="text-center">
                          <span className="fw-bold">
                            {idx === 0 && '🥇'}
                            {idx === 1 && '🥈'}
                            {idx === 2 && '🥉'}
                            {idx > 2 && `#${idx + 1}`}
                          </span>
                        </td>
                        <td>
                          <div className="fw-semibold">{user.user}</div>
                        </td>
                        <td className="text-center">
                          <span className={`badge rounded-pill ${
                            user.count >= 5 ? 'bg-success' : 
                            user.count >= 3 ? 'bg-primary' : 
                            'bg-secondary'
                          }`}>
                            {user.count} {user.count === 1 ? 'view' : 'views'}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">{user.lastViewed}</small>
                        </td>
                        <td className="text-end">
                          <div className="progress" style={{height: '8px', width: '100px', marginLeft: 'auto'}}>
                            <div 
                              className="progress-bar bg-primary" 
                              style={{width: `${(user.count / (stats.mostActiveUser?.count || 1)) * 100}%`}}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        No data yet. Users will appear here once they check their wrap!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="text-center mt-5 text-muted">
          <small>
            <i className="fas fa-info-circle me-2"></i>
            Stats update in real-time. Last refreshed: {new Date().toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  )
}