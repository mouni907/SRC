import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    system: 'DigiClear - Automated No-Dues & Digital Clearance System',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/certificate', certificateRoutes);

export default app;
