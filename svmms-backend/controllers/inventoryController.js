const Inventory = require("../models/Inventory");

// GET inventory
exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};

// ADD inventory
exports.addInventory = async (req, res) => {
  const { partName, quantity, price } = req.body;

  if (!partName || !quantity || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const item = await Inventory.create({
      partName,
      quantity,
      price,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to add inventory item" });
  }
};
