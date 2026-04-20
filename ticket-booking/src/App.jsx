import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import LoginPage from './pages/Login.jsx'
import SignupPage from './pages/Signup.jsx'
import EventsPage from './pages/Events.jsx'
import EventDetailsBookingPage from './pages/EventDetailsBooking.jsx'
import HistoryPage from './pages/History.jsx'
import ConfirmationPage from './pages/Confirmation.jsx'
import ProfilePage from './pages/Profile.jsx'
import RequireAuth from './routes/RequireAuth.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/events"
        element={
          <RequireAuth>
            <EventsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/events/:eventId"
        element={
          <RequireAuth>
            <EventDetailsBookingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/history"
        element={
          <RequireAuth>
            <HistoryPage />
          </RequireAuth>
        }
      />
      <Route
        path="/confirmation/:bookingId"
        element={
          <RequireAuth>
            <ConfirmationPage />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}

export default App
