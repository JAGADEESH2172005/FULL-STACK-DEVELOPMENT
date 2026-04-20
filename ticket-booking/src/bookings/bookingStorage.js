const API_URL = 'http://localhost:5000/api';

export async function getAllBookings() {
  try {
    const res = await fetch(`${API_URL}/bookings`);
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function getBookingsForUser(userId) {
  try {
    const res = await fetch(`${API_URL}/bookings?userId=${userId}`);
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function getBookingById(id) {
  try {
    const res = await fetch(`${API_URL}/bookings/${id}`);
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function addBooking(booking) {
  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    return await res.json();
  } catch (error) {
    return { ok: false, message: error.message };
  }
}
