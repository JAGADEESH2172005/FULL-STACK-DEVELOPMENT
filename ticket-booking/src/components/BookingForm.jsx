import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './BookingForm.css'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function toPositiveInt(value) {
  const n = Number.parseInt(String(value), 10)
  if (!Number.isFinite(n)) return null
  if (n <= 0) return null
  return n
}

export default function BookingForm({
  event,
  availableTickets,
  onBook,
  lastBooking,
  departments = [],
  defaultDepartment = '',
  nextBookingId = null,
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState(defaultDepartment || '')
  const [ticketsRequired, setTicketsRequired] = useState('1')
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState(null)

  const isSoldOut = availableTickets <= 0

  useEffect(() => {
    setDepartment(defaultDepartment || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDepartment])

  const maxForInput = useMemo(() => {
    const max = Math.min(event.maxTicketsPerBooking, Math.max(availableTickets, 1))
    return max
  }, [availableTickets, event.maxTicketsPerBooking])

  function validate() {
    const nextErrors = {}

    if (!name.trim()) nextErrors.name = 'Name is required.'
    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.'
    if (!department.trim()) nextErrors.department = 'Department is required.'

    const qty = toPositiveInt(ticketsRequired)
    if (qty == null) nextErrors.ticketsRequired = 'Enter a positive number of tickets.'
    else if (qty > event.maxTicketsPerBooking) {
      nextErrors.ticketsRequired = `You can book up to ${event.maxTicketsPerBooking} tickets per booking.`
    } else if (qty > availableTickets) {
      nextErrors.ticketsRequired = `Only ${availableTickets} tickets are available right now.`
    }

    return { nextErrors, qty }
  }

  function resetForm() {
    setName('')
    setEmail('')
    setDepartment(defaultDepartment || '')
    setTicketsRequired('1')
    setErrors({})
    setFormMessage(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setFormMessage(null)

    if (isSoldOut) {
      setFormMessage({ type: 'error', text: 'Sorry—this event is sold out.' })
      return
    }

    const { nextErrors, qty } = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setFormMessage({ type: 'error', text: 'Please fix the highlighted fields.' })
      return
    }

    const result = onBook({
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      ticketsBooked: qty,
    })

    if (!result?.ok) {
      setFormMessage({
        type: 'error',
        text: result?.message || 'Unable to complete booking. Please try again.',
      })
      return
    }

    setFormMessage({ type: 'success', text: 'Booking confirmed. See summary below.' })
  }

  return (
    <section className="card">
      <header className="cardHeader2">
        <div>
          <p className="eyebrow">Ticket booking</p>
          <h2 className="h2">Book your tickets</h2>
        </div>
        <button type="button" className="btn btnGhost" onClick={resetForm}>
          Reset
        </button>
      </header>

      {formMessage ? (
        <div
          className={`banner ${
            formMessage.type === 'success' ? 'bannerSuccess' : 'bannerError'
          }`}
          role="status"
        >
          {formMessage.text}
        </div>
      ) : null}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="error">{errors.name}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="email">Email ID</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            inputMode="email"
            placeholder="name@domain.com"
          />
          {errors.email ? <p className="error">{errors.email}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="dept">Department</label>
          <select
            id="dept"
            className="select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            aria-invalid={Boolean(errors.department)}
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.department ? <p className="error">{errors.department}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="tickets">Number of tickets</label>
          <input
            id="tickets"
            value={ticketsRequired}
            onChange={(e) => setTicketsRequired(e.target.value)}
            aria-invalid={Boolean(errors.ticketsRequired)}
            inputMode="numeric"
            min={1}
            max={maxForInput}
          />
          <p className="hint">
            Available: <strong>{availableTickets}</strong> • Max per booking:{' '}
            <strong>{event.maxTicketsPerBooking}</strong>
          </p>
          {errors.ticketsRequired ? (
            <p className="error">{errors.ticketsRequired}</p>
          ) : null}
        </div>

        <div className="actions">
          <button className="btn btnPrimary" type="submit" disabled={isSoldOut}>
            {isSoldOut ? 'Sold out' : 'Confirm booking'}
          </button>
        </div>
      </form>

      {lastBooking ? (
        <div className="summary">
          <h3 className="h3">Booking summary</h3>
          <dl className="summaryGrid">
            <div>
              <dt>User name</dt>
              <dd>{lastBooking.name}</dd>
            </div>
            <div>
              <dt>Event name</dt>
              <dd>{event.name}</dd>
            </div>
            <div>
              <dt>Tickets booked</dt>
              <dd>{lastBooking.ticketsBooked}</dd>
            </div>
            <div>
              <dt>Total amount</dt>
              <dd>₹{lastBooking.totalAmount.toFixed(2)}</dd>
            </div>
          </dl>
          {nextBookingId ? (
            <div className="nextWrap">
              <Link className="btn btnPrimary" to={`/confirmation/${nextBookingId}`}>
                Next
              </Link>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="summaryEmpty">
          <p className="muted">
            After a successful booking, your confirmation summary will appear here.
          </p>
        </div>
      )}
    </section>
  )
}

