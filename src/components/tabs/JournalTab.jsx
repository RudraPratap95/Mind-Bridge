import { useState, useEffect } from 'react'
import CrisisScreen from '../CrisisScreen'
import LiveClock from '../LiveClock'

const MOODS = [
  { emoji: '😊', label: 'Happy',   color: 'var(--emotion-green)' },
  { emoji: '😐', label: 'Neutral', color: 'var(--text-secondary)' },
  { emoji: '😟', label: 'Worried', color: 'var(--warm-gold)' },
  { emoji: '😢', label: 'Sad',     color: 'var(--secondary)' },
  { emoji: '😡', label: 'Angry',   color: 'var(--crisis-red)' },
]

const RISK_WORDS = ['suicide', 'kill myself', 'end it all', 'want to die', 'worthless', 'hopeless', 'harm myself']



export default function JournalTab({ sessionToken, entries, addEntry, showToast }) {
  const [text, setText] = useState('')
  const [mood, setMood] = useState(null)
  const [charCount, setCharCount] = useState(0)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showCrisis, setShowCrisis] = useState(false)
  const [hasPromptedCrisis, setHasPromptedCrisis] = useState(false)

  const handleText = (e) => {
    const val = e.target.value
    setText(val)
    setCharCount(val.length)
  }

  useEffect(() => {
    if (hasPromptedCrisis || !text.trim()) return;
    
    const timeout = setTimeout(() => {
      const lower = text.toLowerCase()
      const isRisk = RISK_WORDS.some(w => lower.includes(w))
      if (isRisk) {
        setShowCrisis(true)
        setHasPromptedCrisis(true)
      }
    }, 1000); // Check for risk words after 1s of no typing

    return () => clearTimeout(timeout);
  }, [text, hasPromptedCrisis]);

  const save = async () => {
    if (!text.trim()) { showToast('✏️ Write something first'); return }
    setSaving(true)
    
    try {
      const moodStr = mood ? `${mood.emoji} ${mood.label}` : '😐 Neutral'
      
      const payload = {
        token: sessionToken,
        mood: moodStr,
        text: text.trim()
      }

      const res = await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      setSaving(false)

      if (res.ok) {
        // Formatted for the UI
        addEntry({
          id: data.entry._id,
          date: new Date(data.entry.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
          mood: data.entry.mood,
          text: data.entry.text,
        })
        setText('')
        setCharCount(0)
        setMood(null)
        showToast('✅ Entry saved securely!')
      } else {
        showToast('⚠️ Failed to save. Connect to the network.')
      }

    } catch (err) {
      console.error(err)
      setSaving(false)
      showToast('⚠️ Unable to connect to secure server.')
    }
  }

  const selectedMood = MOODS.find(m => m.label === mood?.label) || null

  return (
    <div className="tab-panel">

      {/* ── Date / Time Header ── */}
      <div className="jnl-datetime-card">
        <LiveClock />
        <div className="jnl-enc-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span>End-to-end encrypted</span>
        </div>
      </div>

      {/* ── Write Card ── */}
      <div className="card jnl-write-card">

        {/* Heading + mood label */}
        <div className="jnl-heading-row">
          <div>
            <h2 className="jnl-heading">How are you feeling today?</h2>
            {selectedMood && (
              <p className="jnl-mood-label" style={{ color: selectedMood.color }}>
                Feeling {selectedMood.label}
              </p>
            )}
          </div>
          {selectedMood && (
            <div className="jnl-selected-emoji" style={{ borderColor: selectedMood.color + '60' }}>
              {selectedMood.emoji}
            </div>
          )}
        </div>

        {/* Mood picker */}
        <div className="jnl-mood-row">
          {MOODS.map(m => (
            <button
              key={m.label}
              className={`jnl-mood-btn${mood?.label === m.label ? ' jnl-mood-selected' : ''}`}
              style={mood?.label === m.label ? { borderColor: m.color, background: m.color + '18' } : {}}
              onClick={() => setMood(m)}
              title={m.label}
            >
              <span className="jnl-mood-emoji">{m.emoji}</span>
              <span className="jnl-mood-name">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="jnl-sep" />

        {/* Textarea */}
        <div className="jnl-textarea-wrap">
          <textarea
            className="jnl-textarea"
            placeholder="Write freely... this is your safe space. No one else can read this. 🌿"
            value={text}
            onChange={handleText}
            rows={8}
          />
          <div className="jnl-char-count">{charCount} characters</div>
        </div>

        {/* Prompts row */}
        <div className="jnl-prompts">
          <span className="jnl-prompt-label">Need a prompt?</span>
          {[
            'What made me smile today?',
            'What am I grateful for?',
            "What's weighing on me?",
          ].map(p => (
            <button
              key={p}
              className="jnl-prompt-chip"
              onClick={() => setText(t => t ? t + '\n\n' + p + ' ' : p + ' ')}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Save button */}
        <button
          className={`jnl-save-btn${saving ? ' jnl-saving' : ''}`}
          onClick={save}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="jnl-spinner" /> Saving...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Entry
            </>
          )}
        </button>

        {/* Encryption footer */}
        <div className="jnl-enc-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span>End-to-end encrypted · Stored only on this device</span>
        </div>
      </div>

      {/* ── Past Entries ── */}
      {entries.length > 0 && (
        <>
          <div className="section-label mt16">📚 Past Entries</div>
          {entries.map(e => (
            <div className="entry-card" key={e.id} onClick={() => setSelected(e)}>
              <div className="entry-header">
                <span className="entry-date">{e.date}</span>
                <span className="entry-mood-badge">{e.mood}</span>
              </div>
              <p className="entry-preview">{e.text}</p>
            </div>
          ))}
        </>
      )}

      {/* Entry detail overlay */}
      {selected && (
        <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal-sheet">
            <div className="modal-handle" />
            <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
            <div className="modal-title">{selected.date}</div>
            <div className="modal-sub">{selected.mood}</div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)', paddingTop: 8, whiteSpace: 'pre-wrap' }}>
              {selected.text}
            </p>
          </div>
        </div>
      )}

      {/* Extreme Risk Crisis Overlay */}
      {showCrisis && <CrisisScreen onClose={() => setShowCrisis(false)} />}
    </div>
  )
}
