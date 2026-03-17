import { useState, useEffect } from 'react'
import MoodCalendar from '../MoodCalendar'

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const CBT_TIPS = [
  {
    title: "5-4-3-2-1 Grounding",
    desc: "Find 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Great for anxiety spikes."
  },
  {
    title: "Cognitive Reframing",
    desc: "Notice a negative thought? Ask yourself: 'Is this a fact, or a feeling? What advice would I give a friend in this situation?'"
  },
  {
    title: "Box Breathing",
    desc: "Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. This helps regulate your nervous system immediately."
  },
  {
    title: "Fact vs. Interpretation",
    desc: "Separate what actually happened from the story you're telling yourself about it. Facts don't have emotions attached."
  }
]
// Helper to convert emoji mood back to 0-100 scale
const moodToScore = (moodStr) => {
  if (!moodStr) return 50;
  if (moodStr.includes('😊')) return 90;
  if (moodStr.includes('😐')) return 50;
  if (moodStr.includes('😟')) return 30;
  if (moodStr.includes('😢')) return 20;
  if (moodStr.includes('😡')) return 10;
  return 50;
}

export default function InsightsTab({ entries = [] }) {
  const [dailyTip, setDailyTip] = useState(CBT_TIPS[0])

  useEffect(() => {
    // Pick a pseudo-random tip based on the day of the year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    setDailyTip(CBT_TIPS[dayOfYear % CBT_TIPS.length])
  }, [])



  return (
    <div className="tab-panel">

      {/* Hero / Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Your Insights 📊</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Understanding your patterns helps you grow.
        </p>
      </div>

      {/* Streak Counter */}
      <div className="card ins-streak-card">
        <div className="ins-streak-icon">🔥</div>
        <div>
          <h3 className="ins-streak-title">You've journaled 5 days in a row!</h3>
          <p className="ins-streak-sub">Consistency is key to self-awareness.</p>
        </div>
      </div>

      {/* Mood Calendar View */}
      <MoodCalendar entries={entries} />

      {/* Patterns Noticed */}
      <div className="section-label mt16">🔍 Patterns We Noticed</div>
      <div className="card ins-patterns-card">
        <div className="ins-pattern-item">
          <span className="ins-pattern-icon">🌙</span>
          <p>Your mood tends to dip slightly on <strong>Wednesdays</strong>.</p>
        </div>
        <div className="ins-pattern-item">
          <span className="ins-pattern-icon">📝</span>
          <p>You use words like <em>"tired"</em> and <em>"overwhelmed"</em> frequently during exam weeks.</p>
        </div>
        <div className="ins-pattern-item">
          <span className="ins-pattern-icon">☀️</span>
          <p>When you journal in the <strong>morning</strong>, your average mood is 15% higher.</p>
        </div>
      </div>

      {/* Daily CBT Tip */}
      <div className="section-label mt16">💡 Today's CBT Tip</div>
      <div className="ins-tip-card">
        <div className="ins-tip-header">
          <div className="ins-tip-badge">Daily Tool</div>
          <h4 className="ins-tip-title">{dailyTip.title}</h4>
        </div>
        <p className="ins-tip-body">{dailyTip.desc}</p>
      </div>

    </div>
  )
}
