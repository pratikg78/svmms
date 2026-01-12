const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getAssignedJobs,
  getJobById,
  getDashboardData,
} = require("../controllers/mechanicController");
const { getMechanicInvoices } = require("../controllers/mechanicController");

// Dashboard stats
router.get("/dashboard", protect, getDashboardData);

// Assigned jobs list
router.get("/jobs", protect, getAssignedJobs);

// Get job details (for opening JobCard)
router.get("/jobs/:id", protect, getJobById);

//mechanic view only invoice
router.get("/invoices", protect, getMechanicInvoices);

module.exports = router;
