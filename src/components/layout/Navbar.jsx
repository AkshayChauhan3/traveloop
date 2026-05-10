import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Menu, X, Compass, LogIn, LayoutDashboard, Globe, DollarSign, Sparkles } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/explore', label: 'Explore' },
  { to: '/community', label: 'Community' },
  { to: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-brand-500 blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="relative bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-xl">
                  <Plane className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text-purple">Travel</span>
                <span className="text-white">oop</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/8 border border-brand-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-sm font-medium flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Planning
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              id="mobile-menu-btn"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass border-b border-white/5 md:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white bg-brand-500/20 border border-brand-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex gap-3 mt-2 pt-2 border-t border-white/5">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-sm text-center">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-sm text-center">
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
