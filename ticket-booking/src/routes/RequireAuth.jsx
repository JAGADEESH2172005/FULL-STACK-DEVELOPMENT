import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '../auth/authStorage.js'

export default function RequireAuth({ children }) {
  const location = useLocation()
  const session = getSession()

  if (!session?.userId) {
    const from = `${location.pathname}${location.search || ''}`
    return <Navigate to="/login" replace state={{ from }} />
  }

  return children
}

