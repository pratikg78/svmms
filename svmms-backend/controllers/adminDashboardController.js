const User = require("../models/User");
const Service = require("../models/Service");

exports.getAdminDashboard = async (req, res) => {
  try {
    // USERS
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalMechanics = await User.countDocuments({ role: "mechanic" });

    // SERVICES
    const activeServices = await Service.countDocuments({
      status: { $ne: "Completed" },
    });

    // REVENUE (only PAID services)
    const completedServices = await Service.find({
      status: "Completed",
      paymentStatus: "Paid",
    });

    const totalRevenue = completedServices.reduce(
      (sum, svc) => sum + (svc.totalAmount || 0),
      0
    );

    // RECENT SERVICES (latest 5)
    const recentServices = await Service.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name")
      .populate("vehicle", "vehicleName");

    res.json({
      stats: {
        totalCustomers,
        totalMechanics,
        activeServices,
        totalRevenue,
      },
      recentServices: recentServices.map((s) => ({
        _id: s._id,
        customer: s.customer?.name || "—",
        vehicle: s.vehicle?.vehicleName || "—",
        serviceType: s.serviceType,
        status: s.status,
      })),
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to load admin dashboard" });
  }
};
