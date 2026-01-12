const express = require("express");
const router = express.Router();
const { getMyServices } = require("../controllers/customerController");
const { protect } = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/customerController");
const { getProfile } = require("../controllers/customerController");

//profile
router.get("/profile", protect, getProfile);

//daSHBOARD
router.get("/dashboard", protect, getDashboardStats);

// Customer service history
router.get("/services", protect, getMyServices);

module.exports = router;
