import { Link } from 'react-router-dom'
import { Compass, Github, Twitter, Instagram, Linkedin, Heart } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Dashboard',       to: '/dashboard' },
    { label: 'AI Optimizer',    to: '/ai-optimizer' },
    { label: 'Budget Analytics',to: '/budget' },
    { label: 'Itinerary Builder',to: '/itinerary' },
  ],
  Explore: [
    { label: 'Destinations',      to: '/explore' },
    { label: 'Community Trips',   to: '/community' },
    { label: 'My Trips',          to: '/trips' },
    { label: 'Packing Checklist', to: '/checklist' },
  ],
  Company: [
    { label: 'About Us', to: '/' },
    { label: 'Pricing',  to: '/' },
    { label: 'Blog',     to: '/' },
    { label: 'Contact',  to: '/' },
  ],
}

const socials = [
  { Icon: Twitter,   href: '#', label: 'Twitter' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Github,    href: '#', label: 'GitHub' },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="relative border-t" style={{ background: '#F5F7F2', borderColor: '#dff3e3' }}>
      {/* Gradient top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-xl">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text-purple">Travel</span>
                <span style={{ color: '#1e2d1f' }}>oop</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              Plan your travel itinerary easily with smart trip planning, budget tracking, and AI-powered travel suggestions.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-500 hover:text-brand-600 transition-all duration-200"
                  style={{ borderColor: '#dff3e3', background: '#ffffff' }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4 text-sm" style={{ color: '#1e2d1f' }}>{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-slate-500 hover:text-brand-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: '#dff3e3' }}>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-brand-500 fill-brand-500" /> by Traveloop Team · {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
