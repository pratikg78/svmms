const Service = require("../models/Service");

// CUSTOMER → BOOK SERVICE

exports.bookService = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    const { vehicleId, serviceType, preferredDate, notes } = req.body;

    if (!vehicleId || !serviceType || !preferredDate) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const service = await Service.create({
      customer: req.user.id,
      vehicle: vehicleId,
      serviceType,
      preferredDate,
      notes,
    });

    res.status(201).json({
      message: "Service booked successfully",
      service,
    });
  } catch (error) {
    console.error("SERVICE BOOKING ERROR:", error);

    res.status(500).json({
      message: "Failed to book service",
      error: error.message,
    });
  }
};

// CUSTOMER → VIEW MY SERVICES
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ customer: req.user.id })
      .populate("vehicle", "vehicleName vehicleNumber")
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch services",
    });
  }
};
