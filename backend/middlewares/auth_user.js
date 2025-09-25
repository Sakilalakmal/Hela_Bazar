const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const isAuthenticatedUser = async (req, resizeBy, next) => {
  try {
    const headerObj = req.headers;

    if (!headerObj.authorization) {
      return res.status(401).json({
        message: "Unauthorized , please login to access this resource",
      });
    }

    const token = headerObj.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized , please login to access this resource",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Unauthorized , please login to access this resource",
    });
  }
};

module.exports = isAuthenticatedUser;
