// db.js
// Sets up the SQLite database and creates all tables if they don't exist yet.
// SQLite is used here (instead of MySQL) so the project runs instantly with
// zero setup - just `npm install && npm start`. Swap this file for a MySQL
// connection later if your course specifically requires MySQL.

// Uses Node's built-in SQLite module (node:sqlite) instead of the
// better-sqlite3 npm package. This needs Node 22.5+ and, unlike
// better-sqlite3, requires NO native/C++ compilation - so it just works
// on Windows without Visual Studio Build Tools or a Windows SDK.
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const db = new DatabaseSync(path.join(__dirname, "lostfound.db"));
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  user_id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student',   -- 'student' | 'staff' | 'admin'
  contact_no    TEXT,
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS items (
  item_id       INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  type          TEXT NOT NULL,                     -- 'lost' | 'found'
  title         TEXT NOT NULL,
  category      TEXT NOT NULL,
  description   TEXT,
  location      TEXT,
  date_reported TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'Pending',    -- 'Pending' | 'Matched' | 'Claimed'
  created_at    TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS claims (
  claim_id       INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id        INTEGER NOT NULL,
  claimant_id    INTEGER NOT NULL,
  status         TEXT NOT NULL DEFAULT 'Pending',   -- 'Pending' | 'Approved' | 'Rejected'
  message        TEXT,
  date_requested TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
  FOREIGN KEY (claimant_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL,
  item_id          INTEGER,
  message          TEXT NOT NULL,
  is_read          INTEGER NOT NULL DEFAULT 0,
  created_at       TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);
`);

// Seed one admin account on first run so there is always a way to log in
// as admin (email: admin@campus.edu / password: admin123).
const bcrypt = require("bcryptjs");
const adminExists = db.prepare("SELECT 1 FROM users WHERE role = 'admin' LIMIT 1").get();
if (!adminExists) {
  const hash = bcrypt.hashSync("admin123", 10);
  db.prepare(
    "INSERT INTO users (name, email, password_hash, role, contact_no) VALUES (?, ?, ?, 'admin', ?)"
  ).run("Admin", "admin@campus.edu", hash, "0000000000");
  console.log("Seeded default admin -> email: admin@campus.edu | password: admin123");
}

module.exports = db;
