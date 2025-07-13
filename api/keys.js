import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const keys = await kv.get('keys') || [];
        return res.status(200).json(keys);

      case 'POST':
        const { days } = req.body;
        if (!days || isNaN(days)) {
          return res.status(400).json({ error: "Invalid days parameter" });
        }

        const newKey = {
          keyValue: generateKey(),
          expiration: new Date(Date.now() + days * 86400000).toISOString(),
          days: Number(days)
        };

        const currentKeys = await kv.get('keys') || [];
        currentKeys.push(newKey);
        await kv.set('keys', currentKeys);
        
        return res.status(201).json(newKey);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end();
    }
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}

function generateKey() {
  return [...Array(16)]
    .map(() => Math.random().toString(36)[2])
    .join('')
    .toUpperCase();
}
