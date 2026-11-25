// routes/admin.js
const express = require("express");
const db = require("../db");
const { requireAdmin } = require("./auth");

const router = express.Router();
router.use(requireAdmin);

// GET /api/admin/claims - all claims, pending first (for admin verification, FR6)
router.get("/claims", (req, res) => {
  const rows = db
    .prepare(
      `SELECT claims.*, items.title, items.category, items.type, items.user_id AS owner_id,
              claimant.name AS claimant_name, claimant.email AS claimant_email,
              claimant.contact_no AS claimant_contact,
              owner.name AS owner_name, owner.email AS owner_email
       FROM claims
       JOIN items ON items.item_id = claims.item_id
       JOIN users claimant ON claimant.user_id = claims.claimant_id
       JOIN users owner ON owner.user_id = items.user_id
       ORDER BY (claims.status = 'Pending') DESC, claims.date_requested DESC`
    )
    .all();
  res.json(rows);
});

// POST /api/admin/claims/:id/approve
// Approving a claim resolves the item and notifies BOTH sides with each
// other's contact details, regardless of whether the item was originally
// posted as "lost" or "found" - either way, one person now needs to reach
// the other to hand the item over.
router.post("/claims/:id/approve", (req, res) => {
  const claim = db.prepare("SELECT * FROM claims WHERE claim_id = ?").get(req.params.id);
  if (!claim) return res.status(404).json({ error: "Claim not found." });
  if (claim.status !== "Pending") {
    return res.status(400).json({ error: "This claim has already been resolved." });
  }

  db.prepare("UPDATE claims SET status = 'Approved' WHERE claim_id = ?").run(claim.claim_id);
  db.prepare("UPDATE items SET status = 'Claimed' WHERE item_id = ?").run(claim.item_id);
  // Reject any other pending claims on the same item - it's now resolved.
  db.prepare(
    "UPDATE claims SET status = 'Rejected' WHERE item_id = ? AND claim_id != ? AND status = 'Pending'"
  ).run(claim.item_id, claim.claim_id);

  const item = db.prepare("SELECT * FROM items WHERE item_id = ?").get(claim.item_id);
  const claimant = db.prepare("SELECT * FROM users WHERE user_id = ?").get(claim.claimant_id);
  const owner = db.prepare("SELECT * FROM users WHERE user_id = ?").get(item.user_id);

  const notify = db.prepare("INSERT INTO notifications (user_id, item_id, message) VALUES (?, ?, ?)");
  notify.run(
    claimant.user_id,
    item.item_id,
    `Your claim on "${item.title}" was approved. Contact ${owner.name} at ${owner.contact_no || owner.email} to arrange the handover.`
  );
  notify.run(
    owner.user_id,
    item.item_id,
    `Good news - "${item.title}" has been matched and approved for ${claimant.name}. Contact them at ${claimant.contact_no || claimant.email} to arrange the handover.`
  );

  // Reject-notify any other claimants whose pending claim just got auto-rejected
  const bumped = db
    .prepare("SELECT claimant_id FROM claims WHERE item_id = ? AND claim_id != ? AND status = 'Rejected'")
    .all(claim.item_id, claim.claim_id);
  bumped.forEach((b) => {
    notify.run(b.claimant_id, item.item_id, `Your claim on "${item.title}" was closed - another claim was approved first.`);
  });

  res.json({ ok: true });
});

// POST /api/admin/claims/:id/reject
router.post("/claims/:id/reject", (req, res) => {
  const claim = db.prepare("SELECT * FROM claims WHERE claim_id = ?").get(req.params.id);
  if (!claim) return res.status(404).json({ error: "Claim not found." });
  if (claim.status !== "Pending") {
    return res.status(400).json({ error: "This claim has already been resolved." });
  }

  db.prepare("UPDATE claims SET status = 'Rejected' WHERE claim_id = ?").run(claim.claim_id);
  const item = db.prepare("SELECT * FROM items WHERE item_id = ?").get(claim.item_id);
  db.prepare("INSERT INTO notifications (user_id, item_id, message) VALUES (?, ?, ?)").run(
    claim.claimant_id,
    item.item_id,
    `Your claim on "${item.title}" was rejected by admin.`
  );

  res.json({ ok: true });
});

// GET /api/admin/items - manage all listings (FR8)
router.get("/items", (req, res) => {
  const rows = db
    .prepare(
      `SELECT items.*, users.name AS reporter_name FROM items
       JOIN users ON users.user_id = items.user_id ORDER BY items.created_at DESC`
    )
    .all();
  res.json(rows);
});

// PUT /api/admin/items/:id - edit a listing (FR8)
router.put("/items/:id", (req, res) => {
  const { title, category, description, location, status } = req.body;
  const item = db.prepare("SELECT * FROM items WHERE item_id = ?").get(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found." });

  db.prepare(
    `UPDATE items SET title = ?, category = ?, description = ?, location = ?, status = ?
     WHERE item_id = ?`
  ).run(
    title || item.title,
    category || item.category,
    description ?? item.description,
    location ?? item.location,
    status || item.status,
    req.params.id
  );
  res.json(db.prepare("SELECT * FROM items WHERE item_id = ?").get(req.params.id));
});

// DELETE /api/admin/items/:id
router.delete("/items/:id", (req, res) => {
  db.prepare("DELETE FROM items WHERE item_id = ?").run(req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/history - a combined activity log of every item + claim
// event, newest first. This is the "history/log" record referenced by FR9.
router.get("/history", (req, res) => {
  const itemEvents = db
    .prepare(
      `SELECT 'Item Reported' AS event, items.created_at AS at,
              items.title AS detail, users.name AS by_user, items.status
       FROM items JOIN users ON users.user_id = items.user_id`
    )
    .all();
  const claimEvents = db
    .prepare(
      `SELECT ('Claim ' || claims.status) AS event, claims.date_requested AS at,
              items.title AS detail, claimant.name AS by_user, claims.status
       FROM claims
       JOIN items ON items.item_id = claims.item_id
       JOIN users claimant ON claimant.user_id = claims.claimant_id`
    )
    .all();
  const all = [...itemEvents, ...claimEvents].sort((a, b) => (a.at < b.at ? 1 : -1));
  res.json(all);
});

// GET /api/admin/stats - small dashboard summary
router.get("/stats", (req, res) => {
  const totalItems = db.prepare("SELECT COUNT(*) AS c FROM items").get().c;
  const pendingClaims = db.prepare("SELECT COUNT(*) AS c FROM claims WHERE status = 'Pending'").get().c;
  const claimedItems = db.prepare("SELECT COUNT(*) AS c FROM items WHERE status = 'Claimed'").get().c;
  const totalUsers = db.prepare("SELECT COUNT(*) AS c FROM users WHERE role != 'admin'").get().c;
  res.json({ totalItems, pendingClaims, claimedItems, totalUsers });
});

module.exports = router;
