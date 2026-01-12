const JobCard = require("../models/JobCard");
const Service = require("../models/Service");

// Get job card by service ID
exports.getJobCard = async (req, res) => {
  try {
    const job = await JobCard.findOne({ service: req.params.id })
      .populate("service")
      .populate("mechanic", "name");

    if (!job) {
      return res.status(404).json({ message: "Job card not found" });
    }

    res.json(job);
  } catch {
    res.status(500).json({ message: "Failed to load job card" });
  }
};

// Update job card (save / complete)
exports.updateJobCard = async (req, res) => {
  try {
    const { tasksPerformed, laborCost, status } = req.body;

    const job = await JobCard.findOne({ service: req.params.id });
    if (!job) {
      return res.status(404).json({ message: "Job card not found" });
    }

    job.tasksPerformed = tasksPerformed;
    job.laborCost = laborCost;

    if (status === "Completed") {
      job.status = "Completed";

      // 🔁 Sync service status
      await Service.findByIdAndUpdate(job.service, {
        status: "Completed",
        laborCost,
      });
    }

    await job.save();

    res.json({ message: "Job card updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update job card",
      error: error.message,
    });
  }
};
