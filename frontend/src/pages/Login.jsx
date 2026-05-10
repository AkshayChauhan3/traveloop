import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Compass } from 'lucide-react'
import CursorTrailEffect from '../components/landing/CursorTrailEffect'

export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const [form, setForm]         = useState({ email: '', password: '', remember: false })
  const [loading, setLoading]   = useState(false)
  const [focused, setFocused]   = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 1400)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFAF7 50%, #F5F7F2 100%)' }}>

      <CursorTrailEffect />

      {/* Ambient blobs */}
      <div className="absolute inset-0 z-[0] pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 500, height: 350, borderRadius: '50%', filter: 'blur(90px)',
          background: 'radial-gradient(ellipse, rgba(76,175,80,0.1) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '10%',
          width: 300, height: 200, borderRadius: '50%', filter: 'blur(70px)',
          background: 'radial-gradient(ellipse, rgba(110,191,115,0.1) 0%, transparent 70%)',
        }} />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[10] w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'linear-gradient(135deg, #4CAF50, #3F8F50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(76,175,80,0.3)',
            }}>
              <Compass style={{ width: 26, height: 26, color: '#ffffff' }} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: '#1e2d1f' }}>
              Travel<span style={{ color: '#4CAF50' }}>oop</span>
            </span>
          </Link>
          <p style={{ color: '#4a6b4c', fontSize: 14, marginTop: 6 }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1.5px solid #dff3e3',
          boxShadow: '0 4px 24px rgba(76,175,80,0.1), 0 0 0 1px rgba(76,175,80,0.06)',
          padding: '32px 28px',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6,
                color: focused === 'email' ? '#4CAF50' : '#4a6b4c',
                transition: 'color 0.2s',
              }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  width: 16, height: 16, color: focused === 'email' ? '#4CAF50' : '#94a3b8',
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
                    background: '#ffffff',
                    border: `1.5px solid ${focused === 'email' ? '#4CAF50' : '#dff3e3'}`,
                    borderRadius: 10, color: '#1e2d1f', fontSize: 14, outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: focused === 'email' ? '0 0 0 3px rgba(76,175,80,0.12)' : 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6,
                color: focused === 'pass' ? '#4CAF50' : '#4a6b4c',
                transition: 'color 0.2s',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  width: 16, height: 16, color: focused === 'pass' ? '#4CAF50' : '#94a3b8',
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
                    background: '#ffffff',
                    border: `1.5px solid ${focused === 'pass' ? '#4CAF50' : '#dff3e3'}`,
                    borderRadius: 10, color: '#1e2d1f', fontSize: 14, outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: focused === 'pass' ? '0 0 0 3px rgba(76,175,80,0.12)' : 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4,
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
                  style={{ accentColor: '#4CAF50', width: 15, height: 15, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 13, color: '#4a6b4c' }}>Remember me</span>
              </label>
              <a href="#" style={{ fontSize: 13, color: '#4CAF50', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015 }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#bce8bc' : 'linear-gradient(135deg, #4CAF50, #3F8F50)',
                border: 'none', borderRadius: 10,
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: loading ? 'none' : '0 4px 15px rgba(76,175,80,0.3)',
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
            <div style={{ flex: 1, height: 1, background: '#dff3e3' }} />
            <span style={{ fontSize: 12, color: '#94a3b8' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#dff3e3' }} />
          </div>

          {/* Demo */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%', padding: '12px',
              background: 'rgba(76,175,80,0.07)',
              border: '1.5px solid rgba(76,175,80,0.2)',
              borderRadius: 10, color: '#3F8F50',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            Continue as Demo User
          </motion.button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#4CAF50', fontWeight: 500, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
