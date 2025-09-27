const asyncHandler = require("express-async-handler");
const VendorApplication = require("../model/vendor_application_form");
const User = require("../model/user_model");
const Order = require("../model/order_model");
const Product = require("../model/product_model");

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

  getSpecificOrderDetails: asyncHandler(async(req,res)=>{
      try {
        const {orderId} = req.params;

        //? check if orderId exists in order collection
        const order = await Order.findById(orderId);
        if(!order){
          res.status(400).json({
            message:"This order didn't exist in orders try again"
          });
        }

        //? if it is exists send that specific order details to frontend
        res.status(200).json({
          message:"Here the Order details ...",
          order,
        });
      } catch (error) {
        res.status(400).json({
          message:"something Wrong here",
          error:error.message,
        });
      }
  }),

  //* product management
  //! 1.get all products
  //! 2. delete product if there are any issues

  getAllProducts:asyncHandler(async(req,res)=>{
    try {
      // getting all product from product collections
      const products = await Product.find();
      if(!products){
        res.status(400).json({
          message:"There aren't any products to show .."
        });
      }

      //if there are product in product collection send it
      res.status(200).json({
        message:"Here The Our All Products",
        productCount:products.length,
        products,
      });
    } catch (error) {
      res.status(400).json({
        message:"Something Wrong here",
        error:error.message,
      });
    }
  }),
};

module.exports = adminController;
