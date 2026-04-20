const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, department, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!String(name || '').trim()) return res.json({ ok: false, message: 'Name is required.' });
    if (!String(department || '').trim()) return res.json({ ok: false, message: 'Department is required.' });
    if (!String(email || '').trim()) return res.json({ ok: false, message: 'Email is required.' });
    if (!isValidEmail(cleanEmail)) return res.json({ ok: false, message: 'Enter a valid email.' });
    if (!String(password || '').trim() || String(password).length < 6) {
      return res.json({ ok: false, message: 'Password must be at least 6 characters.' });
    }

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) return res.json({ ok: false, message: 'An account with this email already exists.' });

    const user = new User({
      id: crypto.randomUUID(),
      name: String(name).trim(),
      email: cleanEmail,
      department: String(department).trim(),
      password: String(password) // Note: Production should hash this
    });

    await user.save();
    res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, department: user.department } });
  } catch (error) {
    res.json({ ok: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!String(email || '').trim()) return res.json({ ok: false, message: 'Email is required.' });
    if (!isValidEmail(cleanEmail)) return res.json({ ok: false, message: 'Enter a valid email.' });
    if (!String(password || '').trim()) return res.json({ ok: false, message: 'Password is required.' });

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.json({ ok: false, message: 'No account found for this email.' });
    if (user.password !== String(password)) { // Plain text check for assignment
      return res.json({ ok: false, message: 'Incorrect password.' });
    }

    res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, department: user.department } });
  } catch (error) {
    res.json({ ok: false, message: error.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const { userId } = req.query; // Send from frontend session
    if (!userId) return res.json({ ok: false });
    
    const user = await User.findOne({ id: userId });
    if (!user) return res.json({ ok: false });
    
    res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, department: user.department } });
  } catch (error) {
    res.json({ ok: false });
  }
});

router.put('/update', async (req, res) => {
  try {
    const { userId, patch } = req.body;
    if (!userId) return res.json({ ok: false, message: 'Not logged in.' });

    const user = await User.findOne({ id: userId });
    if (!user) return res.json({ ok: false, message: 'User not found.' });

    const newName = patch?.name != null ? String(patch.name).trim() : user.name;
    const newDept = patch?.department != null ? String(patch.department).trim() : user.department;

    if (!newName) return res.json({ ok: false, message: 'Name is required.' });
    if (!newDept) return res.json({ ok: false, message: 'Department is required.' });

    user.name = newName;
    user.department = newDept;
    await user.save();

    res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, department: user.department } });
  } catch (error) {
    res.json({ ok: false, message: error.message });
  }
});

module.exports = router;
