import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import app from './server/app.js';
import connectDB from './server/config/db.js';
import { seedDemoUsers } from './server/seed/seed.js';

dotenv.config();
const PORT = 3000;

async function startServer() {
  const db = await connectDB();

  if (db) {
    await seedDemoUsers();
  } else {
    console.log('[DigiClear] Running in demo mode without MongoDB. Auth data is loaded in-memory for local preview.');
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DigiClear] Server & Client running on port ${PORT}`);
    console.log(`[DigiClear] Health check available at /api/health`);
  });
}

startServer().catch((error) => {
  console.error(`[DigiClear] Startup failed: ${error.message}`);
  process.exit(1);
});
