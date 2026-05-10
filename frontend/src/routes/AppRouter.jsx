import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Dashboard from '../pages/Dashboard'
import CreateTrip from '../pages/CreateTrip'
import AIOptimizer from '../pages/AIOptimizer'
import ItineraryBuilder from '../pages/ItineraryBuilder'
import BudgetAnalytics from '../pages/BudgetAnalytics'
import MyTrips from '../pages/MyTrips'
import ExplorePage from '../pages/Search'
import Profile from '../pages/Profile'
import PackingChecklist from '../pages/PackingChecklist'
import Community from '../pages/Community'
import TripNotes from '../pages/TripNotes'
import AdminAnalytics from '../pages/AdminAnalytics'

function NotFound() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center text-center">
      <div>
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <p className="text-slate-500 text-lg mb-6">Page not found</p>
        <a href="/" className="btn-primary px-6 py-3">Go Home</a>
      </div>
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/ai-optimizer" element={<AIOptimizer />} />
        <Route path="/itinerary" element={<ItineraryBuilder />} />
        <Route path="/budget" element={<BudgetAnalytics />} />
        <Route path="/trips" element={<MyTrips />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checklist" element={<PackingChecklist />} />
        <Route path="/community" element={<Community />} />
        <Route path="/notes" element={<TripNotes />} />
        <Route path="/admin" element={<AdminAnalytics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
