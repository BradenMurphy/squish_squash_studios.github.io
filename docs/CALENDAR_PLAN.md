# Plan: Booking Calendar with Live Availability

Add a calendar to the site where the studio owner publishes the month's class
dates, parents click a date to see how many spots are left, and they book their
child into that class. The booking is **saved** and the owner is **notified**.

> Status: **plan / not yet built.** This document is the design we agreed on
> before implementation.

---

## 1. Decisions (already made)

| Decision        | Choice                                                            |
| --------------- | ----------------------------------------------------------------- |
| Data store      | **Google Sheet** (owner-managed)                                  |
| Booking outcome | **Save the booking AND notify** the owner                         |
| Who manages it  | **Studio owner, non-technical** — spreadsheet only, no code/deploy |

---

## 2. The core problem & chosen architecture

The site is **static** (GitHub Pages, no server). A static page cannot securely
talk to a database, because any API key in the front-end JavaScript is public —
anyone could read it and spam or wipe the data. So we need a tiny "middleman"
that holds the secret and does the reads/writes.

**Chosen solution: Google Sheets + a Google Apps Script Web App.**

```
                     reads availability (GET)
   ┌────────────┐  ───────────────────────────▶  ┌─────────────────────┐  ┌───────────────┐
   │  Website   │                                 │  Apps Script Web    │  │ Google Sheet  │
   │ (GH Pages) │  ◀───────────────────────────   │  App (the "API")    │──│  - Sessions   │
   └────────────┘    saves booking (POST)         │  runs AS the owner  │  │  - Bookings   │
                                                   └─────────────────────┘  └───────────────┘
                                                            │
                                                            ▼  on new booking
                                                   emails the owner + (optional) WhatsApp link
```

**Why this fits perfectly:**

- **No secrets in the front-end.** The Apps Script runs *as the owner's Google
  account*; the website only knows a public Web App URL, not any credentials.
- **Owner-friendly.** She manages dates and capacity in a normal Google Sheet.
- **Free, no extra hosting.** No Supabase/Vercel/Netlify account needed.
- **Notifications built in.** Apps Script can email the owner (`MailApp`) the
  moment a booking comes in.
- **Server-side capacity check.** The script re-checks availability before
  saving, so we don't oversell the last spot (uses `LockService` to avoid two
  people grabbing it at once).

> **Airtable alternative:** Airtable is also nice for the owner, but writing to
> it from the browser needs either an exposed token (insecure) or a separate
> serverless proxy (extra hosting). Apps Script avoids both, so we go with Sheets.

---

## 3. Data model (the Google Sheet)

A single spreadsheet with two tabs.

### Tab `Sessions` — the owner fills this in each month

| date       | class_name                 | time              | capacity | notes              |
| ---------- | -------------------------- | ----------------- | -------- | ------------------ |
| 2026-07-02 | Squish Squash Messy Play 🎨 | 14:00 – 16:00     | 12       |                    |
| 2026-07-05 | Family Messy Fun 🎉         | 09:00 – 11:00     | 16       | Sibling-friendly   |

- One row = one bookable class on a specific date.
- `capacity` = total spots. "Spots left" is computed, not stored.
- Adding next month = add rows. Cancelling a class = delete the row.

### Tab `Bookings` — written by the Web App (owner doesn't touch)

| timestamp | session_date | parent_name | phone | child_info | seats | allergies | status |
| --------- | ------------ | ----------- | ----- | ---------- | ----- | --------- | ------ |

- Each successful booking appends a row.
- **Spots left for a date = `capacity` − sum of `seats` booked for that date.**

---

## 4. The Apps Script "API"

Two endpoints in one script, deployed as a Web App ("execute as me", "anyone can
access"):

- **`doGet()` → availability JSON.** Reads `Sessions`, counts bookings per date
  from `Bookings`, returns:
  ```json
  [
    { "date": "2026-07-02", "className": "Squish Squash Messy Play 🎨",
      "time": "14:00 – 16:00", "capacity": 12, "booked": 5, "spotsLeft": 7 }
  ]
  ```
- **`doPost(e)` → create booking.** Receives the form data, then inside a
  `LockService` lock: re-reads the count, rejects with an error if the class is
  now full, otherwise appends to `Bookings`, sends the owner an email via
  `MailApp.sendEmail(...)`, and returns `{ ok: true }`.

CORS: return JSON with the right content type; calls from the browser use
`fetch`. (Apps Script Web Apps are reachable cross-origin for simple requests.)

---

## 5. Front-end (React + antd)

### Calendar component
- Use antd **`Calendar`** (full month view) — or `DatePicker` with custom cell
  rendering for a more compact widget.
- On load, `fetch` the availability JSON from the Web App URL.
- `cellRender` marks each class date with a badge: e.g. a green dot + "7 left",
  amber for low, red/"Full" when `spotsLeft === 0`.
- `disabledDate` greys out days that have no class, so only real dates are
  clickable.
- A loading skeleton while availability fetches; a friendly error state if the
  fetch fails (falls back to "message us on WhatsApp").

### Booking flow (on clicking an available date)
1. Open an antd **`Modal`** (or `Drawer`) showing the class, time, and spots left.
2. Reuse the existing booking **`Form`** fields (parent, phone, child, allergies)
   + a "number of children / seats" field.
3. On submit → `POST` to the Web App.
   - **Success:** show `message.success` confirmation, mark the date's count as
     updated (re-fetch availability), and — per "save **and** notify" — also
     offer a pre-filled **WhatsApp** confirmation link (the owner additionally
     gets the automatic email from Apps Script).
   - **Full / error:** show `message.error` and the WhatsApp fallback.
4. Disable the submit button while in flight; prevent double-submits.

### Where it lives
- New section/anchor `#calendar` (likely between **Classes** and **Gallery**),
  linked from the nav.
- The existing static `schedule.ts` becomes the "what classes we run" marketing
  table; the **calendar** is the live, dated, bookable view.

---

## 6. New / changed files

```
src/
  data/
    booking.ts          # NEW: Web App URL + types (Session, Availability, Booking)
  lib/
    availability.ts     # NEW: fetch availability + post a booking (with error handling)
  components/
    Calendar.tsx        # NEW: antd Calendar + availability badges + disabledDate
    BookingModal.tsx    # NEW: modal with the booking form, posts to the API
    Contact.tsx         # CHANGED: keep WhatsApp quick-booking as the fallback
    Header.tsx          # CHANGED: add "Book a Date" / Calendar nav item
  App.tsx               # CHANGED: render <Calendar /> as a new #calendar section
docs/
  CALENDAR_PLAN.md      # this file
  APPS_SCRIPT_SETUP.md  # NEW: copy-paste script + step-by-step deploy guide for owner
```

The Web App URL is **not a secret** but is environment-specific — store it in
`src/data/booking.ts` (or a `.env` `VITE_BOOKING_API_URL`) so it's easy to swap.

---

## 7. Owner's monthly workflow (the whole point)

1. Open the Google Sheet → `Sessions` tab.
2. Add a row per class for the month: date, class name, time, capacity.
3. Done. The website picks it up automatically on next load — **no code, no
   deploy, no developer needed.**
4. Bookings appear in the `Bookings` tab and arrive by email as they happen.

---

## 8. Edge cases & considerations

- **Overbooking / race conditions:** handled server-side in `doPost` with
  `LockService` + a fresh re-count before appending. The browser count is just a
  hint; the script is the source of truth.
- **Stale availability:** re-fetch after each booking and on tab focus; consider
  a short cache. Two people can see "1 left" at once — the loser gets a clear
  "just filled up" message.
- **Time zones:** store dates as plain `YYYY-MM-DD` strings (no time component)
  to avoid UTC drift between the Sheet, script, and browser.
- **Spam / abuse:** the POST endpoint is public. Mitigate with basic validation,
  a honeypot field, and optionally a lightweight check; volume is low for a small
  studio. Avoid storing more personal data than needed.
- **Privacy (POPIA):** the Bookings tab holds parent/child info — keep the Sheet
  private to the owner; add a short consent line to the form.
- **Offline/error resilience:** if the API is unreachable, the calendar still
  renders class dates and routes booking to WhatsApp so no booking is ever lost.
- **Multiple seats:** capacity math uses summed `seats`, not row count, so a
  parent booking 2 children decrements correctly.

---

## 9. Implementation phases

1. **Sheet + Apps Script** — create the two tabs, paste the script, deploy the
   Web App, test `GET`/`POST` with sample rows. *(Deliverable: working URL.)*
2. **Data layer** — `booking.ts` + `availability.ts` with typed fetch/post and
   error handling; verify against the live URL.
3. **Calendar UI** — `Calendar.tsx` rendering availability badges + disabled
   non-class days; loading/error states.
4. **Booking modal** — `BookingModal.tsx` with the form, POST, success/full/error
   handling, availability re-fetch, WhatsApp fallback.
5. **Wire-in** — new `#calendar` section in `App.tsx`, nav link, polish.
6. **Owner docs** — `APPS_SCRIPT_SETUP.md` with screenshots so the owner can
   recreate/maintain it.
7. **Test & deploy** — end-to-end (book the last seat, confirm rejection, confirm
   email), then push (GitHub Actions deploys).

---

## 10. Open questions before building

- **One studio location / one room?** Capacity is per class row — confirm a date
  can't have two overlapping classes (the model supports multiple rows/date).
- **Seats per booking:** allow booking multiple children in one go? (Plan assumes
  yes via a `seats` field.)
- **Notification channel:** email to the owner is automatic; do you also want a
  WhatsApp ping, or is the parent→studio WhatsApp confirmation enough?
- **Cancellations/refunds:** out of scope for v1 (owner edits the Sheet manually)?
- **Payment:** still handled offline (EFT/SnapScan) as today, or eventually
  integrate a pay link? (Plan keeps payment offline for v1.)
