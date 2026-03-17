import { useState, useRef, useEffect } from 'react'

const PHASES = [
  { name: 'Inhale', dur: 4000, cls: 'inhale' },
  { name: 'Hold', dur: 4000, cls: 'hold' },
  { name: 'Exhale', dur: 4000, cls: 'exhale' },
  { name: 'Hold', dur: 4000, cls: 'hold' },
]

export default function BreathingModal({ open, onClose, showToast }) {
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState(null)
  const [breathCount, setBreathCount] = useState(0)
  const [circleText, setCircleText] = useState('Press Start')
  const [circleClass, setCircleClass] = useState('')
  const timerRef = useRef(null)
  const phaseRef = useRef(0)
  const countRef = useRef(0)

  const stopBreath = () => {
    clearTimeout(timerRef.current)
    setActive(false)
    setPhase(null)
    setBreathCount(0)
    setCircleText('Press Start')
    setCircleClass('')
    phaseRef.current = 0
    countRef.current = 0
  }

  const runPhase = () => {
    const p = PHASES[phaseRef.current % PHASES.length]
    setCircleClass(p.cls)
    setCircleText(p.name)
    setPhase(p.name.toUpperCase())
    if (phaseRef.current % PHASES.length === 0) {
      countRef.current += 1
      setBreathCount(countRef.current)
    }
    if (countRef.current > 6) {
      stopBreath()
      showToast('✨ Breathing complete! Great job.')
      return
    }
    phaseRef.current += 1
    timerRef.current = setTimeout(runPhase, p.dur)
  }

  const toggle = () => {
    if (active) { stopBreath() }
    else {
      setActive(true)
      phaseRef.current = 0
      countRef.current = 0
      runPhase()
    }
  }

  // cleanup on unmount or close
  useEffect(() => { if (!open) stopBreath() }, [open])
  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="modal-title">Box Breathing 📦</div>
        <div className="modal-sub">A simple 4-4-4 technique to calm your nervous system.</div>
        <div className="breath-wrap">
          <div className={`breath-circle${circleClass ? ' ' + circleClass : ''}`}>{circleText}</div>
          <div>
            <div className="breath-phase">{phase || '—'}</div>
            {breathCount > 0 && (
              <div className="breath-count">Breath {breathCount} / 6</div>
            )}
          </div>
          <button className="btn-primary" onClick={toggle} style={{ padding: '14px 40px', fontSize: 15 }}>
            {active ? '⏹ Stop' : '▶ Start'}
          </button>
        </div>
      </div>
    </div>
  )
}
