const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const cookieParser = require("cookie-parser");
const { createRouteHandler } = require("uploadthing/express");
const { uploadRouter } = require("./services/uploadthing");

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // Load from .env for development
} else {
  require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` }); // Load from .env.production for production
}

const app = express();
connectDB();

// Update CORS options to reflect origin and credentials
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true, // to allow sending cookies and auth headers
};

// Accept client requests requests
app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());

//image upload

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      callbackUrl: `${process.env.NGROK_DOMAIN}/api/uploadthing`,
      uploadthingId: process.env.UPLOADTHING_APP_ID,
      uploadthingSecret: process.env.UPLOADTHING_SECRET,
    },
  })
);

app.use(express.json());
const authMiddleware = require("./middlewares/authMiddleware");

// Routes

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

//Token check

//app.use(authMiddleware);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

// Serve static files from the React app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
