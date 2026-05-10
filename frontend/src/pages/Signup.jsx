import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Globe, MapPin, Lock, Eye, EyeOff, Plane, ArrowRight, CheckCircle } from 'lucide-react'

const TRAVEL_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
]

export default function Signup() {
  const [showPass, setShowPass] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    city: '', country: '', password: '', info: ''
  })
  const navigate = useNavigate()
  const imgIndex = Math.floor(Date.now() / 10000) % TRAVEL_IMAGES.length

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-surface-50 flex overflow-hidden">
      {/* Left panel - Image */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={TRAVEL_IMAGES[imgIndex]}
            alt="travel"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-50 via-surface-50/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-xl">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="gradient-text-purple">Travel</span>
              <span className="gradient-text-purple">Travel</span>
              <span className="text-slate-900">oop</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
            Your next adventure<br />
            <span className="gradient-text">starts here</span>
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Join thousands of travelers planning smarter, exploring more, and spending less.
          </p>
          {[
            'AI-powered itinerary generation',
            'Real-time budget tracking',
            'Community trip sharing',
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <span className="text-slate-600 text-sm">{feat}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right panel - Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-xl">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text-purple">Travel</span>
                <span className="gradient-text-purple">Travel</span>
                <span className="text-slate-900">oop</span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-500">Start planning your adventures for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">First Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="signup-firstname"
                    type="text"
                    placeholder="Sneh"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="input-field pl-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Last Name</label>
                <input
                  id="signup-lastname"
                  type="text"
                  placeholder="Chauhan"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="input-field text-sm"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10 text-sm"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="signup-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>

            {/* City + Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="signup-city"
                    type="text"
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="signup-country"
                    type="text"
                    placeholder="India"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="signup-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-11 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">About You (optional)</label>
              <textarea
                id="signup-info"
                placeholder="Tell us about your travel style..."
                value={form.info}
                onChange={(e) => setForm({ ...form, info: e.target.value })}
                className="input-field text-sm resize-none"
                rows={2}
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              id="signup-submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base mt-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
