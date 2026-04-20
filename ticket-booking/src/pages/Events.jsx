import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../auth/authStorage.js'
import ProfileMenu from '../components/ProfileMenu.jsx'
import { UNIVERSITY_NAME } from '../config/appConfig.js'
import { EVENTS, getDepartments } from '../data/events.js'
import './Events.css'

function formatDateTime(isoOrLocal) {
  const date = new Date(isoOrLocal)
  if (Number.isNaN(date.getTime())) return isoOrLocal

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function readAvailability(eventId, totalTickets) {
  try {
    const raw = localStorage.getItem(`event:${eventId}:state`)
    if (!raw) return totalTickets
    const parsed = JSON.parse(raw)
    if (
      typeof parsed?.availableTickets === 'number' &&
      parsed.availableTickets >= 0 &&
      parsed.availableTickets <= totalTickets
    ) {
      return parsed.availableTickets
    }
    return totalTickets
  } catch {
    return totalTickets
  }
}

export default function EventsPage() {
  const [user, setUser] = useState(null)
  const departments = useMemo(() => getDepartments(EVENTS), [])
  const [dept, setDept] = useState('ALL')

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const visibleEvents = useMemo(() => {
    if (dept === 'ALL') return EVENTS
    return EVENTS.filter((e) => e.departmentCode === dept)
  }, [dept])

  return (
    <div className="evWrap">
      <header className="evTop">
        <div className="evBrand">
          <div className="evMark" aria-hidden="true" />
          <div>
            <p className="evTitle">All events</p>
            <p className="evSub">
              {UNIVERSITY_NAME} • Select a department and book tickets
            </p>
          </div>
        </div>

        <div className="evRight">
          <Link className="topLink" to="/">
            Home
          </Link>
          <ProfileMenu user={user} />
        </div>
      </header>

      <section className="evFilters">
        <div className="evFilterCard">
          <label className="evLabel" htmlFor="dept">
            Department
          </label>
          <select
            id="dept"
            className="evSelect"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          >
            <option value="ALL">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </section>

      <main className="evGrid">
        {visibleEvents.map((event) => {
          const available = readAvailability(event.id, event.totalTickets)
          const soldOut = available <= 0
          return (
            <article key={event.id} className="evCard">
              <div className="evCardTop">
                <p className="evTag">{event.category}</p>
                <span className={`evPill ${soldOut ? 'evPillSold' : 'evPillOk'}`}>
                  {soldOut ? 'Sold out' : `${available} left`}
                </span>
              </div>
              <h2 className="evH2">{event.name}</h2>
              <p className="evMeta">
                <span>{event.departmentCode}</span> • <span>{event.venue}</span>
              </p>
              <p className="evMeta">{formatDateTime(event.dateTime)}</p>
              <p className="evPrice">₹{event.ticketPrice.toFixed(2)}</p>

              <div className="evActions">
                <Link className="evBtn" to={`/events/${event.id}`}>
                  View details
                </Link>
                <Link className="evBtnGhost" to={`/events/${event.id}`}>
                  Book now
                </Link>
              </div>
            </article>
          )
        })}
      </main>

      <footer className="evFooter">
        <p className="evFootP">
          Reference inspiration: [`ticket-booking-fsad-v1`](https://ticket-booking-fsad-v1.web.app/)
        </p>
      </footer>
    </div>
  )
}

