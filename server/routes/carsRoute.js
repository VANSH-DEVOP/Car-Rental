const express = require("express");
const router = express.Router();
const Car = require("../models/carModel");
const authMiddleware = require("../middleware/authMiddleware.js");
const requireAdmin = require("../middleware/adminMiddleware");

router.get("/getallcars",authMiddleware , async (req, res) => {
  try {
    const cars = await Car.find();
    res.send(cars);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/addcar", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const newcar = new Car(req.body);
    await newcar.save();
    res.send("Car added successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/editcar", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.body._id });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    car.name = req.body.name;
    car.image = req.body.image;
    car.fuelType = req.body.fuelType;
    car.rentPerHour = req.body.rentPerHour;
    car.capacity = req.body.capacity;

    await car.save();

    res.send("Car details updated successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/deletecar", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const deleted = await Car.findOneAndDelete({ _id: req.body.carid });
    if (!deleted) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.send("Car deleted successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
