// Creates the default dashboard admin (or restores admin rights if the account exists).
// usage: npm run create-admin
// Change the email and password afterwards from Dashboard > Profile.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const ADMIN = {
  name: 'Admin',
  email: 'admin@gmail.com',
  password: 'admin123',
};

async function run() {
  await connectDB();
  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    existing.role = 'admin';
    existing.active = true;
    await existing.save();
    console.log(`Admin already exists: ${ADMIN.email} (role ensured, password unchanged)`);
  } else {
    await User.create({ ...ADMIN, role: 'admin' });
    console.log(`Admin created: ${ADMIN.email}`);
  }
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
