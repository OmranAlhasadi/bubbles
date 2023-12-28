const express = require("express");
const cors = require("cors");
const path = require("path");
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

/*// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't match one above
// send back the React app's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
