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

adminRouter.get(
  "/get/consumers",
  isAuthenticatedUser,
  hasRole(["admin"]),
  adminController.getAllConsumres
);

adminRouter.patch(
  "/update/status/:userId",
  isAuthenticatedUser,
  hasRole(["admin"]),
  adminController.updateUserStatus
);

adminRouter.get(
  "/get/vendors",
  isAuthenticatedUser,
  hasRole(["admin"]),
  adminController.getAllVendors
);

//* order management Routes
adminRouter.get(
  "/get/all/orders",
  isAuthenticatedUser,
  hasRole(["admin"]),
  adminController.getAllOrders
);

module.exports = adminRouter;
