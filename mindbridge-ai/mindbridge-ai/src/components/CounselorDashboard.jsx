import { useState, useEffect } from 'react'
import './CounselorDashboard.css'

export default function CounselorDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('monitoring') // 'monitoring' | 'trends'
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/counselor/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed fetching students:', err)
        setLoading(false)
      })
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    
    try {
      const res = await fetch('http://localhost:5000/api/counselor/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousId: selectedStudent.anonymousId,
          text: message.trim()
        })
      })
      
      if (res.ok) {
        alert(`Message securely sent to ${selectedStudent.anonymousId}! It will appear in their app as a supportive notification.`)
        setSelectedStudent(null)
        setMessage('')
      } else {
        alert('Failed to send message.')
      }
    } catch (err) {
      alert('Network error trying to send the message.')
    } finally {
      setSending(false)
    }
  }

  const renderTrendChart = () => (
    <div className="cd-chart-box">
      <div className="cd-chart-header">
        <h4>Campus Mood Trends (Last 7 Days)</h4>
        <span className="cd-badge cd-badge-neutral">Based on active campus data</span>
      </div>
      <div className="cd-mock-chart">
        <svg viewBox="0 0 400 150" className="cd-trend-svg">
          {/* Grid */}
          <line x1="0" y1="25" x2="400" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1="125" x2="400" y2="125" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          
          {/* Data Lines */}
          <polyline 
            points="0,100 60,110 120,80 180,90 240,60 300,70 360,40 400,30" 
            fill="none" 
            stroke="#4dc8c8" /* Positive Moods */
            strokeWidth="3" 
            strokeLinejoin="round" 
            strokeLinecap="round" 
          />
          <polyline 
            points="0,60 60,50 120,70 180,50 240,90 300,80 360,110 400,100" 
            fill="none" 
            stroke="#f0a050" /* Negative Moods */
            strokeWidth="3" 
            strokeLinejoin="round" 
            strokeLinecap="round" 
          />
        </svg>
        <div className="cd-chart-legend">
          <span className="cd-legend-item"><div className="cd-dot" style={{background: '#4dc8c8'}}></div> Positive (Okay/Good/Great)</span>
          <span className="cd-legend-item"><div className="cd-dot" style={{background: '#f0a050'}}></div> Negative (Low/Meh)</span>
        </div>
      </div>

      <div className="cd-trend-insights mt16">
        <div className="cd-insight">
          <div className="cd-insight-icon">📉</div>
          <div>
            <h5>Stress levels peaking</h5>
            <p>24% increase in negative mood check-ins compared to last week (Midterms).</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="cd-wrapper">
      {/* Top Navbar */}
      <header className="cd-header">
        <div className="cd-logo-area">
          <div className="cd-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <h1>MindBridge Portal</h1>
            <p>Counselor Dashboard</p>
          </div>
        </div>
        <button className="cd-btn-logout" onClick={onLogout}>Sign Out</button>
      </header>

      {/* Main Content Area */}
      <main className="cd-main">
        {/* Stats Row */}
        <section className="cd-kpi-row">
          <div className="cd-kpi-card">
            <div className="cd-kpi-val">{students.length}</div>
            <div className="cd-kpi-lbl">Total Monitored Students</div>
          </div>
          <div className="cd-kpi-card">
            <div className="cd-kpi-val cd-val-high">{students.filter(s => s.riskLevel === 'High').length}</div>
            <div className="cd-kpi-lbl">High Risk Students Active</div>
          </div>
          <div className="cd-kpi-card">
            <div className="cd-kpi-val">
               {students.length > 0 ? Math.round((students.filter(s => s.riskLevel !== 'Low').length / students.length) * 100) : 0}%
            </div>
            <div className="cd-kpi-lbl">Intervention Need Rate</div>
          </div>
        </section>

        {/* Tab Navigation */}
        <nav className="cd-tabs">
          <button 
            className={`cd-tab ${activeTab === 'monitoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitoring')}
          >
            🛡️ Live Risk Monitoring
          </button>
          <button 
            className={`cd-tab ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            📊 Campus Trends
          </button>
        </nav>

        {/* Dynamic Content */}
        {activeTab === 'monitoring' && (
          <section className="cd-panel">
            <div className="cd-panel-header">
              <h3>Anonymous Student Monitoring</h3>
              <p>Identities are fully encrypted. You can only communicate via secure, anonymous push interventions.</p>
            </div>
            
            <div className="cd-student-list">
              {loading ? (
                <div style={{ padding: 20, textAlign: 'center' }}>Loading secure data...</div>
              ) : students.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center' }}>No students currently monitored.</div>
              ) : students.map(student => (
                <div key={student._id} className="cd-student-row">
                  <div className="cd-student-info">
                    <span className="cd-student-id">{student.anonymousId}</span>
                    <span className="cd-student-time">Active {new Date(student.lastActive).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="cd-student-meta">
                    <div className="cd-triggers">
                      {student.triggers?.map(t => <span key={t} className="cd-trigger-tag">{t}</span>)}
                    </div>
                    <span className={`cd-badge cd-badge-${student.riskLevel?.toLowerCase()}`}>
                      {student.riskLevel} Risk
                    </span>
                    <button 
                      className="cd-btn-outline"
                      onClick={() => setSelectedStudent(student)}
                    >
                      Send Support Msg
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'trends' && (
          <section className="cd-panel">
            {renderTrendChart()}
          </section>
        )}
      </main>

      {/* Message Modal */}
      {selectedStudent && (
        <div className="cd-modal-overlay">
          <div className="cd-modal">
            <h3>Send Support to {selectedStudent.id}</h3>
            <p className="cd-modal-desc">
              This student has been flagged as <strong>{selectedStudent.risk} Risk</strong>. 
              They will receive this message as an anonymous notification from the Counseling Center.
            </p>
            
            <form onSubmit={handleSendMessage}>
              <textarea 
                className="cd-textarea"
                rows="4"
                placeholder="E.g., We noticed you've been having a tough time. The college counseling center is here for you. Tap here to book a confidential appointment."
                value={message}
                onChange={e => setMessage(e.target.value)}
                autoFocus
              ></textarea>
              <div className="cd-modal-actions">
                <button type="button" className="cd-btn-ghost" onClick={() => setSelectedStudent(null)}>Cancel</button>
                <button type="submit" className="cd-btn-primary" disabled={sending || !message.trim()}>
                  {sending ? 'Sending...' : 'Send Secure Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
