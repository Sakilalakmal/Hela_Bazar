const express = require("express");
const vendorController = require("../controllers/vendor_controller");
const isAuthenticatedUser = require("../middlewares/auth_user");
const { upload } = require("../service/cloudinary");
const hasRole = require("../middlewares/has_role_middleware");
const vendorRouter = express.Router();

vendorRouter.post(
  "/vendor/apply",
  isAuthenticatedUser,
  upload.fields([
    { name: "shopImages", maxCount: 5 },
    { name: "productImages", maxCount: 10 },
  ]),
  vendorController.createVendorApplication
);

//! get user profile details
vendorRouter.get(
  "/vendor/profile/details",
  isAuthenticatedUser,
  vendorController.getVendorProfileDetailsFromApplication
);

vendorRouter.put(
  "/vendor/update",
  isAuthenticatedUser,
  hasRole(["vendor"]),
  upload.fields([
    { name: "shopImages", maxCount: 5 },
    { name: "productImages", maxCount: 10 },
  ]),
  vendorController.updateVendorProfile
);

//get all order for specific vendor have
vendorRouter.get(
  "/vendor/orders",
  isAuthenticatedUser,
  hasRole(["vendor"]),
  vendorController.getVendorOrder
);

module.exports = vendorRouter;
