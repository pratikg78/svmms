const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    serviceType: {
      type: String,
      required: true,
    },

    preferredDate: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
    },

    status: {
      type: String,
      status: {
        type: String,
        enum: ["Pending", "Assigned", "InProgress", "Completed"],
        default: "Pending",
      },

        default: "Pending",
      },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
      
    assignedMechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
      
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
