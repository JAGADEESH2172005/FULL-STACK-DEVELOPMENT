import './EventDetails.css'

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

export default function EventDetails({ event, availableTickets }) {
  return (
    <section className="card">
      <header className="cardHeader">
        <div>
          <p className="eyebrow">Event details</p>
          <h1 className="title">{event.name}</h1>
          <p className="subtitle">{event.departmentName}</p>
        </div>
        <span
          className={`pill ${availableTickets > 0 ? 'pillOk' : 'pillSoldOut'}`}
        >
          {availableTickets > 0 ? `${availableTickets} tickets left` : 'Sold out'}
        </span>
      </header>

      <dl className="detailsGrid">
        <div className="detail">
          <dt>Date & time</dt>
          <dd>{formatDateTime(event.dateTime)}</dd>
        </div>
        <div className="detail">
          <dt>Venue</dt>
          <dd>{event.venue}</dd>
        </div>
        <div className="detail">
          <dt>Ticket price</dt>
          <dd>
            ₹{event.ticketPrice.toFixed(2)} <span className="muted">/ ticket</span>
          </dd>
        </div>
        <div className="detail">
          <dt>Max booking</dt>
          <dd>{event.maxTicketsPerBooking} tickets per user</dd>
        </div>
      </dl>
    </section>
  )
}

