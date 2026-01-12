const mongoose = require("mongoose");

const inventoryRequestSchema = new mongoose.Schema(
  {
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    part: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InventoryRequest",
  inventoryRequestSchema
);
