import { useState, useRef, useEffect } from 'react'
import { BOT_REPLIES } from '../../data/constants'

const INITIAL = [{ id: 0, role: 'bot', text: "Hi there 🌿 I'm here to listen. How are you feeling right now? You can share anything — there's no judgment here." }]

function sanitize(s) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
}

export default function ChatModal({ open, onClose }) {
  const [messages, setMessages] = useState(INITIAL)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = () => {
    const msg = input.trim()
    if (!msg) return
    setInput('')
    const userMsg = { id: Date.now(), role: 'user', text: msg }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)
    setTimeout(() => {
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)]
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }])
      setTyping(false)
    }, 1400 + Math.random() * 600)
  }

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="modal-title">Talk to MindBridge AI 🤖</div>
        <div className="modal-sub">A safe, judgment-free space. Your messages are private.</div>
        <div className="chat-messages">
          {messages.map(m => (
            <div key={m.id} className={`msg ${m.role}`}>{m.text}</div>
          ))}
          {typing && (
            <div className="msg bot">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Type something..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button className="send-btn" onClick={send}>➤</button>
        </div>
      </div>
    </div>
  )
}
