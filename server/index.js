const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { createRouteHandler } = require("uploadthing/express");
const { uploadRouter } = require("./services/uploadthing");

const app = express();
connectDB();

// Update CORS options to reflect origin and credentials
const corsOptions = {
  origin: process.env.CLIENT_URL, //  change env when deploying
  credentials: true, // to allow sending cookies and auth headers
};

app.use(cors(corsOptions));

// Accept client requests requests
app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());

app.use(express.json());
const authMiddleware = require("./middlewares/authMiddleware");

// Routes

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

//image upload

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      uploadthingId: process.env.UPLOADTHING_APP_ID,
      uploadthingSecret: process.env.UPLOADTHING_SECRET,
    },
  })
);

//Token check

app.use(authMiddleware);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

/*// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't match one above
// send back the React app's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
