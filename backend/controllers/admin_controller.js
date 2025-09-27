const asyncHandler = require("express-async-handler");
const VendorApplication = require("../model/vendor_application_form");
const User = require("../model/user_model");

const adminController = {
  vendorApproved: asyncHandler(async (req, res) => {
    try {
      const { applicationId } = req.params;

      const application = await VendorApplication.findById(applicationId);
      if (!application) {
        res.status(404).json({ message: "Application not found" });
      }

      application.status = "approved";
      await application.save();

      await User.findByIdAndUpdate(application.userId, { role: "vendor" });
      res
        .status(200)
        .json({ message: "Vendor application approved", application });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }),

  vendorRejected: asyncHandler(async (req, res) => {
    try {
      const { applicationId } = req.params;

      const application = await VendorApplication.findById(applicationId);
      if (!application) {
        res.status(404).json({ message: "Application not found" });
      }

      application.status = "rejected";
      await application.save();

      res
        .status(200)
        .json({ message: "Vendor application rejected", application });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }),

  getAllUsers: asyncHandler(async (req, res) => {
    try {
      const allUsers = await User.find();
      if (!allUsers) {
        res.status(400).json({
          message: "There isn't any users ...",
        });
      }

      res.status(201).json({
        message: "Fetch All users successfully",
        allUsers,
      });
    } catch (error) {
      res.status(400).json({
        message: "something wrong here",
        error: error.message,
      });
    }
  }),
};

module.exports = adminController;
