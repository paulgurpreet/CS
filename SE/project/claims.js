// routes/claims.js
const express = require("express");
const db = require("../db");
const { requireAuth } = require("./auth");

const router = express.Router();

// POST /api/claims - raise a claim on ANY active item that isn't your own (FR5).
// A claim means two different things depending on the item's type, but the
// workflow (and the admin verification step) is identical either way:
//   - On a "found" item: "this belongs to me, I lost it"
//   - On a "lost" item:  "I found this item, here's my info"
router.post("/", requireAuth, (req, res) => {
  const { item_id, message } = req.body;
  const item = db.prepare("SELECT * FROM items WHERE item_id = ?").get(item_id);
  if (!item) return res.status(404).json({ error: "Item not found." });
  if (item.status === "Claimed") {
    return res.status(400).json({ error: "This item has already been resolved and claimed." });
  }
  if (item.user_id === req.session.userId) {
    return res.status(400).json({ error: "You cannot raise a claim on your own listing." });
  }
  const existing = db
    .prepare("SELECT 1 FROM claims WHERE item_id = ? AND claimant_id = ? AND status = 'Pending'")
    .get(item_id, req.session.userId);
  if (existing) {
    return res.status(409).json({ error: "You already have a pending claim on this item." });
  }

  const info = db
    .prepare("INSERT INTO claims (item_id, claimant_id, message) VALUES (?, ?, ?)")
    .run(item_id, req.session.userId, message || "");

  res.status(201).json(db.prepare("SELECT * FROM claims WHERE claim_id = ?").get(info.lastInsertRowid));
});

// GET /api/claims/mine - claims raised by the logged-in user, with the other
// party's contact details attached once the claim has been approved so the
// two people can arrange the handover (only visible after admin approval).
router.get("/mine", requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT claims.*, items.title, items.category, items.type,
              owner.name AS owner_name, owner.email AS owner_email, owner.contact_no AS owner_contact
       FROM claims
       JOIN items ON items.item_id = claims.item_id
       JOIN users owner ON owner.user_id = items.user_id
       WHERE claims.claimant_id = ? ORDER BY claims.date_requested DESC`
    )
    .all(req.session.userId);

  // Only reveal the owner's contact info once the claim is approved.
  const shaped = rows.map((r) => ({
    ...r,
    owner_name: r.status === "Approved" ? r.owner_name : undefined,
    owner_email: r.status === "Approved" ? r.owner_email : undefined,
    owner_contact: r.status === "Approved" ? r.owner_contact : undefined,
  }));
  res.json(shaped);
});

module.exports = router;
