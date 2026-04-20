import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BookingForm from '../components/BookingForm.jsx'
import EventDetails from '../components/EventDetails.jsx'
import { getCurrentUser } from '../auth/authStorage.js'
import { addBooking } from '../bookings/bookingStorage.js'
import ProfileMenu from '../components/ProfileMenu.jsx'
import { UNIVERSITY_NAME } from '../config/appConfig.js'
import { getDepartments, getEventById, EVENTS } from '../data/events.js'
import './EventDetailsBooking.css'

export default function EventDetailsBookingPage() {
  const { eventId } = useParams()

  const event = useMemo(() => getEventById(eventId), [eventId])
  const departments = useMemo(() => getDepartments(EVENTS), [])
  const [availableTickets, setAvailableTickets] = useState(event?.totalTickets ?? 0)
  const [lastBooking, setLastBooking] = useState(null)
  const [lastBookingId, setLastBookingId] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  useEffect(() => {
    if (!event) return
    try {
      const raw = localStorage.getItem(`event:${event.id}:state`)
      if (!raw) {
        setAvailableTickets(event.totalTickets)
        setLastBooking(null)
        return
      }
      const parsed = JSON.parse(raw)
      if (
        typeof parsed?.availableTickets === 'number' &&
        parsed.availableTickets >= 0 &&
        parsed.availableTickets <= event.totalTickets
      ) {
        setAvailableTickets(parsed.availableTickets)
      } else {
        setAvailableTickets(event.totalTickets)
      }
      if (parsed?.lastBooking && typeof parsed.lastBooking === 'object') {
        setLastBooking(parsed.lastBooking)
      } else {
        setLastBooking(null)
      }
      if (typeof parsed?.lastBookingId === 'string') {
        setLastBookingId(parsed.lastBookingId)
      } else {
        setLastBookingId(null)
      }
    } catch {
      setAvailableTickets(event.totalTickets)
      setLastBooking(null)
      setLastBookingId(null)
    }
  }, [event])

  useEffect(() => {
    if (!event) return
    try {
      localStorage.setItem(
        `event:${event.id}:state`,
        JSON.stringify({ availableTickets, lastBooking, lastBookingId }),
      )
    } catch {
      // ignore
    }
  }, [availableTickets, event, lastBooking, lastBookingId])

  function handleBook({ name, email, department, ticketsBooked }) {
    if (!Number.isFinite(ticketsBooked) || ticketsBooked <= 0) {
      return { ok: false, message: 'Invalid ticket quantity.' }
    }
    if (ticketsBooked > availableTickets) {
      return { ok: false, message: `Only ${availableTickets} tickets are available.` }
    }

    const nextAvailable = availableTickets - ticketsBooked
    setAvailableTickets(nextAvailable)
    const bookingPayload = {
      name,
      email,
      department,
      ticketsBooked,
      totalAmount: ticketsBooked * event.ticketPrice,
      bookedAt: new Date().toISOString(),
    }
    setLastBooking(bookingPayload)

    if (user?.id) {
      addBooking({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        universityName: UNIVERSITY_NAME,
        eventId: event.id,
        eventName: event.name,
        eventDepartmentCode: event.departmentCode,
        ticketPrice: event.ticketPrice,
        ...bookingPayload,
      }).then((record) => {
        if (record.ok) setLastBookingId(record.id)
      })
    }
    return { ok: true }
  }

  if (!event) return <Navigate to="/events" replace />

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div>
            <p className="brandTitle">{event.name}</p>
            <p className="brandSub">
              {UNIVERSITY_NAME} • {event.departmentName} • View details and book
              tickets
            </p>
          </div>
        </div>

        <div className="topbarRight">
          <Link className="topLink" to="/events">
            All events
          </Link>
          <ProfileMenu user={user} />
        </div>
      </header>

      <main className="layout">
        <section className="stack">
          <EventDetails event={event} availableTickets={availableTickets} />
          <section className="card">
            <p className="evDescTitle">About this event</p>
            <p className="evDesc">{event.description}</p>
          </section>
        </section>

        <BookingForm
          event={event}
          availableTickets={availableTickets}
          onBook={handleBook}
          lastBooking={lastBooking}
          departments={departments}
          defaultDepartment={user?.department || ''}
          nextBookingId={lastBookingId}
        />
      </main>
    </div>
  )
}

