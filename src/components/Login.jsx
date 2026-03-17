import { useState } from 'react'
import './Login.css'

export default function Login({ onLogin }) {
  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return alert('Please enter a valid college email.')
    
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
    }, 1200)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length < 4) return alert('Please enter the OTP.')
    setLoading(true)
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      setLoading(false)
      
      if (data.token) {
        onLogin(data.token, data.student) // Pass JWT token and student data up
      } else {
        alert(data.error || 'Verification failed')
      }
    } catch (err) {
      setLoading(false)
      alert('Unable to connect to secure server. Try again.')
      console.error(err)
    }
  }

  const handleAnonymous = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: null }) // Anonymous request
      })
      const data = await res.json()
      setLoading(false)
      
      if (data.token) {
        onLogin(data.token, data.student)
      }
    } catch (err) {
      setLoading(false)
      alert('Network error')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-blobs">
        <div className="login-blob b1"></div>
        <div className="login-blob b2"></div>
      </div>

      <div className="login-content">
        <div className="login-logo-area">
          <div className="login-logo" onClick={() => onLogin('counselor')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h1>MindBridge AI</h1>
          <p>Your safe space to think, feel, and heal.</p>
        </div>

        <div className="login-card">
          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="login-form">
              <h2 className="login-title">Student Verification</h2>
              <div className="login-input-group">
                <label>College Email</label>
                <input 
                  type="email" 
                  placeholder="student@college.edu / .ac.in" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <button type="submit" className="login-btn-primary" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send Secure OTP'}
              </button>
              
              <p className="login-privacy-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                We only use your college email to verify you're a student. We never share it. No passwords stored.
              </p>

              <div className="login-divider"><span>OR</span></div>
              
              <button type="button" className="login-btn-anon" onClick={handleAnonymous}>
                Continue Anonymously
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="login-form">
              <h2 className="login-title">Enter OTP</h2>
              <p className="login-subtitle">We sent a secure code to <strong>{email}</strong></p>
              
              <div className="login-input-group">
                <input 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))}
                  className="login-otp-input"
                  disabled={loading}
                />
              </div>
              
              <button type="submit" className="login-btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Enter'}
              </button>

              <button type="button" className="login-btn-back" onClick={() => setStep('email')}>
                ← Back to Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
