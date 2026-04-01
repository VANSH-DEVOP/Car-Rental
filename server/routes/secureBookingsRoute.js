const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")("");
const authMiddleware = require("../middleware/authMiddleware.js");

// Book a car (requires authentication).
router.post("/bookcar", authMiddleware, async (req, res) => {
  const { token } = req.body;
  try {
    // Never trust the client-provided user id; bind booking to the JWT subject.
    req.body.user = req.user._id;

    req.body.transactionId = token.id; // payment.source.id (Stripe)
    const newbooking = new Booking(req.body);
    await newbooking.save();

    const car = await Car.findOne({ _id: req.body.car });
    if (!car) {
      return res.status(400).json({ message: "Invalid car id" });
    }

    car.bookedTimeSlots.push(req.body.bookedTimeSlots);
    await car.save();
    res.send("Your booking is successfull");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(400).json(error);
  }
});

// List bookings (requires authentication).
// Admins see all bookings; normal users only see their own.
router.get("/getallbookings", authMiddleware, async (req, res) => {
  try {
    const filter = req.user.isAdmin ? {} : { user: req.user._id };
    const bookings = await Booking.find(filter).populate("car");
    return res.send(bookings);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;

