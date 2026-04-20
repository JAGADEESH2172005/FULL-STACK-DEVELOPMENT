const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping string ID for backward compatibility
  name: { type: String, required: true },
  description: { type: String },
  totalTickets: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
  ticketPrice: { type: Number, required: true },
  departmentCode: { type: String, required: true },
  departmentName: { type: String },
  category: { type: String },
  venue: { type: String },
  dateTime: { type: String }, // ISO string
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
