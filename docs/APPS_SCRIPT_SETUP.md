# Booking Backend Setup — Google Sheet + Apps Script

This is the **data side** of the booking calendar (Phase 1 of
[`CALENDAR_PLAN.md`](./CALENDAR_PLAN.md)). Follow it once to create a free
"mini-API" the website talks to. No servers, no monthly cost.

When you finish you'll have a **Web App URL** — paste it into the website config
and the calendar goes live.

> Time needed: ~15 minutes. You only need a Google account.

---

## Step 1 — Create the Google Sheet

1. Go to <https://sheets.google.com> and create a **blank spreadsheet**.
2. Name it something like **`Squish Squash Bookings`**.
3. At the bottom, you'll have one tab called `Sheet1`. Rename it to **`Sessions`**
   (double-click the tab name).
4. Add a second tab (the **＋** at the bottom-left) and name it **`Bookings`**.

### `Sessions` tab — type these headers in row 1 (A1 across to E1)

| A `date` | B `class_name` | C `time` | D `capacity` | E `notes` |
| -------- | -------------- | -------- | ------------ | --------- |

Then add a row per class. **Use the date format `YYYY-MM-DD`** (e.g. `2026-07-02`):

| date       | class_name                 | time          | capacity | notes            |
| ---------- | -------------------------- | ------------- | -------- | ---------------- |
| 2026-07-02 | Squish Squash Messy Play 🎨 | 14:00 – 16:00 | 12       |                  |
| 2026-07-05 | Family Messy Fun 🎉         | 09:00 – 11:00 | 16       | Sibling-friendly |

> 💡 To keep dates as plain text, you can select column A → **Format → Number →
> Plain text** before typing. This avoids Google reformatting them.

### `Bookings` tab — type these headers in row 1 (A1 across to I1)

| A `timestamp` | B `session_date` | C `parent_name` | D `phone` | E `children` | F `num_children` | G `total` | H `allergies` | I `status` |
| ------------- | ---------------- | --------------- | --------- | ------------ | ---------------- | --------- | ------------- | ---------- |

Leave it empty — the website fills this in automatically. **Don't rename these
columns**, the script relies on their order.

---

## Step 2 — Add the Apps Script

1. In the spreadsheet menu: **Extensions → Apps Script**. A code editor opens in
   a new tab.
2. Delete any sample code in `Code.gs`.
3. Paste the **entire** script below and click the **💾 Save** icon.

```javascript
/**
 * Squish Squash Studios — booking API
 * doGet()  -> live availability for every session
 * doPost() -> save a booking (with a capacity re-check so the last seat
 *             can never be oversold)
 */

const SHEET_SESSIONS = 'Sessions';
const SHEET_BOOKINGS = 'Bookings';

function ss_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

// Always return dates as plain 'YYYY-MM-DD' (handles real Date cells too).
function normalizeDate_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, ss_().getSpreadsheetTimeZone(), 'yyyy-MM-dd');
  }
  return String(value).trim();
}

// Sum of children already booked, per date.
function bookedCounts_() {
  const sheet = ss_().getSheetByName(SHEET_BOOKINGS);
  const counts = {};
  const last = sheet.getLastRow();
  if (last < 2) return counts;
  // columns B (session_date) .. F (num_children)
  const rows = sheet.getRange(2, 2, last - 1, 5).getValues();
  rows.forEach(function (r) {
    const date = normalizeDate_(r[0]);   // B
    const num = Number(r[4]) || 0;       // F
    if (date) counts[date] = (counts[date] || 0) + num;
  });
  return counts;
}

function sessions_() {
  const sheet = ss_().getSheetByName(SHEET_SESSIONS);
  const last = sheet.getLastRow();
  if (last < 2) return [];
  const rows = sheet.getRange(2, 1, last - 1, 5).getValues(); // A..E
  return rows
    .filter(function (r) { return r[0] !== '' && r[0] !== null; })
    .map(function (r) {
      return {
        date: normalizeDate_(r[0]),
        className: String(r[1]),
        time: String(r[2]),
        capacity: Number(r[3]) || 0,
        notes: String(r[4] || '')
      };
    });
}

function availability_() {
  const booked = bookedCounts_();
  return sessions_().map(function (s) {
    const b = booked[s.date] || 0;
    return {
      date: s.date,
      className: s.className,
      time: s.time,
      capacity: s.capacity,
      booked: b,
      spotsLeft: Math.max(0, s.capacity - b),
      notes: s.notes
    };
  });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ ok: true, sessions: availability_() });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // wait up to 20s so two bookings can't race
  try {
    const data = JSON.parse(e.postData.contents);

    // Honeypot: bots fill hidden fields; humans never do.
    if (data.company) return json_({ ok: false, reason: 'spam' });

    const date = String(data.session_date || '').trim();
    const numChildren = Number(data.num_children) || 0;
    if (!date || numChildren < 1 || !data.parent_name || !data.phone) {
      return json_({ ok: false, reason: 'invalid' });
    }

    const session = availability_().filter(function (s) { return s.date === date; })[0];
    if (!session) return json_({ ok: false, reason: 'no_session' });
    if (numChildren > session.spotsLeft) {
      return json_({ ok: false, reason: 'full', spotsLeft: session.spotsLeft });
    }

    ss_().getSheetByName(SHEET_BOOKINGS).appendRow([
      new Date(),                 // A timestamp
      date,                       // B session_date
      data.parent_name,           // C
      data.phone,                 // D
      data.children || '',        // E  (e.g. "Leo (2, sibling) - R200; Mia (4) - R200")
      numChildren,                // F
      data.total || '',           // G
      data.allergies || '',       // H
      'new'                       // I status
    ]);

    return json_({ ok: true, spotsLeft: session.spotsLeft - numChildren });
  } catch (err) {
    return json_({ ok: false, reason: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}
```

---

## Step 3 — Deploy as a Web App

1. In the Apps Script editor, click **Deploy → New deployment** (top-right).
2. Click the **⚙️ gear → Web app**.
3. Fill in:
   - **Description:** `Booking API`
   - **Execute as:** **Me** (your account — this is what lets it read/write the Sheet)
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. Google asks you to **authorize**. Click through, choose your account, and on
   the "Google hasn't verified this app" screen click **Advanced → Go to
   (project name) → Allow**. (This is expected — it's *your* script.)
6. Copy the **Web app URL**. It looks like:
   ```
   https://script.google.com/macros/s/AKfy...long.../exec
   ```
   **This is the URL the website needs.** Keep it handy for Step 5.

> ⚠️ **Whenever you change the script code later**, you must redeploy the same
> deployment: **Deploy → Manage deployments → ✏️ Edit → Version: New version →
> Deploy**. The URL stays the same. (Just editing dates in the *Sheet* needs **no**
> redeploy.)

---

## Step 4 — Test it

**Test reading (GET):** paste the Web app URL into a browser. You should see JSON
listing your sessions with `spotsLeft`, e.g.:

```json
{ "ok": true, "sessions": [
  { "date": "2026-07-02", "className": "Squish Squash Messy Play 🎨",
    "time": "14:00 – 16:00", "capacity": 12, "booked": 0, "spotsLeft": 12, "notes": "" }
] }
```

**Test writing (POST):** ⚠️ **Do not** run this in the console of the `/exec`
JSON page — Google serves that page with a strict `Content-Security-Policy`
(`default-src 'none'`) that blocks all outgoing `fetch` calls (you'll see a CSP
`connect-src` error). Instead run it from a normal page, e.g. your running site
at **http://localhost:5174** → **F12 → Console**. Paste this (swap in your real
URL) and press Enter:

```js
fetch('PASTE_YOUR_WEB_APP_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // text/plain avoids a CORS preflight
  body: JSON.stringify({
    session_date: '2026-07-02',
    parent_name: 'Test Parent',
    phone: '082 000 0000',
    children: 'Test Child (3, sibling) - R200',
    num_children: 1,
    total: 'R200',
    allergies: ''
  })
}).then(r => r.json()).then(console.log)
```

Expected: `{ ok: true, spotsLeft: 11 }`, and a new row appears in the `Bookings`
tab. Delete that test row afterwards. Re-running until full should return
`{ ok: false, reason: 'full' }`.

---

## Step 5 — Connect the website

Give me the Web app URL (or paste it into `src/data/booking.ts` once that file
exists in the build phase):

```ts
export const BOOKING_API_URL = 'https://script.google.com/macros/s/AKfy.../exec'
```

The front-end will:
- **GET** this URL to render the calendar with live availability, and
- **POST** bookings to it (as `text/plain` to avoid CORS preflight — see the test
  above), then open the pre-filled WhatsApp message.

---

## Notes & FAQ

- **Is the URL a secret?** No — it's safe in the front-end. The script runs as
  *you* and only does the two actions above; it never exposes your Google account.
- **Cost?** Free. Apps Script + Sheets are within Google's free quotas for this
  volume.
- **Timezone:** set the spreadsheet timezone under **File → Settings** so dates
  match Cape Town (the script formats dates using that timezone).
- **Privacy (POPIA):** the `Bookings` tab holds parent/child info — keep the
  spreadsheet private (don't share the *Sheet* link publicly; only the Web App
  URL is public).
- **Backups:** `File → Version history` keeps automatic snapshots.

Once you've got the URL and the GET/POST test works, tell me and I'll build the
calendar UI against it.
