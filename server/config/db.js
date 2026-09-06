// server/config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.connection.on('error', (error) => {
    console.error('[DigiClear DB] MongoDB connection error:', error.message);
  });

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });

  console.log(`[DigiClear DB] Connected to ${mongoose.connection.name}`);
  return mongoose.connection;
};

export default connectDB;
