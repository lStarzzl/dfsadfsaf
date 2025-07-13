const express = require('express');
const router = express.Router();
const storage = require('../storage');

// Key generation helper
const generateKey = () => [...Array(16)]
  .map(() => Math.random().toString(36)[2])
  .join('')
  .toUpperCase();

// GET all keys
router.get('/', async (req, res) => {
  try {
    const keys = await storage.getKeys();
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new key
router.post('/', async (req, res) => {
  try {
    const days = Number(req.body.days);
    if (!days || isNaN(days)) throw new Error("Invalid days parameter");

    const newKey = {
      keyValue: generateKey(),
      expiration: new Date(Date.now() + days * 86400000).toISOString(),
      days: days
    };

    const keys = await storage.getKeys();
    keys.push(newKey);
    await storage.saveKeys(keys);

    res.status(201).json(newKey);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;