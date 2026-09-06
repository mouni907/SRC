import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { seedDemoUsers } from './seed/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDemoUsers();

  app.listen(PORT, () => {
    console.log(`[DigiClear Server] Server running on port ${PORT}`);
    console.log(`[DigiClear Server] Health endpoint: http://localhost:${PORT}/api/health`);
  });
};

startServer().catch((error) => {
  console.error(`[DigiClear Server] Startup failed: ${error.message}`);
  process.exit(1);
});
