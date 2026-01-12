
const express = require("express");
const router = express.Router();

const {
  addVehicle,
  getMyVehicles,
} = require("../controllers/vehicleController");

const { protect } = require("../middleware/authMiddleware");


// ADD VEHICLE
router.post("/add", protect, addVehicle);

// GET MY VEHICLES
router.get("/my", protect, getMyVehicles);

module.exports = router;
