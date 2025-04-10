const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const dbPath = './backend/db.json';

let db = JSON.parse(fs.readFileSync(dbPath));

const saveDB = () => fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

// Register wallet
app.post('/register', (req, res) => {
  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: 'No wallet address' });

  if (!db.users[wallet]) {
    db.users[wallet] = {
      points: 0,
      claimed: false,
    };
    saveDB();
    return res.json({ status: 'registered' });
  }

  return res.json({ status: 'already exists' });
});

// Add task points
app.post('/add-points', (req, res) => {
  const { wallet, points } = req.body;
  if (db.users[wallet]) {
    db.users[wallet].points += points;
    saveDB();
    return res.json({ status: 'added', total: db.users[wallet].points });
  }
  res.status(404).json({ error: 'Wallet not found' });
});

// Claim
app.post('/claim', (req, res) => {
  const { wallet } = req.body;
  if (db.users[wallet]) {
    if (db.users[wallet].claimed) return res.json({ status: 'already claimed' });
    db.users[wallet].claimed = true;
    saveDB();
    return res.json({ status: 'claimed' });
  }
  res.status(404).json({ error: 'Wallet not found' });
});

// Leaderboard
app.get('/leaderboard', (req, res) => {
  const sorted = Object.entries(db.users)
    .sort((a, b) => b[1].points - a[1].points)
    .slice(0, 100)
    .map(([wallet, data]) => ({ wallet, points: data.points }));
  res.json(sorted);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
