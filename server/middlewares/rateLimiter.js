const rateLimit = require("express-rate-limit");

exports.passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 password reset requests per 15mins
  message:
    "Too many password reset requests from this IP, please try again after 15 minutes",
});
