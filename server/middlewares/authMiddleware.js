const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  /* console.log("Token received:", token); */ // Check what token is received
  if (!token || token === undefined)
    return res
      .status(401)
      .json({
        message:
          "Invalid or expired token please log in again and enable cookies in your browser if disabled (token expires in 1 hour from logging in)",
      });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    /* console.log("Decoded token:", verified); */ // See the decoded token
    req.userId = verified.userId;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
