const fs = require('fs').promises;
const path = require('path');

// Vercel Production Mode
if (process.env.VERCEL) {
  const { kv } = require('@vercel/kv');
  module.exports = {
    getKeys: async () => await kv.get('keys') || [],
    saveKeys: async (keys) => await kv.set('keys', keys)
  };
} 
// Local Development Mode
else {
  const STORAGE_PATH = path.join(__dirname, '../keys.json');

  const ensureStorage = async () => {
    try {
      await fs.access(STORAGE_PATH);
    } catch {
      await fs.writeFile(STORAGE_PATH, '[]');
    }
  };

  module.exports = {
    getKeys: async () => {
      await ensureStorage();
      const data = await fs.readFile(STORAGE_PATH, 'utf8');
      return JSON.parse(data);
    },
    saveKeys: async (keys) => {
      await ensureStorage();
      await fs.writeFile(STORAGE_PATH, JSON.stringify(keys, null, 2));
    }
  };
}