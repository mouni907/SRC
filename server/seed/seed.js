import mongoose from 'mongoose';
import User from '../models/User.js';
import { USERS } from '../controllers/authController.js';

export const seedDemoUsers = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('[Seed] MongoDB is not connected; skipping demo user seeding.');
    return;
  }

  try {
    await Promise.all(USERS.map((user) => User.updateOne(
      { id: user.id },
      { $set: user },
      { upsert: true }
    )));

    console.log(`[Seed] ${USERS.length} demo users available in MongoDB`);
  } catch (error) {
    console.warn('[Seed] Demo user seeding skipped because MongoDB is unavailable.', error.message);
  }
};

export default seedDemoUsers;
