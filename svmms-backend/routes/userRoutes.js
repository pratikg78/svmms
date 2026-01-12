const express = require("express");
const router = express.Router();
const {
  getProfile,
  updatePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, getProfile);
router.put("/profile/password", protect, updatePassword);

module.exports = router;