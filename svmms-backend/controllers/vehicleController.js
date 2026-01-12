const Vehicle = require("../models/Vehicle");

// ADD VEHICLE
exports.addVehicle = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    const {
      vehicleName,
      vehicleNumber,
      model,
      year,
      fuelType,
      engineType,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const vehicle = await Vehicle.create({
      user: req.user.id,
      vehicleName,
      vehicleNumber,
      model,
      year,
      fuelType,
      engineType,
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error("ADD VEHICLE ERROR:", error);

    res.status(500).json({
      message: "Failed to add vehicle",
      error: error.message,
    });
  }
};


// GET USER VEHICLES
exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user.id });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicles", error });
  }
};
