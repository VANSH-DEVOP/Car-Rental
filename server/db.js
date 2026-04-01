const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connectDB() {
  const url = process.env.MONGO_URL;
  if (!url || url.includes('your_user') || url.includes('your_password')) {
    console.error(
      'Set MONGO_URL in server/.env to your real MongoDB URI (MongoDB Atlas → Connect → Drivers).'
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(url);
  } catch (err) {
    const msg = String(err.message || err);
    console.error('MongoDB connection failed:', msg);
    if (/bad auth|authentication failed/i.test(msg)) {
      console.error(
        'Auth failed: wrong username/password in MONGO_URL, or password needs URL-encoding (@ # / : → %40 %23 %2F %3A). Reset the DB user password in Atlas → Database Access.'
      );
    } else if (/querySrv|EREFUSED|ENOTFOUND/i.test(msg)) {
      console.error(
        'DNS/network: check Wi‑Fi/VPN, or use the standard (non-SRV) connection string from Atlas.'
      );
    }
    process.exit(1);
  }

  console.log('MongoDB Connection Successful');
  try {
    await require('./seed').runSeed();
  } catch (err) {
    console.error('Seed failed:', err.message);
  }
}

module.exports = connectDB;
