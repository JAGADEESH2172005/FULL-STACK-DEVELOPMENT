import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../auth/authStorage.js'
import { getAllBookings, getBookingsForUser } from '../bookings/bookingStorage.js'
import ProfileMenu from '../components/ProfileMenu.jsx'
import './History.css'

function formatDateTime(isoOrLocal) {
  const date = new Date(isoOrLocal)
  if (Number.isNaN(date.getTime())) return isoOrLocal

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function HistoryPage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const [myBookings, setMyBookings] = useState([])
  const [allBookings, setAllBookings] = useState([])

  useEffect(() => {
    if (!user?.id) return
    getBookingsForUser(user.id).then(setMyBookings)
  }, [user?.id])

  useEffect(() => {
    getAllBookings().then(setAllBookings)
  }, [])


  return (
    <div className="hisWrap">
      <header className="evTop">
        <div className="evBrand">
          <div className="evMark" aria-hidden="true" />
          <div>
            <p className="evTitle">Booking history</p>
            <p className="evSub">Your bookings + all bookings</p>
          </div>
        </div>

        <div className="evRight">
          <Link className="topLink" to="/events">
            All events
          </Link>
          <ProfileMenu user={user} />
        </div>
      </header>

      <main className="hisMain">
        <section className="hisSection">
          <div className="hisHead">
            <h2 className="hisH2">My bookings</h2>
            <p className="hisMeta">{myBookings.length} record(s)</p>
          </div>
          {myBookings.length === 0 ? (
            <div className="hisEmpty">
              <p className="hisMuted">No bookings yet. Book an event to see it here.</p>
            </div>
          ) : (
            <div className="hisTable">
              <div className="hisRow hisRowHead">
                <div>Date</div>
                <div>Event</div>
                <div>Tickets</div>
                <div>Total</div>
              </div>
              {myBookings.map((b) => (
                <div key={b.id} className="hisRow">
                  <div>{formatDateTime(b.bookedAt)}</div>
                  <div className="hisStrong">{b.eventName}</div>
                  <div>{b.ticketsBooked}</div>
                  <div>₹{Number(b.totalAmount).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="hisSection">
          <div className="hisHead">
            <h2 className="hisH2">All bookings</h2>
            <p className="hisMeta">{allBookings.length} record(s)</p>
          </div>
          {allBookings.length === 0 ? (
            <div className="hisEmpty">
              <p className="hisMuted">No bookings have been made yet.</p>
            </div>
          ) : (
            <div className="hisTable">
              <div className="hisRow hisRowHead hisRowAll">
                <div>Date</div>
                <div>User</div>
                <div>Event</div>
                <div>Tickets</div>
                <div>Total</div>
              </div>
              {allBookings.map((b) => (
                <div key={b.id} className="hisRow hisRowAll">
                  <div>{formatDateTime(b.bookedAt)}</div>
                  <div>
                    <div className="hisStrong">{b.userName}</div>
                    <div className="hisMutedSmall">{b.universityName || ''}</div>
                  </div>
                  <div className="hisStrong">{b.eventName}</div>
                  <div>{b.ticketsBooked}</div>
                  <div>₹{Number(b.totalAmount).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

