const Car = require('./models/carModel');
const User = require('./models/userModel');
const bcrypt = require("bcrypt");
const util = require("util");

const genSaltAsync = util.promisify(bcrypt.genSalt);
const hashAsync = util.promisify(bcrypt.hash);

const DEMO_CARS = [
  {
    name: 'Tesla Model 3',
    image:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    capacity: 5,
    fuelType: 'Electric',
    rentPerHour: 45,
    bookedTimeSlots: [],
  },
  {
    name: 'BMW 3 Series',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    capacity: 5,
    fuelType: 'Petrol',
    rentPerHour: 38,
    bookedTimeSlots: [],
  },
  {
    name: 'Mercedes C-Class',
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    capacity: 5,
    fuelType: 'Diesel',
    rentPerHour: 42,
    bookedTimeSlots: [],
  },
  {
    name: 'Ford Mustang',
    image:
      'https://images.unsplash.com/photo-1584345604476-8ec5e82e8aa5?auto=format&fit=crop&w=800&q=80',
    capacity: 4,
    fuelType: 'Petrol',
    rentPerHour: 55,
    bookedTimeSlots: [],
  },
  {
    name: 'Toyota Camry Hybrid',
    image:
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    capacity: 5,
    fuelType: 'Hybrid',
    rentPerHour: 32,
    bookedTimeSlots: [],
  },
  {
    name: 'Honda CR-V',
    image:
      'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80',
    capacity: 7,
    fuelType: 'Petrol',
    rentPerHour: 36,
    bookedTimeSlots: [],
  },
];

async function seedDemoCars() {
  const n = await Car.countDocuments();
  if (n > 0) return;
  await Car.insertMany(DEMO_CARS);
  console.log(`Seeded ${DEMO_CARS.length} demo cars (collection was empty).`);
}

async function ensureAdminFromEnv() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    console.log(
      'Tip: set ADMIN_USERNAME and ADMIN_PASSWORD in server/.env to create/update an admin user.'
    );
    return;
  }
  const existing = await User.findOne({ username });
  const salt = await genSaltAsync(10);
  const hashedPassword = await hashAsync(password, salt);
  if (existing) {
    existing.password = hashedPassword;
    existing.isAdmin = true;
    await existing.save();
  } else {
    await User.create({ username, password: hashedPassword, isAdmin: true });
  }
  console.log(
    `Admin user "${username}" is ready. Log out and log in again to refresh admin access in the app.`
  );
}

async function runSeed() {
  await seedDemoCars();
  await ensureAdminFromEnv();
}

module.exports = { runSeed };
