const express = require("express");
const cors = require("cors");
require("dotenv").config(); // MUST be before connectDB
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const customerRoutes = require("./routes/customerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();

// ✅ Connect Database
connectDB();

// ✅ Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mechanic", mechanicRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/customer/invoice", invoiceRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/inventory-request", require("./routes/inventoryRequestRoutes"));
app.use("/api/jobcard", require("./routes/jobCardRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/test", require("./routes/testEmail"));

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("SVMMS Backend is running successfully");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
