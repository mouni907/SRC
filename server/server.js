import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[DigiClear Server] Server running on port ${PORT}`);
  console.log(`[DigiClear Server] Health endpoint: http://localhost:${PORT}/api/health`);
});
