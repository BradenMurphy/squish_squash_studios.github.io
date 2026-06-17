import express from 'express';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Database setup ---------------------------------------------------------
const db = new Database(join(__dirname, 'tracker.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    phone      TEXT,
    notes      TEXT,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS attendance (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    class_date  TEXT NOT NULL,
    UNIQUE(customer_id, class_date)
  );
`);

// --- App --------------------------------------------------------------------
const app = express();
app.use(express.json());

// List / search customers (matches name OR phone)
app.get('/api/customers', (req, res) => {
  const search = (req.query.search || '').trim();
  if (search) {
    const like = `%${search}%`;
    return res.json(
      db.prepare(
        `SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? ORDER BY name`
      ).all(like, like)
    );
  }
  res.json(db.prepare(`SELECT * FROM customers ORDER BY name`).all());
});

// Create a brand-new customer
app.post('/api/customers', (req, res) => {
  const { name, phone, notes } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const info = db
    .prepare(`INSERT INTO customers (name, phone, notes, created_at) VALUES (?, ?, ?, ?)`)
    .run(name.trim(), phone?.trim() || null, notes?.trim() || null, new Date().toISOString());
  res.status(201).json(
    db.prepare(`SELECT * FROM customers WHERE id = ?`).get(info.lastInsertRowid)
  );
});

// Record attendance for a date
app.post('/api/attendance', (req, res) => {
  const { customer_id, class_date } = req.body;
  if (!customer_id || !class_date) {
    return res.status(400).json({ error: 'customer_id and class_date are required' });
  }
  try {
    db.prepare(`INSERT INTO attendance (customer_id, class_date) VALUES (?, ?)`)
      .run(customer_id, class_date);
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Already checked in for this date' });
    }
    throw e;
  }
  res.status(201).json({ ok: true });
});

// Attendance for a given date
app.get('/api/attendance', (req, res) => {
  const { date } = req.query;
  res.json(
    db.prepare(`
      SELECT a.id, a.customer_id, a.class_date, c.name, c.phone
      FROM attendance a JOIN customers c ON c.id = a.customer_id
      WHERE a.class_date = ?
      ORDER BY c.name
    `).all(date)
  );
});

// Remove an attendance record
app.delete('/api/attendance/:id', (req, res) => {
  db.prepare(`DELETE FROM attendance WHERE id = ?`).run(req.params.id);
  res.json({ ok: true });
});

// Stats: per-customer visit counts + summary
app.get('/api/stats', (req, res) => {
  const customers = db.prepare(`
    SELECT c.id, c.name, c.phone,
           COUNT(a.id)      AS visits,
           MIN(a.class_date) AS first_visit,
           MAX(a.class_date) AS last_visit
    FROM customers c
    LEFT JOIN attendance a ON a.customer_id = c.id
    GROUP BY c.id
    ORDER BY visits DESC, c.name
  `).all();

  res.json({
    customers,
    summary: {
      totalCustomers: customers.length,
      returning: customers.filter((c) => c.visits >= 2).length,
      firstTimers: customers.filter((c) => c.visits === 1).length,
    },
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
