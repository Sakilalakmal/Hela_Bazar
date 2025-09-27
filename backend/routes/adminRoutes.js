const express = require("express");
const isAuthenticatedUser = require("../middlewares/auth_user");
const hasRole = require("../middlewares/has_role_middleware");
const adminController = require("../controllers/admin_controller");
const adminRouter = express.Router();

adminRouter.post(
  "/approve/vendor/:applicationId",
  isAuthenticatedUser,
  hasRole(["admin"]),
  adminController.vendorApproved
);

adminRouter.post(
  "/reject/vendor/:applicationId",
  isAuthenticatedUser,
  hasRole(["admin"]),
  adminController.vendorRejected
);

module.exports = adminRouter;
