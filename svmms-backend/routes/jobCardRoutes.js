const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

//  IMPORTANT: names MUST match controller exports
const {
  getJobCard,
  updateJobCard,
} = require("../controllers/jobCardController");

// Get job card by service ID
router.get("/:id", protect, getJobCard);

// Save / complete job card
router.put("/:id", protect, updateJobCard);

module.exports = router;
