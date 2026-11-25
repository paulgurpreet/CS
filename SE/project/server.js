// server.js
// Entry point for the Campus Lost & Found Management System.
// Run with: npm install && npm start   (then open http://localhost:3000)

const express = require("express");
const session = require("express-session");
const path = require("path");

const { router: authRouter } = require("./routes/auth");
const itemsRouter = require("./routes/items");
const claimsRouter = require("./routes/claims");
const adminRouter = require("./routes/admin");
const notificationsRouter = require("./routes/notifications");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  session({
    secret: "campus-lost-found-secret-key", // change this in a real deployment
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 hours
  })
);

// API routes
app.use("/api/auth", authRouter);
app.use("/api/items", itemsRouter);
app.use("/api/claims", claimsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/notifications", notificationsRouter);

// Static frontend
app.use(express.static(path.join(__dirname, "public")));

// Basic error handler so a bad request never crashes the server
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Campus Lost & Found Management System running at http://localhost:${PORT}`);
});
