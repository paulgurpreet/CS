
# Campus Lost & Found Management System

A full working web app for reporting, searching, and claiming lost/found items
on a college campus - built to match the project's SRS (see the accompanying
project file for the full requirements).

## Tech stack used
- **Backend:** Node.js + Express
- **Database:** SQLite via Node's built-in `node:sqlite` module - a single file
  (`lostfound.db`), zero setup, and no native/C++ build step (this avoids the
  "Visual Studio Build Tools / Windows SDK" errors that the older
  `better-sqlite3` package can trigger on Windows)
- **Frontend:** Plain HTML, CSS and JavaScript (no framework, no build step)
- **Auth:** Session-based login with hashed passwords (`bcryptjs`)

This matches Chapter 6 of the project report; if your course specifically
requires MySQL/PHP/Java instead, only `db.js` and the `routes/` files would
need to change - the frontend and the requirements stay the same.

## How to run it

1. Make sure [Node.js](https://nodejs.org) **v22.5 or later** is installed (the
   database uses Node's newer built-in SQLite support). Check with `node -v`
   in a terminal - if it shows something older than v22.5, download the
   latest LTS installer from nodejs.org and reinstall.
2. Open a terminal in this folder and run:
   ```
   npm install
   npm start
   ```
3. Open your browser at **http://localhost:3000**

That's it - the database file and one admin account are created automatically
the first time you run it.

## Logging in

- **Admin login:** `admin@campus.edu` / `admin123`
  (use this to verify/approve claims and manage listings under "Admin Panel")
- **Everyone else:** click "Register" to create a student/staff account.

## What's implemented (maps to the SRS in the project file)

| Requirement | Where it lives |
|---|---|
| FR1/FR2 - Report a lost/found item | `report.html` + `POST /api/items` |
| FR3 - Search & filter items | `index.html` + `GET /api/items` |
| FR4 - Match notifications | `checkForMatches()` in `routes/items.js` |
| FR5 - Raise a claim (on a found item: "this is mine"; on a lost item: "I found this") | `item.html` + `POST /api/claims` |
| FR6 - Admin verifies claims | `admin.html` + `routes/admin.js` |
| FR7 - Register/login | `register.html`, `login.html`, `routes/auth.js` |
| FR8 - Admin views, edits, deletes listings | `admin.html` (All Listings tab) |
| FR9 - History/log of items | `admin.html` (Activity History tab) + `GET /api/admin/history` |
| FR10 - View status of reported item | `my-items.html` |

## Project structure

```
lost-found-app/
├── server.js            # Express app entry point
├── db.js                # SQLite setup + table creation + seed admin
├── routes/
│   ├── auth.js           # register / login / logout / session check
│   ├── items.js          # report item, search/filter, matching logic
│   ├── claims.js         # raise a claim, view my claims
│   ├── admin.js          # approve/reject claims, manage listings, stats
│   └── notifications.js  # in-app notifications
└── public/               # frontend (plain HTML/CSS/JS)
    ├── index.html         # browse & search
    ├── item.html          # item details + raise claim
    ├── report.html         # report a lost/found item
    ├── my-items.html       # my items, my claims, notifications
    ├── admin.html          # admin dashboard
    ├── login.html / register.html
    ├── css/style.css
    └── js/common.js
```

## Extra behaviour worth knowing

- Claims work on **both** lost and found items. Approving a claim marks the
  item Claimed, auto-closes other pending claims on it, and sends **both**
  people each other's contact details (contact is hidden until approval).
- You can't claim your own listing, and you can't file a duplicate pending
  claim on the same item.
- Users can delete their own reports from "My Items".
- Registration validates email format, password length (6+) and a 10-digit
  contact number, on both the browser and the server.

## Troubleshooting

- **"ExperimentalWarning: SQLite is an experimental feature"** when you run
  `npm start` - this is just an informational message, not an error. The app
  works normally; ignore it.
- **Still seeing a `better-sqlite3` / `node-gyp` / "Visual Studio Build Tools"
  error** - you likely have an old `node_modules` folder from before. Delete
  the `node_modules` folder (and `package-lock.json` if present) inside
  `lost-found-app`, then run `npm install` again.
- **`node -v` shows a version older than 22.5** - the built-in SQLite module
  won't exist yet. Reinstall Node.js using the latest LTS installer from
  nodejs.org.

## Notes for your viva / demo

- Try reporting a **found** item, then a **lost** item in the *same category*
  with an overlapping word in the description (e.g. both mention "black") -
  the system will auto-mark both as "Matched" and notify both users. That's
  the FR4 matching logic in action.
- Log in as admin to see the claim approval flow (FR6) - approving a claim
  automatically marks the item "Claimed" and rejects any other pending
  claims on the same item.
