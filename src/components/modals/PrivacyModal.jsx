const ITEMS = [
  { icon: '✅', title: 'All data is stored locally', body: 'on your device only. Nothing is sent to any server.' },
  { icon: '✅', title: 'AI chat is anonymous', body: '— no name or identity is ever linked to your conversations.' },
  { icon: '✅', title: 'Journal entries are private', body: '— encrypted in your browser\'s local storage.' },
  { icon: '✅', title: 'No ads, no tracking', body: '— MindBridge AI will never share or sell your data.' },
  { icon: '✅', title: 'Delete anytime', body: '— all your data can be erased with one tap.' },
]

export default function PrivacyModal({ open, onClose }) {
  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="modal-title">Privacy & Data 🛡️</div>
        <div style={{ marginTop: 8 }}>
          {ITEMS.map(item => (
            <div className="privacy-item" key={item.title}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <span><strong>{item.title}</strong> {item.body}</span>
            </div>
          ))}
        </div>
        <button
          className="btn-primary"
          onClick={onClose}
          style={{ width: '100%', marginTop: 20, padding: '14px', fontSize: 14 }}
        >
          Got It ✓
        </button>
      </div>
    </div>
  )
}
