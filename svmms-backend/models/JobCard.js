const mongoose = require("mongoose");

const jobCardSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasksPerformed: {
      type: String,
      default: "",
    },
    laborCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Assigned", "In Progress", "Completed"],
      default: "Assigned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobCard", jobCardSchema);
