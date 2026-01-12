const InventoryRequest = require("../models/InventoryRequest");
const Inventory = require("../models/Inventory");
// MECHANIC → create request
exports.createRequest = async (req, res) => {
const { partId, quantity, serviceId } = req.body;

  if (!partId || !quantity) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const request = await InventoryRequest.create({
      mechanic: req.user.id,
      part: partId,
      quantity,
      service: serviceId,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to create request" });
  }
};

// MECHANIC → view own requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await InventoryRequest.find({
      mechanic: req.user.id,
    })
      .populate("part", "partName")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to load requests" });
  }
};




// ADMIN → view all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await InventoryRequest.find()
      .populate("mechanic", "name email")
      .populate("part", "partName quantity price")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to load requests" });
  }
};

// ADMIN → approve or reject request
exports.updateRequestStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const request = await InventoryRequest.findById(req.params.id)
      .populate("part");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // If approving → deduct stock
    if (status === "Approved") {
      if (request.part.quantity < request.quantity) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }

      request.part.quantity -= request.quantity;
      await request.part.save();
    }

    request.status = status;
    await request.save();

    res.json({ message: "Request updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update request" });
  }
};
