const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database initialization
const db = new sqlite3.Database('./raffle.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Raffles table
    db.run(`
      CREATE TABLE IF NOT EXISTS raffles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Participants table
    db.run(`
      CREATE TABLE IF NOT EXISTS participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        raffle_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        access_code TEXT UNIQUE NOT NULL,
        assigned_category TEXT,
        FOREIGN KEY (raffle_id) REFERENCES raffles(id)
      )
    `);

    // Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        raffle_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (raffle_id) REFERENCES raffles(id)
      )
    `);

    console.log('Database tables initialized');
  });
}

// Generate unique access code
function generateAccessCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Randomly assign categories to participants
function assignCategories(participants, categories) {
  const shuffledCategories = [...categories];
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffledCategories.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledCategories[i], shuffledCategories[j]] = [shuffledCategories[j], shuffledCategories[i]];
  }
  
  const assignments = {};
  participants.forEach((participant, index) => {
    assignments[participant.name] = shuffledCategories[index % shuffledCategories.length];
  });
  
  return assignments;
}

// API Routes

// Create a new raffle
app.post('/api/raffles', async (req, res) => {
  const { name, participants, categories } = req.body;

  if (!name || !participants || !categories || participants.length === 0 || categories.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create raffle
    db.run('INSERT INTO raffles (name) VALUES (?)', [name], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating raffle' });
      }

      const raffleId = this.lastID;

      // Insert categories
      const categoryStmt = db.prepare('INSERT INTO categories (raffle_id, name) VALUES (?, ?)');
      categories.forEach(category => {
        categoryStmt.run(raffleId, category);
      });
      categoryStmt.finalize();

      // Assign categories to participants
      const assignments = assignCategories(participants, categories);

      // Insert participants with access codes
      const participantStmt = db.prepare(
        'INSERT INTO participants (raffle_id, name, email, access_code, assigned_category) VALUES (?, ?, ?, ?, ?)'
      );

      const participantData = [];
      for (const participant of participants) {
        const accessCode = generateAccessCode();
        const assignedCategory = assignments[participant.name];
        
        participantStmt.run(
          raffleId,
          participant.name,
          participant.email,
          accessCode,
          assignedCategory
        );

        participantData.push({
          name: participant.name,
          email: participant.email,
          accessCode,
          category: assignedCategory
        });
      }
      participantStmt.finalize();

      res.json({
        raffleId,
        message: 'Raffle created successfully',
        participants: participantData
      });
    });
  } catch (error) {
    console.error('Error creating raffle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get raffle by ID with participants and categories
app.get('/api/raffles/:id', (req, res) => {
  const raffleId = req.params.id;

  db.get('SELECT * FROM raffles WHERE id = ?', [raffleId], (err, raffle) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching raffle' });
    }
    if (!raffle) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    db.all('SELECT * FROM participants WHERE raffle_id = ?', [raffleId], (err, participants) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching participants' });
      }

      db.all('SELECT * FROM categories WHERE raffle_id = ?', [raffleId], (err, categories) => {
        if (err) {
          return res.status(500).json({ error: 'Error fetching categories' });
        }

        res.json({
          raffle,
          participants,
          categories
        });
      });
    });
  });
});

// Get participant result by access code
app.get('/api/result/:code', (req, res) => {
  const accessCode = req.params.code;

  db.get(
    'SELECT name, assigned_category, access_code FROM participants WHERE access_code = ?',
    [accessCode],
    (err, participant) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching result' });
      }
      if (!participant) {
        return res.status(404).json({ error: 'Invalid access code' });
      }

      res.json({
        name: participant.name,
        category: participant.assigned_category,
        code: participant.access_code
      });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
