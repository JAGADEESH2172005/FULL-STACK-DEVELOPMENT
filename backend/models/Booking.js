const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping frontend UUID for now
  userId: { type: String, required: true },
  userName: { type: String },
  userEmail: { type: String },
  universityName: { type: String },
  eventId: { type: String, required: true }, // The string ID from Event model
  eventName: { type: String },
  eventDepartmentCode: { type: String },
  ticketPrice: { type: Number },
  name: { type: String }, // Booking specific name (could be different from user)
  email: { type: String },
  department: { type: String },
  ticketsBooked: { type: Number, required: true },
  totalAmount: { type: Number },
  bookedAt: { type: String }, // ISO string
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
