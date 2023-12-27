const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
connectDB();

// Accept all requests
app.use(cors());

// Middleware
app.use(express.json());
const authMiddleware = require("./middlewares/authMiddleware");

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

const postRoutes = require("./routes/postRoutes");
app.use("/api", postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
