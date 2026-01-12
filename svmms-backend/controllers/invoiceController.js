const Service = require("../models/Service");
const JobCard = require("../models/JobCard");
const InventoryRequest = require("../models/InventoryRequest");


// Get invoice for a completed service
exports.getInvoice = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId)
      .populate("customer", "name email")
      .populate("vehicle", "vehicleName vehicleNumber")
      .populate("assignedMechanic", "name");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.status !== "Completed") {
      return res
        .status(400)
        .json({ message: "Invoice available only for completed services" });
    }

    // 🔹 REAL LABOUR COST
    const jobCard = await JobCard.findOne({ service: service._id });
    const labourCharge = jobCard ? jobCard.laborCost || 0 : 0;

    // 🔹 REAL PARTS COST
    const approvedParts = await InventoryRequest.find({
      service: service._id,
      status: "Approved",
    }).populate("part");

    let partsCharge = 0;
    approvedParts.forEach((req) => {
      partsCharge += req.quantity * req.part.price;
    });

    const totalAmount = labourCharge + partsCharge;

    res.json({
      serviceId: service._id,
      customer: service.customer,
      vehicle: service.vehicle,
      mechanic: service.assignedMechanic,
      serviceType: service.serviceType,
      date: service.updatedAt,
      charges: {
        labour: labourCharge,
        parts: partsCharge,
        total: totalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};


const PDFDocument = require("pdfkit");




// Download invoice as PDF
exports.downloadInvoicePDF = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId)
      .populate("customer", "name email")
      .populate("vehicle", "vehicleName vehicleNumber")
      .populate("assignedMechanic", "name");

    if (!service || service.status !== "Completed") {
      return res.status(400).json({
        message: "Invoice available only for completed services",
      });
    }

          // 🔹 Fetch job card
          const jobCard = await JobCard.findOne({ service: service._id });

          const labourCharge = jobCard ? jobCard.laborCost || 0 : 0;

          // 🔹 Fetch approved inventory requests
          const approvedParts = await InventoryRequest.find({
            service: service._id,
            status: "Approved",
          }).populate("part");

          let partsCharge = 0;

          approvedParts.forEach((req) => {
            partsCharge += req.quantity * req.part.price;
          });

          const totalAmount = labourCharge + partsCharge;


    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${service._id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("SVMMS - Vehicle Service Invoice", {
      align: "center",
    });

    doc.moveDown();

    // Invoice info
    doc.fontSize(12).text(`Invoice ID: INV-${service._id.slice(-6)}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Status: Paid`);

    doc.moveDown();

    // Customer
    doc.fontSize(14).text("Customer Details", { underline: true });
    doc.fontSize(12).text(`Name: ${service.customer.name}`);
    doc.text(`Email: ${service.customer.email}`);

    doc.moveDown();

    // Vehicle
    doc.fontSize(14).text("Vehicle Details", { underline: true });
    doc.fontSize(12).text(`Vehicle: ${service.vehicle.vehicleName}`);
    doc.text(`Number: ${service.vehicle.vehicleNumber}`);

    doc.moveDown();

    // Charges
    doc.fontSize(14).text("Service Charges", { underline: true });
    doc.fontSize(12).text(`Service Type: ${service.serviceType}`);
    doc.text(`Labour Charges: ₹${labourCharge}`);
    doc.text(`Spare Parts: ₹${partsCharge}`);

    doc.moveDown();
    doc.fontSize(14).text(`Total Amount: ₹${totalAmount}`, {
      underline: true,
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Failed to download invoice" });
  }
};

exports.markInvoicePaid = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;

    // We don't store invoice separately, so just acknowledge payment
    res.json({
      message: "Payment successful",
      status: "Paid",
      serviceId,
    });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};

// Mark invoice as paid
exports.markInvoicePaid = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.status !== "Completed") {
      return res
        .status(400)
        .json({ message: "Service not completed yet" });
    }

    if (service.paymentStatus === "Paid") {
      return res
        .status(400)
        .json({ message: "Invoice already paid" });
    }

    service.paymentStatus = "Paid";
    await service.save();

    res.json({ message: "Payment successful" });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};

// Get all invoices for logged-in customer
exports.getCustomerInvoices = async (req, res) => {
  try {
    const services = await Service.find({
      customer: req.user.id,
      status: "Completed",
    })
      .populate("vehicle", "vehicleName")
      .sort({ updatedAt: -1 });

    const invoices = services.map((service) => ({
      _id: service._id,
      vehicle: service.vehicle,
      serviceType: service.serviceType,
      updatedAt: service.updatedAt,
      paymentStatus: service.paymentStatus || "Pending",
      totalAmount: 500, // labour (parts later)
    }));

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

// 🔹 Mechanic - Get invoices for completed jobs
exports.getMechanicInvoices = async (req, res) => {
  try {
    const services = await Service.find({
      assignedMechanic: req.user.id,
      status: "Completed",
    })
      .populate("vehicle", "vehicleName vehicleNumber")
      .populate("customer", "name email")
      .sort({ updatedAt: -1 });

    const invoices = services.map((service) => ({
      invoiceId: `INV-${service._id.toString().slice(-6)}`,
      serviceId: service._id,
      vehicle: service.vehicle.vehicleName,
      customer: service.customer.name,
      serviceType: service.serviceType,
      amount: service.laborCost || 0,
      date: service.updatedAt,
      status: "Paid", // payment handled by customer
    }));

    res.json(invoices);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch mechanic invoices",
    });
  }
};

//invoicepaid
exports.markInvoicePaid = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Invoice already paid" });
    }

    service.paymentStatus = "Paid";
    await service.save();

    res.json({ message: "Payment successful" });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};
