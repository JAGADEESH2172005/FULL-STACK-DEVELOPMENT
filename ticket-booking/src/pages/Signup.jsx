import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../auth/authStorage.js'
import './Auth.css'

export default function SignupPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const res = await signUp({ name, email, department, password })
    if (!res.ok) {
      setError(res.message)
      return
    }

    navigate('/events', { replace: true })
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="authTop">
          <div>
            <h1 className="authH1">Sign up</h1>
            <p className="authP">Create an account to continue booking.</p>
          </div>
          <Link className="authLink" to="/">
            Home
          </Link>
        </div>

        {error ? <div className="authBanner">{error}</div> : null}

        <form className="authForm" onSubmit={handleSubmit} noValidate>
          <div className="authField">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

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
            <label htmlFor="department">Department</label>
            <input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="CSE / ECE / ME / ..."
            />
          </div>

          <div className="authField">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Min 6 characters"
            />
          </div>

          <div className="authActions">
            <button className="authBtn" type="submit">
              Create account
            </button>
            <Link className="authLink" to="/login">
              I already have an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

