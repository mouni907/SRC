import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    system: 'DigiClear - Automated No-Dues & Digital Clearance System',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);

export default app;
