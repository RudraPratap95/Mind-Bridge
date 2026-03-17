import { useRef, useEffect } from 'react'

const TABS = [
  {
    id: 'home', label: 'Home',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  },
  {
    id: 'journal', label: 'Journal',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  },
  {
    id: 'calm', label: 'Calm',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z"/><path d="M12 22C12 22 16 18 16 12C16 6 12 2 12 2"/><path d="M12 22C12 22 8 18 8 12C8 6 12 2 12 2"/></svg>
  },
  {
    id: 'insights', label: 'Insights',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  },
  {
    id: 'profile', label: 'Profile',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  },
]

export default function BottomNav({ activeTab, onSwitch }) {
  const navRef = useRef(null)
  const indicatorRef = useRef(null)

  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return
    const idx = TABS.findIndex(t => t.id === activeTab)
    const btns = navRef.current.querySelectorAll('.nav-btn')
    if (btns[idx]) {
      const navRect = navRef.current.getBoundingClientRect()
      const btnRect = btns[idx].getBoundingClientRect()
      const cx = btnRect.left - navRect.left + btnRect.width / 2
      indicatorRef.current.style.left = (cx - 20) + 'px'
    }
  }, [activeTab])

  return (
    <nav className="bottom-nav" ref={navRef}>
      <div className="desktop-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal-300)' }}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <span>MindBridge</span>
      </div>
      
      <div className="nav-indicator" ref={indicatorRef} />
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`nav-btn${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => onSwitch(tab.id)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
