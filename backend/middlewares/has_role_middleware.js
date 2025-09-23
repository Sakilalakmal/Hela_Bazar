// Middleware to check if the user has the required role
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient role" });
    }
    next(); // Proceed if the role matches
  };
};

module.exports = hasRole;
