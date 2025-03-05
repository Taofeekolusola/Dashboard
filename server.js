require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const connectDB = require("./db");

const app = express();

// ✅ Ensure the 'uploads' folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS
app.use("/uploads", express.static(uploadDir)); // Serve uploaded files

// ✅ Connect to MongoDB
connectDB()

// ✅ Import and use routes
const adminRoutes = require("./routes/admin.routes");
const savingsRoutes = require("./routes/savings-plan.routes");
const investmentRoutes = require("./routes/investments.routes");
const transactionRoutes = require("./routes/transactions.routes");
app.use("/users", adminRoutes);
app.use("/savings-plan", savingsRoutes);
app.use("/investments", investmentRoutes);
app.use("/transactions", transactionRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));