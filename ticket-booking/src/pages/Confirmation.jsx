import { Link, Navigate, useParams } from 'react-router-dom'
import { getBookingById } from '../bookings/bookingStorage.js'
import './Confirmation.css'

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

export default function ConfirmationPage() {
  const { bookingId } = useParams()
  const booking = getBookingById(bookingId)

  if (!booking) return <Navigate to="/events" replace />

  return (
    <div className="cfWrap">
      <header className="cfTop">
        <div>
          <p className="cfEyebrow">Ticket confirmed</p>
          <h1 className="cfH1">Your booking is successful</h1>
          <p className="cfSub">
            {booking.universityName ? `${booking.universityName} • ` : ''}
            Save this page as proof. You can also find it in History.
          </p>
        </div>
        <Link className="cfBack" to="/history">
          View history
        </Link>
      </header>

      <main className="cfGrid">
        <section className="cfTicket">
          <div className="cfTicketGlow" aria-hidden="true" />
          <div className="cfTicketInner">
            <div className="cfTicketTop">
              <div>
                <p className="cfLabel">Event</p>
                <p className="cfValue">{booking.eventName}</p>
              </div>
              <span className="cfBadge">{booking.eventDepartmentCode}</span>
            </div>

            <div className="cfDivider" aria-hidden="true" />

            <div className="cfRows">
              <div className="cfRow">
                <p className="cfLabel">Name</p>
                <p className="cfValue">{booking.name}</p>
              </div>
              <div className="cfRow">
                <p className="cfLabel">Department</p>
                <p className="cfValue">{booking.department}</p>
              </div>
              <div className="cfRow">
                <p className="cfLabel">Booked at</p>
                <p className="cfValue">{formatDateTime(booking.bookedAt)}</p>
              </div>
              <div className="cfRow">
                <p className="cfLabel">Tickets</p>
                <p className="cfValue">{booking.ticketsBooked}</p>
              </div>
              <div className="cfRow">
                <p className="cfLabel">Total amount</p>
                <p className="cfValue">₹{Number(booking.totalAmount).toFixed(2)}</p>
              </div>
            </div>

            <div className="cfTicketBottom">
              <p className="cfIdLabel">Booking ID</p>
              <p className="cfId">{booking.id}</p>
            </div>
          </div>
        </section>

        <section className="cfActions">
          <div className="cfActionCard">
            <h2 className="cfH2">Next steps</h2>
            <ul className="cfList">
              <li>Go to History to view all your bookings</li>
              <li>Book another event from All Events</li>
              <li>Keep your Booking ID for reference</li>
            </ul>
            <div className="cfButtons">
              <Link className="cfBtn" to="/events">
                Book another event
              </Link>
              <Link className="cfBtnGhost" to={`/events/${booking.eventId}`}>
                Back to event
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

