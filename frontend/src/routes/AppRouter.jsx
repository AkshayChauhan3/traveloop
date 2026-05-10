import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Dashboard from '../pages/Dashboard'
import CreateTrip from '../pages/CreateTrip'
import ItineraryBuilder from '../pages/ItineraryBuilder'
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
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
        <Route path="/itinerary" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/checklist" element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
