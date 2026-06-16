import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;
  
  dbInstance = await open({
    filename: path.join(DATA_DIR, 'database.sqlite'),
    driver: sqlite3.Database
  });
  return dbInstance;
}

export async function initDb(seedData) {
  const db = await getDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      regNo TEXT,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      avatarUrl TEXT
    );

    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      canteenId TEXT,
      title TEXT,
      image TEXT,
      highlightText TEXT,
      headline TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      date TEXT,
      amount INTEGER,
      items INTEGER,
      status TEXT,
      itemIds TEXT,
      timestamp INTEGER
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      category TEXT,
      subject TEXT,
      message TEXT,
      status TEXT,
      date TEXT,
      timestamp INTEGER
    );

    CREATE TABLE IF NOT EXISTS ticket_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticketId TEXT,
      sender TEXT,
      text TEXT,
      time TEXT,
      FOREIGN KEY (ticketId) REFERENCES tickets(id)
    );

    CREATE TABLE IF NOT EXISTS canteens (
      id TEXT PRIMARY KEY,
      name TEXT,
      waitTime TEXT,
      description TEXT,
      image TEXT,
      isActive INTEGER,
      menu TEXT
    );

    CREATE TABLE IF NOT EXISTS wallet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      balance REAL
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rating INTEGER,
      feedback TEXT,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
  `);

  // Check if seeding is needed
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0 && seedData) {
    console.log('Seeding SQLite database with default data...');
    const { defaultUsers, defaultStories, defaultOrders, defaultTickets, defaultCanteens, defaultWallet, defaultFeedback, defaultAdmin } = seedData;

    for (const u of defaultUsers) {
      await db.run('INSERT INTO users (name, regNo, email, phone, password, avatarUrl) VALUES (?, ?, ?, ?, ?, ?)', [u.name, u.regNo, u.email, u.phone, u.password, u.avatarUrl]);
    }

    for (const s of defaultStories) {
      await db.run('INSERT INTO stories (canteenId, title, image, highlightText, headline) VALUES (?, ?, ?, ?, ?)', [s.canteenId, s.title, s.image, s.highlightText, s.headline]);
    }

    for (const o of defaultOrders) {
      await db.run('INSERT INTO orders (id, date, amount, items, status, itemIds, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)', [o.id, o.date, o.amount, o.items, o.status, JSON.stringify(o.itemIds), o.timestamp]);
    }

    for (const t of defaultTickets) {
      await db.run('INSERT INTO tickets (id, category, subject, message, status, date, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)', [t.id, t.category, t.subject, t.message, t.status, t.date, t.timestamp]);
      for (const m of (t.messages || [])) {
        await db.run('INSERT INTO ticket_messages (ticketId, sender, text, time) VALUES (?, ?, ?, ?)', [t.id, m.sender, m.text, m.time]);
      }
    }

    for (const c of defaultCanteens) {
      await db.run('INSERT INTO canteens (id, name, waitTime, description, image, isActive, menu) VALUES (?, ?, ?, ?, ?, ?, ?)', [c.id, c.name, c.waitTime, c.description, c.image, c.isActive ? 1 : 0, JSON.stringify(c.menu)]);
    }

    await db.run('INSERT INTO wallet (balance) VALUES (?)', [defaultWallet.balance]);

    for (const f of defaultFeedback) {
      await db.run('INSERT INTO feedback (rating, feedback, date) VALUES (?, ?, ?)', [f.rating, f.feedback, f.date]);
    }

    for (const a of defaultAdmin) {
      await db.run('INSERT INTO admin (username, password) VALUES (?, ?)', [a.username, a.password]);
    }
    console.log('Database seeded successfully.');
  }
}
