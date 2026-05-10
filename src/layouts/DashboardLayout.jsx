import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, Sparkles, DollarSign, Compass,
  PackageCheck, Users, BookOpen, Search, User, Settings,
  Plane, ChevronLeft, ChevronRight, Bell, LogOut, Plus,
  BarChart2
} from 'lucide-react'

const sidebarLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/create-trip', icon: Plus, label: 'New Trip' },
  { to: '/itinerary', icon: Compass, label: 'Itinerary' },
  { to: '/ai-optimizer', icon: Sparkles, label: 'AI Optimizer' },
  { to: '/budget', icon: DollarSign, label: 'Budget' },
  { to: '/explore', icon: Search, label: 'Explore' },
  { to: '/checklist', icon: PackageCheck, label: 'Packing List' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/notes', icon: BookOpen, label: 'Trip Notes' },
  { to: '/admin', icon: BarChart2, label: 'Analytics' },
]

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-[#050a14] overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative flex flex-col glass border-r border-white/5 z-20 flex-shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-xl flex-shrink-0">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold whitespace-nowrap overflow-hidden"
              >
                <span className="gradient-text-purple">Travel</span>
                <span className="text-white">oop</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {sidebarLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-4 border-t border-white/5 space-y-1">
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Profile</span>}
          </NavLink>
          <button
            onClick={() => navigate('/')}
            className={`sidebar-link w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500/50 transition-all z-10"
          id="sidebar-collapse-btn"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 glass z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <div>
              <p className="text-white text-sm font-medium">Sneh Chauhan</p>
              <p className="text-slate-500 text-xs">Pro Traveler</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl glass text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </button>
            <Link to="/create-trip">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary text-sm flex items-center gap-2 py-2"
              >
                <Plus className="w-4 h-4" />
                New Trip
              </motion.button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-grid">
          {children}
        </main>
      </div>
    </div>
  )
}
