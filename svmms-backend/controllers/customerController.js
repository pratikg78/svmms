const Service = require("../models/Service");

// Get service history for logged-in customer
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({
      customer: req.user.id,
    })
      .populate("vehicle", "vehicleName vehicleNumber")
      .populate("assignedMechanic", "name")
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch service history",
    });
  }
};


const Vehicle = require("../models/Vehicle");

// Customer dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalVehicles = await Vehicle.countDocuments({
      user: userId,
    });

    const totalServices = await Service.countDocuments({
      customer: userId,
    });

    const pendingServices = await Service.countDocuments({
      customer: userId,
      status: { $ne: "Completed" },
    });

    const completedServices = await Service.countDocuments({
      customer: userId,
      status: "Completed",
    });

    res.json({
      totalVehicles,
      totalServices,
      pendingServices,
      completedServices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};


// Get logged-in customer profile
const User = require("../models/User");

// Get logged-in customer profile (FULL DATA)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load profile",
    });
  }
};

