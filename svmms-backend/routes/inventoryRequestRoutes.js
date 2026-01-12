const express = require("express");
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
} = require("../controllers/inventoryRequestController");

const { protect } = require("../middleware/authMiddleware");

// Mechanic
router.post("/request", protect, createRequest);
router.get("/my", protect, getMyRequests);

// Admin
router.get("/all", protect, getAllRequests);
router.put("/:id", protect, updateRequestStatus);

module.exports = router;
