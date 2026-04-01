const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const connectDB = require('./db');
const app = express();
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/cars/', require('./routes/carsRoute'));
app.use('/api/users/', require('./routes/usersRoute'));
app.use('/api/bookings/', require('./routes/secureBookingsRoute'));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
  });
}

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Node JS Server Started on Port ${port}`));
  })
  .catch(() => process.exit(1));
