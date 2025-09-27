const asyncHandler = require("express-async-handler");
const VendorApplication = require("../model/vendor_application_form");
const User = require("../model/user_model");
const Order = require("../model/order_model");

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

  getAllConsumres: asyncHandler(async (req, res) => {
    try {
      const allUsers = await User.find({ role: "consumer" }).select(
        "-password"
      );
      if (!allUsers) {
        res.status(400).json({
          message: "There isn't any users ...",
        });
      }

      res.status(200).json({
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

  getAllVendors: asyncHandler(async (req, res) => {
    try {
      const allVendors = await User.find({ role: "vendor" }).select(
        "-password"
      );

      if (!allVendors) {
        res.status(400).json({
          message: "There aren't any vendors yet coming soon ...",
        });
      }

      res.status(200).json({
        message: "Vendors fetch succesfully",
        allVendors,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }),

  updateUserStatus: asyncHandler(async (req, res) => {
    try {
      const { userId } = req.params;
      const { active } = req.body; // This should be "active"

      if (!["active", "inactive", "banned"].includes(active)) {
        return res.status(400).json({
          message: "Enter valid status",
        });
      }

      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "This user doesn't exist in system",
        });
      }

      user.active = active;
      await user.save();

      res.status(200).json({
        message: "Status updated successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }),

  //*order management
  //! 1 . get all orders
  //! 2 . see specific order details

  getAllOrders: asyncHandler(async (req, res) => {
    try {
      const allOrders = await Order.find();

      if (!allOrders) {
        res.status(400).json({
          message: "There isn't any order yet",
        });
      }

      res.status(200).json({
        message: " Got All Orders We have",
        orderCount: allOrders.length,
        allOrders,
      });
    } catch (error) {
      res.status(400).json({
        message: "Something wrong here",
        error: error.message,
      });
    }
  }),
};

module.exports = adminController;
