// routes/items.js
const express = require("express");
const db = require("../db");
const { requireAuth } = require("./auth");

const router = express.Router();

// Very simple "matching" logic (FR4): when a new item is reported, look for
// opposite-type items in the same category whose description shares at
// least one significant word. If found, create a notification for the
// other person and mark both items as "Matched".
function checkForMatches(newItem) {
  const oppositeType = newItem.type === "lost" ? "found" : "lost";
  const candidates = db
    .prepare(
      `SELECT * FROM items WHERE type = ? AND category = ? AND status = 'Pending' AND item_id != ?`
    )
    .all(oppositeType, newItem.category, newItem.item_id);

  const newWords = new Set(
    (newItem.description || "").toLowerCase().split(/\W+/).filter((w) => w.length > 3)
  );

  for (const candidate of candidates) {
    const candWords = (candidate.description || "").toLowerCase().split(/\W+/).filter((w) => w.length > 3);
    const overlap = candWords.some((w) => newWords.has(w));
    if (overlap || newWords.size === 0) {
      // Mark both as matched
      db.prepare("UPDATE items SET status = 'Matched' WHERE item_id IN (?, ?)").run(
        newItem.item_id,
        candidate.item_id
      );
      // Notify both owners
      const notify = db.prepare(
        "INSERT INTO notifications (user_id, item_id, message) VALUES (?, ?, ?)"
      );
      notify.run(
        candidate.user_id,
        candidate.item_id,
        `A possible match was found for your ${candidate.type} item "${candidate.title}".`
      );
      notify.run(
        newItem.user_id,
        newItem.item_id,
        `A possible match was found for your ${newItem.type} item "${newItem.title}".`
      );
      break; // one match is enough for this simple version
    }
  }
}

// GET /api/items?type=&category=&location=&q=
// Public browsing/search - anyone can search, no login required (FR3)
router.get("/", (req, res) => {
  const { type, category, location, q } = req.query;
  let sql = `SELECT items.*, users.name AS reporter_name
             FROM items JOIN users ON users.user_id = items.user_id
             WHERE 1=1`;
  const params = [];

  if (type) { sql += " AND items.type = ?"; params.push(type); }
  if (category) { sql += " AND items.category = ?"; params.push(category); }
  if (location) { sql += " AND items.location LIKE ?"; params.push(`%${location}%`); }
  if (q) { sql += " AND (items.title LIKE ? OR items.description LIKE ?)"; params.push(`%${q}%`, `%${q}%`); }

  sql += " ORDER BY items.created_at DESC";
  const rows = db.prepare(sql).all(...params);
  res.json(rows);
});

// GET /api/items/categories - distinct category list for the filter dropdown
router.get("/categories", (req, res) => {
  const rows = db.prepare("SELECT DISTINCT category FROM items ORDER BY category").all();
  const defaults = ["Electronics", "ID Card", "Bag", "Bottle", "Books", "Keys", "Clothing", "Other"];
  const set = new Set([...defaults, ...rows.map((r) => r.category)]);
  res.json([...set]);
});

// GET /api/items/mine - items reported by the logged-in user, with status (FR10)
router.get("/mine", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.session.userId);
  res.json(rows);
});

// GET /api/items/:id
router.get("/:id", (req, res) => {
  const row = db
    .prepare(
      `SELECT items.*, users.name AS reporter_name, users.contact_no AS reporter_contact
       FROM items JOIN users ON users.user_id = items.user_id WHERE item_id = ?`
    )
    .get(req.params.id);
  if (!row) return res.status(404).json({ error: "Item not found." });
  res.json(row);
});

// POST /api/items - report a lost or found item (FR1, FR2)
router.post("/", requireAuth, (req, res) => {
  const { type, title, category, description, location, date_reported } = req.body;
  if (!["lost", "found"].includes(type) || !title || !category || !date_reported) {
    return res.status(400).json({ error: "type, title, category and date_reported are required." });
  }
  const info = db
    .prepare(
      `INSERT INTO items (user_id, type, title, category, description, location, date_reported)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(req.session.userId, type, title, category, description || "", location || "", date_reported);

  const newItem = db.prepare("SELECT * FROM items WHERE item_id = ?").get(info.lastInsertRowid);
  checkForMatches(newItem);
  res.status(201).json(newItem);
});

// DELETE /api/items/:id - owner can withdraw their own report
router.delete("/:id", requireAuth, (req, res) => {
  const item = db.prepare("SELECT * FROM items WHERE item_id = ?").get(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found." });
  if (item.user_id !== req.session.userId) {
    return res.status(403).json({ error: "You can only delete your own reports." });
  }
  db.prepare("DELETE FROM items WHERE item_id = ?").run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
