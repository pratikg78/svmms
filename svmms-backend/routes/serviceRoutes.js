const express = require("express");
const router = express.Router();
const {
  bookService,
  getMyServices,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

router.post("/book", protect, bookService);
router.get("/my", protect, getMyServices);

module.exports = router;
