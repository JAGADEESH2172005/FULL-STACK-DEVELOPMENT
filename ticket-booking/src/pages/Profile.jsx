import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, updateCurrentUser } from '../auth/authStorage.js'
import { getDepartments, EVENTS } from '../data/events.js'
import { UNIVERSITY_NAME } from '../config/appConfig.js'
import ProfileMenu from '../components/ProfileMenu.jsx'
import './Profile.css'

export default function ProfilePage() {
  const departments = useMemo(() => getDepartments(EVENTS), [])
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    setName(u?.name || '')
    setDepartment(u?.department || '')
  }, [])

  async function save(e) {
    e.preventDefault()
    setMessage(null)

    const res = await updateCurrentUser({ name, department })
    if (!res.ok) {
      setMessage({ type: 'error', text: res.message })
      return
    }
    setUser(res.user)
    setMessage({ type: 'ok', text: 'Profile updated successfully.' })
  }

  return (
    <div className="pfWrap">
      <header className="evTop">
        <div className="evBrand">
          <div className="evMark" aria-hidden="true" />
          <div>
            <p className="evTitle">Profile</p>
            <p className="evSub">{UNIVERSITY_NAME}</p>
          </div>
        </div>

        <div className="evRight">
          <Link className="topLink" to="/events">
            All events
          </Link>
          <ProfileMenu user={user} />
        </div>
      </header>

      <main className="pfMain">
        <section className="pfCard">
          <h2 className="pfH2">Your details</h2>

          {message ? (
            <div className={`pfBanner ${message.type === 'ok' ? 'pfOk' : 'pfErr'}`}>
              {message.text}
            </div>
          ) : null}

          <form className="pfForm" onSubmit={save} noValidate>
            <div className="pfField">
              <label htmlFor="email">Email (from signup)</label>
              <input id="email" value={user?.email || ''} disabled />
            </div>

            <div className="pfField">
              <label htmlFor="name">Name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="pfField">
              <label htmlFor="dept">Department</label>
              <select
                id="dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="pfActions">
              <button className="pfBtn" type="submit">
                Save changes
              </button>
              <Link className="pfBtnGhost" to="/history">
                View booking history
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

