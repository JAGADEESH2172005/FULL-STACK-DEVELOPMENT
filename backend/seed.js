const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Event = require('./models/Event');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ticket-booking';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Read the events.js file
    const eventsPath = path.join(__dirname, '../ticket-booking/src/data/events.js');
    const content = fs.readFileSync(eventsPath, 'utf8');

    // Extract the array using simple regex/eval (safe since it's local trusted data)
    const arrayMatch = content.match(/export const EVENTS = (\[[\s\S]*?\])\s*export/);
    if (!arrayMatch) throw new Error('Could not parse events data');

    let evalString = arrayMatch[1];
    // Evaluate to get real JS object
    const rawEvents = eval(`(${evalString})`);

    // Add availableTickets dynamically
    const eventsToInsert = rawEvents.map(e => ({
      ...e,
      availableTickets: e.totalTickets
    }));

    await Event.deleteMany({}); // clear existing
    await Event.insertMany(eventsToInsert);
    
    console.log(`Seeded ${eventsToInsert.length} events successfully.`);
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
