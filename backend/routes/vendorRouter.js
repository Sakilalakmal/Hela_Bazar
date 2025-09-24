const express = require("express");
const vendorController = require("../controllers/vendor_controller");
const isAuthenticatedUser = require("../middlewares/auth_user");
const { upload } = require("../service/cloudinary");
const hasRole = require("../middlewares/has_role_middleware");
const vendorRouter = express.Router();

vendorRouter.post("/vendor/apply",isAuthenticatedUser,upload.fields([
    {name:'shopImages',maxCount:5},
    {name:'productImages',maxCount:10}
]) ,vendorController.createVendorApplication);

vendorRouter.put('/vendor/update',isAuthenticatedUser,hasRole(['vendor']),upload.fields([
    {name:'shopImages',maxCount:5},
    {name:'productImages',maxCount:10}
]),vendorController.updateVendorApplication);


module.exports = vendorRouter;
