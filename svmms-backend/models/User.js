const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "mechanic", "admin"],
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // 🔹 Admin → Manage Users
    isActive: {
      type: Boolean,
      default: true,
    },

    // 🔹 Forgot Password (OTP-based)
    resetOTP: String,
    resetOTPExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
