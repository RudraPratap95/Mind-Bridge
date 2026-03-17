import { useState, useEffect, useRef } from 'react'
import './Onboarding.css'

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
]

const PARTICLE_COUNT = 28

function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let W = canvas.width = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3 + 1.2,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -(Math.random() * 0.5 + 0.2),
      opacity: Math.random() * 0.5 + 0.15,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(77, 200, 200, ${p.opacity})`
        ctx.shadowBlur = 8
        ctx.shadowColor = 'rgba(34,168,168,0.5)'
        ctx.fill()

        p.x += p.dx
        p.y += p.dy
        p.opacity += (Math.random() - 0.5) * 0.01

        if (p.y < -10) { p.y = H + 5; p.x = Math.random() * W }
        if (p.x < -10) p.x = W + 5
        if (p.x > W + 10) p.x = -5
        p.opacity = Math.max(0.05, Math.min(0.65, p.opacity))
      })
      animId = requestAnimationFrame(draw)
    }

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', resize)
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [canvasRef])
}

export default function Onboarding({ onFinish }) {
  const [lang, setLang] = useState('en')
  const [dropOpen, setDropOpen] = useState(false)
  const [entering, setEntering] = useState(false)
  const canvasRef = useRef(null)

  useParticles(canvasRef)

  const selectedLang = LANGUAGES.find(l => l.code === lang)

  const handleStart = () => {
    setEntering(true)
    setTimeout(() => onFinish(lang), 650)
  }

  return (
    <div className="ob-root">
      {/* Particle canvas */}
      <canvas className="ob-canvas" ref={canvasRef} />

      {/* Radial glow blobs */}
      <div className="ob-glow ob-glow1" />
      <div className="ob-glow ob-glow2" />

      <div className={`ob-card${entering ? ' ob-exit' : ''}`}>
        {/* Logo */}
        <div className="ob-logo-wrap">
          <div className="ob-logo-ring ob-pulse">
            <div className="ob-logo-inner">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="20" fill="rgba(34,168,168,0.15)" stroke="rgba(77,200,200,0.5)" strokeWidth="1.5"/>
                {/* Brain-like mind icon */}
                <path d="M14 20c0-4.4 3.6-8 8-8s8 3.6 8 8c0 2.5-1.1 4.7-2.9 6.2V28a1 1 0 01-1 1h-8a1 1 0 01-1-1v-1.8C15.1 24.7 14 22.5 14 20z" fill="rgba(6, 182, 212, 0.25)" stroke="var(--secondary)" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M19 29v2m6-2v2" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M13.5 13.5l-2-2m25 0l2-2" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="28" cy="19" r="1.5" fill="var(--secondary)" opacity="0.7"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="ob-brand">
          Mind<span>Bridge</span> <span className="ob-ai">AI</span>
        </div>

        {/* Tagline */}
        <p className="ob-tagline">
          Your safe space to<br />
          <em>think, feel, and heal</em>
        </p>

        {/* Divider */}
        <div className="ob-divider" />

        {/* Language selector */}
        <div className="ob-lang-label">Choose your language</div>
        <div className="ob-dropdown-wrap">
          <button
            className={`ob-dropdown-btn${dropOpen ? ' open' : ''}`}
            onClick={() => setDropOpen(v => !v)}
          >
            <span className="ob-flag">🌐</span>
            <span className="ob-lang-name">{selectedLang.label} — {selectedLang.native}</span>
            <span className="ob-chevron">{dropOpen ? '▲' : '▼'}</span>
          </button>
          {dropOpen && (
            <div className="ob-dropdown-list">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  className={`ob-dropdown-item${l.code === lang ? ' selected' : ''}`}
                  onClick={() => { setLang(l.code); setDropOpen(false) }}
                >
                  <span>{l.label}</span>
                  <span className="ob-native">{l.native}</span>
                  {l.code === lang && <span className="ob-check">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA button */}
        <button className="ob-cta" onClick={handleStart}>
          <span>Get Started</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        {/* Privacy note */}
        <p className="ob-privacy">
          🔒 100% private. Your college cannot see your entries.
        </p>

        {/* Dots */}
        <div className="ob-dots">
          <span className="ob-dot active" />
          <span className="ob-dot" />
          <span className="ob-dot" />
        </div>
      </div>
    </div>
  )
}
