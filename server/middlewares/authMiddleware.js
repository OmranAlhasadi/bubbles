const authMiddleware = (req, res, next) => {
  //authentication logic
  next();
};

module.exports = authMiddleware;
