const Service = require("../models/Service");

// 🔹 Get jobs assigned to logged-in mechanic
exports.getAssignedJobs = async (req, res) => {
  try {
    const jobs = await Service.find({
      assignedMechanic: req.user.id,
    })
      .populate("customer", "name")
      .populate("vehicle", "vehicleName");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assigned jobs",
    });
  }
};

// Get single job details
exports.getJobById = async (req, res) => {
  try {
    const job = await Service.findById(req.params.id)
      .populate("customer", "name email")
      .populate("vehicle", "vehicleName vehicleNumber");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job card" });
  }
};


// Update job status
exports.completeJob = async (req, res) => {
  try {
    const job = await JobCard.findById(req.params.id).populate("service");

    if (!job) {
      return res.status(404).json({ message: "Job card not found" });
    }

    // 🔑 Update SERVICE (source of truth)
    job.service.status = "Completed";
    await job.service.save();

    // Optional: update job card
    job.status = "Completed";
    await job.save();

    res.json({ message: "Service marked as completed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to complete service" });
  }
};



//dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const mechanicId = req.user.id;

    const pending = await Service.countDocuments({
      assignedMechanic: mechanicId,
      status: "Assigned",
    });

    const inProgress = await Service.countDocuments({
      assignedMechanic: mechanicId,
      status: "In Progress",
    });

    const completed = await Service.countDocuments({
      assignedMechanic: mechanicId,
      status: "Completed",
    });

    const recentServices = await Service.find({
      assignedMechanic: mechanicId,
    })
      .populate("customer", "name")
      .populate("vehicle", "vehicleName")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      pending,
      inProgress,
      completed,
      recentServices,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load mechanic dashboard" });
  }
};


// 🔹 Get completed services (invoices) for logged-in mechanic
exports.getMechanicInvoices = async (req, res) => {
  try {
    const services = await Service.find({
      assignedMechanic: req.user.id,
      status: "Completed",
    })
      .populate("vehicle", "vehicleName vehicleNumber")
      .sort({ updatedAt: -1 });

    res.json(services);
  } catch (error) {
    console.error("MECHANIC INVOICE ERROR:", error);
    res.status(500).json({
      message: "Failed to load mechanic invoices",
    });
  }
};

//update job status
exports.updateJobStatus = async (req, res) => {
  try {
    const { tasksPerformed, laborCost, status } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.tasksPerformed = tasksPerformed;
    service.laborCost = laborCost;

    if (status) {
      service.status = status;
    }

    await service.save();

    res.json({ message: "Job updated successfully" });
  } catch {
    res.status(500).json({ message: "Failed to update job" });
  }
};
