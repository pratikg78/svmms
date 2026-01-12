const express = require("express");
const router = express.Router();

const {
  getInventory,
  addInventory,
} = require("../controllers/inventoryController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// GET all inventory (Admin only + Mechanic)
router.get("/", protect, getInventory);        
 

// ADD inventory item (Admin only)
router.post("/add", protect, adminOnly, addInventory);


module.exports = router;
