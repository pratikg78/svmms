const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// CHANGE PASSWORD (LOGGED IN)
router.put("/change-password", protect, changePassword);

// FORGOT PASSWORD (OTP FLOW)
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

module.exports = router;
