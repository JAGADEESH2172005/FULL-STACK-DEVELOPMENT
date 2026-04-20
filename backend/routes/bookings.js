const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const crypto = require('crypto');

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      const allBookings = await Booking.find({}).sort({ createdAt: -1 });
      return res.json(allBookings);
    }
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { 
      userId, userName, userEmail, universityName, 
      eventId, eventName, eventDepartmentCode, ticketPrice, 
      name, email, department, ticketsBooked, totalAmount, bookedAt 
    } = req.body;

    const event = await Event.findOne({ id: eventId });
    if (!event) return res.json({ ok: false, message: 'Event not found.' });

    if (!Number.isFinite(ticketsBooked) || ticketsBooked <= 0) {
      return res.json({ ok: false, message: 'Invalid ticket quantity.' });
    }
    if (ticketsBooked > event.availableTickets) {
      return res.json({ ok: false, message: `Only ${event.availableTickets} tickets are available.` });
    }

    event.availableTickets -= ticketsBooked;
    await event.save();

    const booking = new Booking({
      id: crypto.randomUUID(),
      userId, userName, userEmail, universityName,
      eventId, eventName, eventDepartmentCode, ticketPrice,
      name, email, department, ticketsBooked, totalAmount, bookedAt
    });

    await booking.save();
    res.json({ ok: true, id: booking.id, booking });
  } catch (error) {
    res.json({ ok: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ id: req.params.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
