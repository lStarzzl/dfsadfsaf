const express = require('express');
const path = require('path');
const app = express();

// Serve static files (CSS/JS/images)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/keys', require('./api/keys'));

// Serve Horizon login page for ALL routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;