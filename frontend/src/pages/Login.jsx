import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import CursorTrailEffect from '../components/landing/CursorTrailEffect'

export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 1400)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#0f0f13' }}>

      {/* Cursor trail — renders at z-[2], behind the form */}
      <CursorTrailEffect />

      {/* Subtle ambient glow — behind everything */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 480, height: 320, borderRadius: '50%', filter: 'blur(90px)',
          background: 'radial-gradient(ellipse, rgba(109,40,217,0.18) 0%, transparent 70%)',
        }} />
      </div>

      {/* Login card — z-[10] keeps it above the trail */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[10] w-full max-w-sm"
      >
        {/* Logo mark */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 17.5L12 6L19 17.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: '#f1f0f5' }}>
              Travel<span style={{ color: '#a78bfa' }}>oop</span>
            </span>
          </Link>
          <p style={{ color: '#8b8799', fontSize: 14, marginTop: 6 }}>Sign in to your account</p>
        </div>

        {/* Card surface — Material Design elevation */}
        <div style={{
          background: '#1c1b22',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3), 0 16px 48px rgba(0,0,0,0.4)',
          padding: '32px 28px',
        }}>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email field — MD3 outlined style */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6,
                color: focused === 'email' ? '#a78bfa' : '#8b8799',
                transition: 'color 0.2s',
              }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  width: 16, height: 16, color: focused === 'email' ? '#a78bfa' : '#524f5e',
                }} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  required
                  style={{
                    width: '100%', padding: '11px 14px 11px 40px',
                    background: '#111017',
                    border: `1.5px solid ${focused === 'email' ? '#7c3aed' : 'rgba(255,255,255,0.09)'}`,
                    borderRadius: 10, color: '#f1f0f5', fontSize: 14, outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: focused === 'email' ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6,
                color: focused === 'pass' ? '#a78bfa' : '#8b8799',
                transition: 'color 0.2s',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  width: 16, height: 16, color: focused === 'pass' ? '#a78bfa' : '#524f5e',
                }} />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused('')}
                  required
                  style={{
                    width: '100%', padding: '11px 44px 11px 40px',
                    background: '#111017',
                    border: `1.5px solid ${focused === 'pass' ? '#7c3aed' : 'rgba(255,255,255,0.09)'}`,
                    borderRadius: 10, color: '#f1f0f5', fontSize: 14, outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: focused === 'pass' ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#524f5e', padding: 4,
                  }}
                >
                  {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={e => setForm({ ...form, remember: e.target.checked })}
                  style={{ accentColor: '#7c3aed', width: 15, height: 15, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 13, color: '#8b8799' }}>Remember me</span>
              </label>
              <a href="#" style={{ fontSize: 13, color: '#a78bfa', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>

            {/* Primary CTA — MD3 filled button */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015 }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#4a3a7a' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                border: 'none', borderRadius: 10,
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: loading ? 'none' : '0 4px 16px rgba(124,58,237,0.35)',
                transition: 'background 0.2s, box-shadow 0.2s',
                marginTop: 4,
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%' }}
                  />
                  Signing in…
                </>
              ) : (
                <>Sign In <ArrowRight style={{ width: 15, height: 15 }} /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: 12, color: '#524f5e' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Demo — MD3 tonal button */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%', padding: '12px',
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: 10, color: '#c4b5fd',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            Continue as Demo User
          </motion.button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#524f5e' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#a78bfa', fontWeight: 500, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
