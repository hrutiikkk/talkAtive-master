const errorHandler = require("../Utils/ErrorHandler");
const jwt = require("jsonwebtoken");

const isAuthenticate = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(errorHandler(401, "Session timeout, Login again !!"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return next(errorHandler(401, "Session timeout, Login again !!"));
  }
};

module.exports = isAuthenticate;
