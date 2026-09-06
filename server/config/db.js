// server/config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('[DigiClear DB] MONGODB_URI is not configured; continuing in demo mode without MongoDB.');
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.connection.on('error', (error) => {
    console.error('[DigiClear DB] MongoDB connection error:', error.message);
  });

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`[DigiClear DB] Connected to ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    console.warn('[DigiClear DB] MongoDB is unavailable; continuing in demo mode without a database.', error.message);
    return null;
  }
};

export default connectDB;
