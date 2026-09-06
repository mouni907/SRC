import User from '../models/User.js';
import { USERS } from '../controllers/authController.js';

export const seedDemoUsers = async () => {
  await Promise.all(USERS.map((user) => User.updateOne(
    { id: user.id },
    { $set: user },
    { upsert: true }
  )));

  console.log(`[Seed] ${USERS.length} demo users available in MongoDB`);
};

export default seedDemoUsers;
