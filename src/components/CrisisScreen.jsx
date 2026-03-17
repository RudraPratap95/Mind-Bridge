import { useState, useEffect } from 'react'
import './CrisisScreen.css'

export default function CrisisScreen({ onClose }) {
  const [phase, setPhase] = useState('Inhale')
  const [count, setCount] = useState(4)

  useEffect(() => {
    let tick = 4
    let currentPhase = 'Inhale'

    const interval = setInterval(() => {
      tick--
      if (tick === 0) {
        if (currentPhase === 'Inhale') { currentPhase = 'Hold'; tick = 4; }
        else if (currentPhase === 'Hold') { currentPhase = 'Exhale'; tick = 6; }
        else if (currentPhase === 'Exhale') { currentPhase = 'Hold Out'; tick = 2; }
        else if (currentPhase === 'Hold Out') { currentPhase = 'Inhale'; tick = 4; }
        setPhase(currentPhase)
      }
      setCount(tick)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getCircleClass = () => {
    if (phase === 'Inhale' || phase === 'Hold') return 'cs-circle-large'
    return 'cs-circle-small'
  }

  return (
    <div className="cs-overlay">
      <div className="cs-blobs">
        <div className="cs-blob cs-blob1" />
        <div className="cs-blob cs-blob2" />
      </div>

      <div className="cs-content">
        <div className="cs-header">
          <h2>We're here with you.</h2>
          <p>You're not alone. Whatever you're feeling right now, it's okay to feel it. Let's take a deep breath together.</p>
        </div>

        <div className="cs-breathing-module">
          <div className={`cs-circle ${getCircleClass()}`}>
            <div className="cs-phase-text">{phase}</div>
            <div className="cs-count-text">{count}</div>
          </div>
        </div>

        <div className="cs-actions">
          <a href="tel:9152987821" className="cs-btn cs-btn-urgent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
            Talk to a Counselor Now
          </a>
          
          <div className="cs-helpline-info">
            iCall Helpline: <strong>9152987821</strong><br/>
            Free, confidential, and available Mon-Sat (10AM-8PM)
          </div>

          <button className="cs-btn cs-btn-safe" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            I'm okay, take me back
          </button>
        </div>
      </div>
    </div>
  )
}
