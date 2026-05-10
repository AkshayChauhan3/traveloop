import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/landing/HeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import CursorTrailEffect from '../components/landing/CursorTrailEffect'

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#FAFAF7' }}>
      <CursorTrailEffect />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFAF7 100%)' }}>
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse at center, rgba(76,175,80,0.15), transparent 70%)' }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: '#1e2d1f' }}>
              Ready to plan your{' '}
              <span className="gradient-text">dream trip?</span>
            </h2>
            <p className="text-slate-500 text-lg mb-10">
              Join thousands of travelers who plan smarter with Traveloop's AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-10 py-4 rounded-2xl flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/explore">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-10 py-4 rounded-2xl flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Explore Destinations
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
