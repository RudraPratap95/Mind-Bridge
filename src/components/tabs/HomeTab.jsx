import { useState, useEffect } from 'react'

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning, Priya 👋'
  if (h < 17) return 'Good afternoon, Priya 👋'
  return 'Good evening, Priya 👋'
}

const QUOTES = [
  "“You don’t have to control your thoughts. You just have to stop letting them control you.”",
  "“Mental health is not a destination, but a process. It’s about how you drive, not where you're going.”",
  "“Healing takes time, and asking for help is a courageous step.”",
  "“You are not your illness. You have an individual story to tell.”",
  "“Self-care is how you take your power back.”"
]

const QUICK_ACTIONS = [
  { icon: '📝', title: 'Write in Journal', tab: 'journal', bg: 'var(--card-bg)' },
  { icon: '🌱', title: 'Enter Calm Zone', tab: 'calm', bg: 'var(--card-bg)' },
  { icon: '💬', title: 'Talk to Someone', modal: 'crisis', bg: 'var(--card-bg)' },
]

export default function HomeTab({ latestEntry, onOpenModal, onSwitchTab, showToast }) {
  const [quote, setQuote] = useState(QUOTES[0])

  useEffect(() => {
    // Pick a pseudo-random quote based on the day of the year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    setQuote(QUOTES[dayOfYear % QUOTES.length])
  }, [])

  return (
    <div className="tab-panel">
      {/* Greeting Row */}
      <div className="home-greeting">
        <h2>{getGreeting()}</h2>
        <p>Your safe space to think, feel, and heal.</p>
      </div>

      {/* Daily Quote */}
      <div className="card home-quote-card">
        <div className="section-label">✨ Daily Inspiration</div>
        <p className="home-quote-text">{quote}</p>
      </div>

      {/* Mood Check-in Prompt */}
      <div className="card home-mood-card">
        <h3>How are you feeling today?</h3>
        <p>Log your mood to track your emotional well-being.</p>
        <button className="btn-primary mt12" onClick={() => onSwitchTab('insights')}>
          Check In Now ➔
        </button>
      </div>

      {/* Quick Actions */}
      <div className="section-label mt20">Quick Interventions</div>
      <div className="home-actions-scroll">
        {QUICK_ACTIONS.map(action => (
          <div 
            key={action.title} 
            className="home-action-pill" 
            style={{ background: action.bg }}
            onClick={() => action.modal ? onOpenModal(action.modal) : onSwitchTab(action.tab)}
          >
            <span className="home-act-icon">{action.icon}</span>
            <span className="home-act-title">{action.title}</span>
          </div>
        ))}
      </div>

      {/* Progress Card */}
      <div className="section-label mt20">Your Progress</div>
      <div className="card home-progress-card">
        <div className="home-prog-icon">🌟</div>
        <div className="home-prog-text">
          <h4>You've been consistent this week!</h4>
          <p>Great job taking care of your mental health.</p>
        </div>
      </div>

      {/* Recent Entry Snippet (Blurred) */}
      <div className="section-label mt20">Recent Thoughts</div>
      {latestEntry ? (
        <div className="card home-recent-card" onClick={() => onSwitchTab('journal')}>
          <div className="home-recent-header">
            <span className="home-recent-date">{latestEntry.date}</span>
            <span className="home-recent-mood">{latestEntry.mood}</span>
          </div>
          <div className="home-recent-blur-wrap">
            <p className="home-recent-preview">
              "{latestEntry.text.length > 120 ? latestEntry.text.substring(0, 120) + '...' : latestEntry.text}"
            </p>
            <div className="home-recent-overlay">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              Unlock to read
            </div>
          </div>
        </div>
      ) : (
        <div className="card home-recent-card" onClick={() => onSwitchTab('journal')} style={{ textAlign: 'center', opacity: 0.7 }}>
          <p>No recent thoughts logged. Tap to write your first entry.</p>
        </div>
      )}

    </div>
  )
}
