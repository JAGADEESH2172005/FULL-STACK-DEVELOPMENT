import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../auth/authStorage.js'
import './Auth.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = useMemo(() => {
    const state = location.state
    if (state && typeof state === 'object' && typeof state.from === 'string') {
      return state.from
    }
    return '/events'
  }, [location.state])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const res = await login({ email, password })
    if (!res.ok) {
      setError(res.message)
      return
    }

    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="authTop">
          <div>
            <h1 className="authH1">Login</h1>
            <p className="authP">Sign in before booking tickets.</p>
          </div>
          <Link className="authLink" to="/">
            Home
          </Link>
        </div>

        {error ? <div className="authBanner">{error}</div> : null}

        <form className="authForm" onSubmit={handleSubmit} noValidate>
          <div className="authField">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              inputMode="email"
            />
          </div>

          <div className="authField">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Your password"
            />
          </div>

          <div className="authActions">
            <button className="authBtn" type="submit">
              Login
            </button>
            <Link className="authLink" to="/signup">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

