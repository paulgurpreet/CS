// routes/notifications.js
const express = require("express");
const db = require("../db");
const { requireAuth } = require("./auth");

const router = express.Router();

// GET /api/notifications - notifications for the logged-in user (FR4)
router.get("/", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.session.userId);
  res.json(rows);
});

// POST /api/notifications/:id/read - mark one as read
router.post("/:id/read", requireAuth, (req, res) => {
  db.prepare("UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?").run(
    req.params.id,
    req.session.userId
  );
  res.json({ ok: true });
});

module.exports = router;
