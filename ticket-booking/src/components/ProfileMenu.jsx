import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearSession } from '../auth/authStorage.js'
import './ProfileMenu.css'

function initials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

export default function ProfileMenu({ user }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    function onEsc(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  function logout() {
    clearSession()
    navigate('/', { replace: true })
  }

  return (
    <div className="pmRoot" ref={rootRef}>
      <button
        type="button"
        className="pmButton"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title="Profile"
      >
        <span className="pmAvatar" aria-hidden="true">
          {initials(user?.name)}
        </span>
      </button>

      {open ? (
        <div className="pmMenu" role="menu">
          <div className="pmHeader">
            <div className="pmAvatarBig" aria-hidden="true">
              {initials(user?.name)}
            </div>
            <div className="pmInfo">
              <div className="pmName">{user?.name || 'User'}</div>
              <div className="pmEmail">{user?.email || ''}</div>
              <div className="pmDept">{user?.department || ''}</div>
            </div>
          </div>

          <div className="pmLinks">
            <Link className="pmLink" to="/profile" role="menuitem" onClick={() => setOpen(false)}>
              Profile
            </Link>
            <Link className="pmLink" to="/events" role="menuitem" onClick={() => setOpen(false)}>
              Events
            </Link>
            <Link className="pmLink" to="/history" role="menuitem" onClick={() => setOpen(false)}>
              Booking history
            </Link>
          </div>

          <button className="pmLogout" type="button" role="menuitem" onClick={logout}>
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}

