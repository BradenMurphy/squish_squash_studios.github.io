# Plan: Booking Calendar with Live Availability

Add a calendar to the site where the studio owner publishes the month's class
dates, parents click a date to see how many spots are left, and they book one or
more children into that class. The booking is **saved to a Google Sheet** and the
studio is **notified via WhatsApp**.

> Status: **plan / not yet built.** This document is the agreed design before
> implementation.

---

## 1. Decisions (all confirmed)

| Decision               | Choice                                                            |
| ---------------------- | ----------------------------------------------------------------- |
| Data store             | **Google Sheet** (owner-managed)                                  |
| Save bookings          | Yes — appended to the Sheet via Apps Script                       |
| Notify                 | **WhatsApp only** (pre-filled message) — **no email**             |
| Who manages dates      | **Studio owner, non-technical** — spreadsheet only, no code/deploy |
| One class per date     | **Yes** — a date never has two overlapping classes                |
| Multiple children      | **Yes** — book several children in one submission                 |
| Pricing                | **R200 per child**; if siblings, **first child full, each additional sibling 15% off** (R170). Show per-child amounts + total |
| Payment                | **Offline** (EFT / SnapScan), as today — no online payment        |

---

## 2. The core problem & chosen architecture

The site is **static** (GitHub Pages, no server). A static page can't securely
hold a database key — anything in the front-end JS is public and abusable. So we
use a tiny "middleman" that owns the secret and does the reads/writes.

**Chosen solution: Google Sheets + a Google Apps Script Web App.**

```
                     reads availability (GET)
   ┌────────────┐  ───────────────────────────▶  ┌─────────────────────┐  ┌───────────────┐
   │  Website   │                                 │  Apps Script Web    │  │ Google Sheet  │
   │ (GH Pages) │  ◀───────────────────────────   │  App (the "API")    │──│  - Sessions   │
   └────────────┘    saves booking (POST)         │  runs AS the owner  │  │  - Bookings   │
        │                                          └─────────────────────┘  └───────────────┘
        │  on success: open WhatsApp pre-filled (the studio's notification)
        ▼
   wa.me/27825791653?text=... (date, children, sibling discount note)
```

**Why this fits:** no secrets in the front-end · owner manages a plain Sheet ·
free, no extra hosting · server-side capacity check prevents overselling the last
seat · notification is just the existing WhatsApp deep-link, so no email setup.

> **Airtable alternative** was considered but needs an exposed token or a separate
> serverless proxy to write from the browser. Apps Script avoids both.

---

## 3. Data model (the Google Sheet)

One spreadsheet, two tabs. **`date` is unique** in `Sessions` (one class per day).

### Tab `Sessions` — the owner fills this in each month

| date       | class_name                 | time          | capacity | notes            |
| ---------- | -------------------------- | ------------- | -------- | ---------------- |
| 2026-07-02 | Squish Squash Messy Play 🎨 | 14:00 – 16:00 | 12       |                  |
| 2026-07-05 | Family Messy Fun 🎉         | 09:00 – 11:00 | 16       | Sibling-friendly |

- One row = one bookable class on a specific date.
- `capacity` = total child spots. "Spots left" is computed, never stored.
- Add next month = add rows. Cancel a class = delete its row.

### Tab `Bookings` — written by the Web App (owner doesn't edit)

| timestamp | session_date | parent_name | phone | children (name, age, sibling?, price) | num_children | total | allergies | status |
| --------- | ------------ | ----------- | ----- | ------------------------------------- | ------------ | ----- | --------- | ------ |

- **Spots left for a date = `capacity` − sum of `num_children` booked for that date.**
- The `children` column records each child's sibling flag and computed price; the
  `total` is informational (payment is settled offline by the owner).

---

## 4. The Apps Script "API"

Two endpoints in one script, deployed as a Web App ("execute as me", "anyone can
access"). **No `MailApp` / email** — saving is the only server job.

- **`doGet()` → availability JSON:**
  ```json
  { "ok": true, "sessions": [
    { "date": "2026-07-02", "className": "Squish Squash Messy Play 🎨",
      "time": "14:00 – 16:00", "capacity": 12, "booked": 5, "spotsLeft": 7 }
  ] }
  ```
- **`doPost(e)` → create booking:** inside a `LockService` lock, re-count seats
  for that date, reject if `num_children > spotsLeft`, else append the row and
  return `{ ok: true }` (or `{ ok: false, reason: "full" }`).

---

## 5. Front-end (React + antd)

### Calendar
- antd **`Calendar`** (month view). On load, `fetch` availability from the Web App.
- `cellRender` shows a badge per class date: green "7 left", amber when low, red
  "Full" at `spotsLeft === 0`.
- `disabledDate` greys out days with no class, so only real dates are clickable.
- Loading skeleton while fetching; error state falls back to "message us on
  WhatsApp" so a booking is never blocked.

### Booking flow (click an available date)
1. antd **`Modal`** shows the class, time, and spots left.
2. Booking **form**:
   - Parent name + WhatsApp number.
   - **Children:** an antd **`Form.List`** — add a row per child with **name,
     age, and a "Sibling" checkbox** (mark each child who is a sibling of another
     child in this booking). `num_children` = list length; validated against
     `spotsLeft`. A booking can mix siblings and non-siblings (e.g. a friend).
   - Allergies / requirements (optional).
3. **Price breakdown** (display only — payment is offline): show a **line per
   child with its amount, then a total**. The discount applies **only within the
   sibling group**: among children marked "Sibling", the **first pays R200 and
   each additional sibling pays R170** (15% off); any child **not** marked sibling
   pays R200. Examples:
   - 1 child → R200 · **Total R200**
   - 2 siblings → R200 + R170 · **Total R370**
   - 3 siblings → R200 + R170 + R170 · **Total R540**
   - 2 siblings + 1 non-sibling → R200 + R170 + R200 · **Total R570**

   Numbers live in `pricing.ts` (`basePrice: 200`, `siblingDiscount: 0.15`).
4. **Submit →** `POST` to the Web App.
   - **Success:** `message.success`, re-fetch availability, then **open WhatsApp
     pre-filled** with date, children, sibling/discount note, and parent details
     — this is the studio's notification.
   - **Full / error:** `message.error` + WhatsApp fallback link.
5. Disable submit while in flight; block double-submits.

Example pre-filled WhatsApp text:
```
Hi Squish Squash Studios! 🎨 Booking request:
Date: Wed 2 Jul 2026 — Squish Squash Messy Play (14:00–16:00)
Parent: Sarah Mitchell  |  WhatsApp: 082 579 1653
Children (3): Leo (2, sibling) — R200, Mia (4, sibling) — R170, Zoe (3) — R200
Allergies: gluten-free please
Estimated total: R570
```

### Placement
- New `#calendar` section between **Classes** and **Gallery**, with a nav link.
- Existing `schedule.ts` stays as the marketing "what we run" table; the calendar
  is the live, dated, bookable view.

---

## 6. New / changed files

```
src/
  data/
    booking.ts          # NEW: Web App URL, types (Session, Availability, Booking)
    pricing.ts          # NEW: base price + sibling-discount rule (config)
  lib/
    availability.ts     # NEW: fetch availability + post booking (typed, error-handled)
    whatsapp.ts         # NEW: build the pre-filled wa.me booking link
  components/
    BookingCalendar.tsx # NEW: antd Calendar + availability badges + disabledDate
    BookingModal.tsx    # NEW: form (Form.List children + siblings), POST, WhatsApp
    Header.tsx          # CHANGED: add "Book a Date" nav item
  App.tsx               # CHANGED: render <BookingCalendar /> as #calendar section
docs/
  CALENDAR_PLAN.md      # this file
  APPS_SCRIPT_SETUP.md  # NEW: copy-paste script + owner deploy guide (with screenshots)
```

The Web App URL is not secret but is environment-specific — keep it in
`booking.ts` (or `.env` `VITE_BOOKING_API_URL`) for easy swapping.

---

## 7. Owner's monthly workflow

1. Open the Google Sheet → `Sessions` tab.
2. Add one row per class: date, class name, time, capacity.
3. Done — the website shows it automatically on next load. **No code, no deploy.**
4. Bookings land in the `Bookings` tab; each parent also messages on WhatsApp,
   where the owner confirms the spot and settles payment (incl. sibling discount).

---

## 8. Edge cases & considerations

- **Overbooking:** authoritative check is server-side in `doPost` (`LockService` +
  fresh re-count). Browser counts are hints; two people seeing "1 left" → the
  loser gets a clear "just filled up" message.
- **Multiple seats:** capacity math sums `num_children`, so booking 2 kids
  decrements 2.
- **Siblings/discount:** marked per child; a booking may mix siblings and
  non-siblings. Assumes **one sibling group per booking** (first sibling full,
  rest 15% off) — realistic since a parent books their own children plus the odd
  friend. Price is informational only (offline payment); the owner confirms it.
- **Time zones:** store dates as plain `YYYY-MM-DD` strings to avoid UTC drift.
- **Stale availability:** re-fetch after booking and on tab focus.
- **Spam/abuse:** public POST — add validation + a honeypot field; volume is low.
- **Privacy (POPIA):** Bookings holds parent/child info — keep the Sheet private;
  add a short consent line to the form.
- **Resilience:** if the API is down, the calendar still renders dates and routes
  booking to WhatsApp, so no booking is lost.

---

## 9. Implementation phases

1. **Sheet + Apps Script** — two tabs, paste script, deploy Web App, test
   `GET`/`POST`. *(Deliverable: working URL.)*
2. **Data + lib layer** — `booking.ts`, `pricing.ts`, `availability.ts`,
   `whatsapp.ts`, typed and error-handled against the live URL.
3. **Calendar UI** — `BookingCalendar.tsx` with availability badges, disabled
   non-class days, loading/error states.
4. **Booking modal** — `BookingModal.tsx`: `Form.List` children, siblings switch,
   price estimate, POST, success/full/error + WhatsApp notify, availability
   re-fetch.
5. **Wire-in** — `#calendar` section + nav link, polish.
6. **Owner docs** — `APPS_SCRIPT_SETUP.md` with screenshots.
7. **Test & deploy** — end-to-end (book last seat, confirm rejection, confirm
   WhatsApp message), then push (GitHub Actions deploys).

---

## 10. All decisions resolved — ready to build

- One class per date ✓ · multiple children ✓ · WhatsApp only, no email ✓
- Payment offline ✓
- **Pricing:** R200 per child. Within the sibling group, **first sibling full
  price, each additional sibling 15% off** (R170). Non-sibling children pay full.
  Sibling status is marked **per child**. Per-child amounts + total are shown ✓

`pricing.ts`:
```ts
export const pricing = {
  basePrice: 200,        // R per child
  siblingDiscount: 0.15, // each additional sibling pays (1 - 0.15) × basePrice
}

// Input: one boolean per child = "is this child a sibling of another in this booking".
// First sibling pays full; each subsequent sibling is discounted. Non-siblings full.
export function priceForChildren(siblingFlags: boolean[]): number[] {
  let firstSiblingSeen = false
  return siblingFlags.map((isSibling) => {
    if (isSibling && firstSiblingSeen) {
      return Math.round(pricing.basePrice * (1 - pricing.siblingDiscount))
    }
    if (isSibling) firstSiblingSeen = true
    return pricing.basePrice
  })
}
// [true, true]         -> [200, 170]        total 370
// [true, true, true]   -> [200, 170, 170]   total 540
// [true, true, false]  -> [200, 170, 200]   total 570
// [false, false]       -> [200, 200]        total 400
```

> Build order is §9. Phase 1 (Google Sheet + Apps Script) produces the Web App
> URL that the front-end needs.
