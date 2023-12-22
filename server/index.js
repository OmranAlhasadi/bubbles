const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
connectDB();

// Middleware
app.use(express.json());
const authMiddleware = require("./middlewares/authMiddleware");

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api", authMiddleware, userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
