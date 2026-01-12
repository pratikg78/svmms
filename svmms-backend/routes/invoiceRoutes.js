const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");


const {
  getInvoice,
  downloadInvoicePDF,
  markInvoicePaid,
  getCustomerInvoices,
} = require("../controllers/invoiceController");

const { getMechanicInvoices } = require("../controllers/invoiceController");

// LIST invoices (THIS WAS MISSING)
router.get("/", protect, getCustomerInvoices);

// SINGLE invoice
router.get("/:serviceId", protect, getInvoice);

// PDF
router.get("/:serviceId/pdf", protect, downloadInvoicePDF);

// Pay
router.put("/:serviceId/pay", protect, markInvoicePaid);

//MechanicInvoicesList
router.get("/mechanic", protect, getMechanicInvoices);

module.exports = router;
