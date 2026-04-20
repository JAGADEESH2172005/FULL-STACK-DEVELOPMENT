const SESSION_KEY = 'tb:session'

function safeParse(raw, fallback) {
  try {
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function getSession() {
  return safeParse(localStorage.getItem(SESSION_KEY), null)
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

const API_URL = 'http://localhost:5000/api';

export async function signUp({ name, email, department, password }) {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, department, password })
    });
    const data = await res.json();
    if (data.ok) {
      setSession({ userId: data.user.id, email: data.user.email, name: data.user.name, department: data.user.department });
    }
    return data;
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

export async function login({ email, password }) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.ok) {
      setSession({ userId: data.user.id, email: data.user.email, name: data.user.name, department: data.user.department });
    }
    return data;
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

// Keeping this sync relies on local token session tracking
export function getCurrentUser() {
  const session = getSession()
  if (!session?.userId) return null
  return { id: session.userId, ...session }
}

export async function updateCurrentUser(patch) {
  try {
    const session = getSession()
    if (!session?.userId) return { ok: false, message: 'Not logged in.' }

    const res = await fetch(`${API_URL}/auth/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.userId, patch })
    });
    const data = await res.json();

    if (data.ok && data.user) {
      setSession({ userId: data.user.id, email: data.user.email, name: data.user.name, department: data.user.department });
    }
    return data;
  } catch (error) {
    return { ok: false, message: error.message };
  }
}
