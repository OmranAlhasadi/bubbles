const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token received:", token); // Check what token is received
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", verified); // See the decoded token
    req.userId = verified.userId;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).send("Invalid Token");
  }
};

module.exports = authMiddleware;
