const express = require("express");
const router = express.Router();
const {
  getAllServices,
  getAllMechanics,
  assignMechanic,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { getAdminDashboard } = require("../controllers/adminDashboardController");
const {
  getAllUsers,
  toggleUserStatus,
} = require("../controllers/adminController");
const { getAllInvoices } = require("../controllers/adminController");
const { getAdminReports } = require("../controllers/adminController");

//  Admin protected routes
router.get("/services", protect, getAllServices);
router.get("/mechanics", protect, getAllMechanics);
router.put("/services/assign/:id", protect, assignMechanic);

router.get("/dashboard", protect, getAdminDashboard);

router.get("/users", protect, getAllUsers);
router.put("/users/:id/toggle", protect, toggleUserStatus);

router.get("/invoices", protect, getAllInvoices);

router.get("/reports", protect, getAdminReports);


module.exports = router;
