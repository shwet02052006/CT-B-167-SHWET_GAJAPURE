
const path = require('path');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const dbPath = path.join(__dirname, 'tasks.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('todo','in-progress','done')),
  due_date TEXT NULL,
  details TEXT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);`);


const toApi = (row) => ({
  id: row.id,
  title: row.title,
  status: row.status,
  dueDate: row.due_date,
  details: row.details,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

function validateTask(t, { allowEmptyTitle = false } = {}) {
  const errors = [];
  if (!t) return ['Body required'];
  const title = (t.title || '').trim();
  if (!allowEmptyTitle && !title) errors.push('Title is required');
  if (title.length > 140) errors.push('Title must be <= 140 chars');
  const status = t.status || 'todo';
  if (!['todo', 'in-progress', 'done'].includes(status)) errors.push('Invalid status');
  const dueDate = t.dueDate || null;
  if (dueDate) {
    const d = new Date(dueDate);
    if (isNaN(d.getTime())) errors.push('Invalid dueDate');
  }
  return errors;
}

app.get('/api/tasks', (req, res) => {
  const rows = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
  res.json(rows.map(toApi));
});

app.post('/api/tasks', (req, res) => {
  const body = req.body || {};
  const errors = validateTask(body);
  if (errors.length) return res.status(400).json({ errors });
  const info = db
    .prepare('INSERT INTO tasks (title, status, due_date, details) VALUES (?,?,?,?)')
    .run((body.title || '').trim(), body.status || 'todo', body.dueDate || null, body.details || null);
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(toApi(row));
});

app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  const merged = {
    title: body.title !== undefined ? body.title : existing.title,
    status: body.status !== undefined ? body.status : existing.status,
    dueDate: body.dueDate !== undefined ? body.dueDate : existing.due_date,
    details: body.details !== undefined ? body.details : existing.details,
  };
  const errors = validateTask(merged);
  if (errors.length) return res.status(400).json({ errors });
  db.prepare('UPDATE tasks SET title=?, status=?, due_date=?, details=?, updated_at=datetime(\'now\') WHERE id=?')
    .run((merged.title || '').trim(), merged.status, merged.dueDate || null, merged.details || null, id);
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(toApi(row));
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
  const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ deleted: true });
});


app.use('/', express.static(__dirname));

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Task app server running at http://localhost:${PORT}`);
});
