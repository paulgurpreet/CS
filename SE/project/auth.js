// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// Middleware: require a logged-in user
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: "Please log in first." });
  next();
}

// Middleware: require an admin
function requireAdmin(req, res, next) {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.status(403).json({ error: "Admin access only." });
  }
  next();
}

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password, role, contact_no } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  if (contact_no && !/^\d{10}$/.test(contact_no)) {
    return res.status(400).json({ error: "Contact number must be exactly 10 digits." });
  }
  const existing = db.prepare("SELECT 1 FROM users WHERE email = ?").get(email);
  if (existing) return res.status(409).json({ error: "An account with this email already exists." });

  const hash = bcrypt.hashSync(password, 10);
  const safeRole = role === "staff" ? "staff" : "student"; // never let the client register as admin
  const info = db
    .prepare("INSERT INTO users (name, email, password_hash, role, contact_no) VALUES (?, ?, ?, ?, ?)")
    .run(name, email, hash, safeRole, contact_no || null);

  req.session.userId = info.lastInsertRowid;
  req.session.role = safeRole;
  req.session.name = name;
  res.json({ user_id: info.lastInsertRowid, name, email, role: safeRole });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  req.session.userId = user.user_id;
  req.session.role = user.role;
  req.session.name = user.name;
  res.json({ user_id: user.user_id, name: user.name, email: user.email, role: user.role });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  res.json({ user: { user_id: req.session.userId, name: req.session.name, role: req.session.role } });
});

module.exports = { router, requireAuth, requireAdmin };
