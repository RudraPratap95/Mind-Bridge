import { CRISIS_RESOURCES } from '../../data/constants'

export default function CrisisModal({ open, onClose }) {
  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="modal-title">You Are Not Alone 💙</div>
        <div className="modal-sub">If you're in distress, please reach out. Help is available 24/7.</div>
        {CRISIS_RESOURCES.map(r => (
          <div className="crisis-card" key={r.name}>
            <div className="crisis-name">{r.name}</div>
            <div className="crisis-desc">{r.desc}</div>
            <div className="crisis-footer">
              <span className="crisis-hours">{r.hours}</span>
              <a className="crisis-call" href={`tel:${r.phone}`}>📞 {r.phone}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
