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
};

module.exports = adminController;
