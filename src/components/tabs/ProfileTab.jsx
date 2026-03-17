import { useState } from 'react'

export default function ProfileTab({ studentData, entries, onOpenModal, onLogout }) {
  const [anonMode, setAnonMode] = useState(false)
  const [notifs, setNotifs] = useState(true)
  const [dataSync, setDataSync] = useState(false)

  // Use real data from MongoDB backend via App.jsx
  const isAnon = anonMode || !studentData || studentData.anonymousId.startsWith('Anon')
  
  // Calculate initials from anonymousId if real name isn't available
  let initials = "??"
  let displayName = "Anonymous Student"
  if (studentData) {
      displayName = studentData.anonymousId
      initials = studentData.anonymousId.substring(0, 2).toUpperCase()
  }

  const collegeName = studentData?.college || "University Student"
  const yearOfStudy = studentData?.yearOfStudy || "Enrolled"

  // Calculate live stats from MongoDB entries array
  const totalEntries = entries?.length || 0;
  
  // Calculate unique days active
  const uniqueDays = new Set(entries?.map(e => e.date)).size;

  // Find most frequent mood
  let topMoodEmoji = "😐"
  if (entries && entries.length > 0) {
      const moodCounts = entries.reduce((acc, e) => {
          const emoji = e.mood.split(' ')[0]
          acc[emoji] = (acc[emoji] || 0) + 1
          return acc
      }, {})
      topMoodEmoji = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b)
  }

  return (
    <div className="tab-panel">
      
      {/* Privacy Hero Header */}
      <div className="prof-hero-card">
        <div className="prof-avatar-wrap">
          <div className="prof-avatar-initials">{initials}</div>
          <div className="prof-avatar-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
        </div>
        <div className="prof-identity">
          <h2 className="prof-name">{isAnon ? "Anonymous User" : displayName}</h2>
          <p className="prof-college">{isAnon ? "Private Identity" : collegeName}</p>
          <p className="prof-year">{isAnon ? "Hidden Details" : yearOfStudy}</p>
        </div>
      </div>

      {/* Your Journey Stats */}
      <div className="section-label mt16">📊 Your Journey</div>
      <div className="prof-stats-grid">
        <div className="prof-stat-box">
          <div className="prof-stat-val">{totalEntries}</div>
          <div className="prof-stat-lbl">Entries</div>
        </div>
        <div className="prof-stat-box">
          <div className="prof-stat-val">{uniqueDays}</div>
          <div className="prof-stat-lbl">Days Active</div>
        </div>
        <div className="prof-stat-box prof-stat-box-mood">
          <div className="prof-stat-val">{topMoodEmoji}</div>
          <div className="prof-stat-lbl">Avg Mood</div>
        </div>
      </div>

      {/* Privacy & Settings */}
      <div className="section-label mt20">🛡️ Privacy & Privacy</div>
      <div className="card prof-settings-card">
        
        <label className="setting-row">
          <div className="setting-left">
            <div className="setting-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--crisis-red)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </div>
            <div>
              <div className="setting-label">Anonymous Mode</div>
              <div className="setting-sub">Hides name & college in app</div>
            </div>
          </div>
          <div className="toggle">
            <input type="checkbox" checked={anonMode} onChange={e => setAnonMode(e.target.checked)} />
            <span className="toggle-slider"></span>
          </div>
        </label>

        <label className="setting-row">
          <div className="setting-left">
            <div className="setting-icon" style={{ background: 'rgba(34, 168, 168, 0.15)', color: 'var(--teal-300)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <div>
              <div className="setting-label">Care Notifications</div>
              <div className="setting-sub">Gentle daily check-in reminders</div>
            </div>
          </div>
          <div className="toggle">
            <input type="checkbox" checked={notifs} onChange={e => setNotifs(e.target.checked)} />
            <span className="toggle-slider"></span>
          </div>
        </label>

        <label className="setting-row">
          <div className="setting-left">
            <div className="setting-icon" style={{ background: 'rgba(134, 222, 222, 0.15)', color: 'var(--teal-200)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
            </div>
            <div>
              <div className="setting-label">Cloud Backup</div>
              <div className="setting-sub">End-to-end encrypted backup</div>
            </div>
          </div>
          <div className="toggle">
            <input type="checkbox" checked={dataSync} onChange={e => setDataSync(e.target.checked)} />
            <span className="toggle-slider"></span>
          </div>
        </label>

      </div>

      {/* Support Links */}
      <div className="section-label mt16">🤝 Support</div>
      <div className="prof-links">
        <button className="prof-link-btn" onClick={() => onOpenModal('privacy')}>
          <span>Privacy & Security Policy</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <button className="prof-link-btn" onClick={() => onOpenModal('crisis')}>
          <span>Emergency Resources & Crisis Lines</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      {/* Danger Zone */}
      <div className="prof-danger-zone">
        <button className="prof-btn-delete" onClick={() => {
          if (confirm("Are you sure? This will wipe your session from this device. Please log in again to sync.")) {
            onLogout()
          }
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Sign Out / Clear Device Data
        </button>
        <p className="prof-danger-desc">
          We believe in your right to be forgotten. Signing out clears the local cache immediately.
        </p>
      </div>

    </div>
  )
}
