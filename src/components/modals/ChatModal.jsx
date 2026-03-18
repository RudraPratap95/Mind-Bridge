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

  const send = async () => {
    const msg = input.trim()
    if (!msg) return
    setInput('')
    const userMsg = { id: Date.now(), role: 'user', text: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setTyping(true)
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: data.reply || "No response received." }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: "Sorry, I'm having trouble connecting to the secure server right now. 🌿" }])
    } finally {
      setTyping(false)
    }
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
