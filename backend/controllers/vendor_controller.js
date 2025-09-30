const asyncHandler = require("express-async-handler");
const VendorApplication = require("../model/vendor_application_form");
const User = require("../model/user_model");
const Order = require("../model/order_model");

const vendorController = {
  createVendorApplication: asyncHandler(async (req, res) => {
    const {
      businessName,
      taxId,
      category,
      certifications,
      businessDescription,
      contactPerson,
      businessAddress,
      businessRegistrationNumber,
      storeType,
      paymentDetails,
      socialMediaLinks,
      preferredShippingMethods,
    } = req.body;
    const userId = req.user.id;

    //handle images logics
    const shopImages = req.files.shopImages.map((file) => file.path);
    const productImages = req.files.productImages.map((file, index) => ({
      title: req.body[`productTitle_${index}`],
      description: req.body[`productDescription_${index}`],
      images: [file.path],
    }));

    //validations
    if (
      !businessName ||
      !taxId ||
      !category ||
      !businessDescription ||
      !contactPerson ||
      !businessAddress ||
      !businessRegistrationNumber ||
      !storeType ||
      !paymentDetails ||
      !socialMediaLinks ||
      !preferredShippingMethods
    ) {
      res.status(400);
      throw new Error("Please fill all required fields");
    }

    if (req.user.role !== "consumer") {
      return res.status(400).json({
        message: "Only consumers can apply to be vendors",
      });
    }

    try {
      const newApplication = new VendorApplication({
        userId,
        businessName,
        taxId,
        category,
        certifications,
        businessDescription,
        contactPerson,
        businessAddress,
        businessRegistrationNumber,
        storeType,
        paymentDetails,
        socialMediaLinks,
        preferredShippingMethods,
        shopImages,
        initialProductList: productImages,
      });

      await newApplication.save();

      res.status(201).json({
        message:
          "Vendor application submitted successfully waiting for admin approval",
        application: newApplication,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error submitting application",
      });
    }
  }),

  getVendorProfileDetailsFromApplication: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId).select(
        "username email role createdAt"
      );
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      //find vendor Application to get vendor id
      const vendorApplication = await VendorApplication.findOne({
        userId,
      }).populate("userId", "username email role");
      if (!vendorApplication) {
        return res.status(404).json({
          message: "Vendor application not found",
        });
      }

      res.status(200).json({
        message: "Vendor profile details fetched successfully",
        vendorProfile,
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error While fetching vendor profile details",
        error: error.message,
      });
    }
  }),

  updateVendorProfile: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    //find vendor current profile
    const vendorProfile = await VendorApplication.findOne({ userId });
    if (!vendorProfile) {
      res.status(400).json({
        message: "Vendor profile not found for this user",
      });
    }

    //desctruture req.body
    const {
      businessName,
      taxId,
      category,
      certifications,
      businessDescription,
      contactPerson,
      businessAddress,
      businessRegistrationNumber,
      storeType,
      paymentDetails,
    } = req.body;

    //handle images logics
    const shopImages = req.files?.shopImages
      ? req.files.shopImages.map((file) => file.path)
      : vendorProfile.shopImages;

    //handle product details with images
    const productImages = req.files?.productImages
      ? req.files.productImages.map((file, index) => ({
          title: req.body[`productTitle_${index}`],
          description: req.body[`productDescription_${index}`],
          images: [file.path],
        }))
      : vendorProfile.initialProductList;

    //update vendor profile
    vendorProfile.businessName = businessName || vendorProfile.businessName;
    vendorProfile.taxId = taxId || vendorProfile.taxId;
    vendorProfile.category = category || vendorProfile.category;
    vendorProfile.certifications =
      certifications || vendorProfile.certifications;
    vendorProfile.businessDescription =
      businessDescription || vendorProfile.businessDescription;
    vendorProfile.contactPerson = contactPerson || vendorProfile.contactPerson;
    vendorProfile.businessAddress =
      businessAddress || vendorProfile.businessAddress;
    vendorProfile.businessRegistrationNumber =
      businessRegistrationNumber || vendorProfile.businessRegistrationNumber;
    vendorProfile.storeType = storeType || vendorProfile.storeType;
    vendorProfile.paymentDetails =
      paymentDetails || vendorProfile.paymentDetails;
    vendorProfile.shopImages = shopImages; // Updated shop images
    vendorProfile.initialProductList = productImages; // Updated product images

    //save new vendor profile
    await vendorProfile.save();

    res.status(200).json({
      message: "Vendor profile updated successfully",
      vendorProfile,
    });
  }),

  getVendorOrder: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;

      //find vendor Application to get vendor id
      const vendorApplication = await VendorApplication.findOne({ userId });
      if (!vendorApplication) {
        return res.status(404).json({
          message: "Vendor application not found",
        });
      }

      //declare vendor Id for future usage
      const vendorId = vendorApplication.userId;

      //fetch order for this vendor
      const vendorOrders = await Order.find({ "products.vendorId": vendorId })
        .populate("customerId", "username email")
        .populate("products.productId", "name price image")
        .populate("products.vendorId", "name email")
        .sort({ createdAt: -1 });

      if (!vendorOrders || vendorOrders.length === 0) {
        return res.status(404).json({
          message: "No orders found for your products yet",
        });
      }

      res.status(200).json({
        message: "Vendor orders fetched successfully",
        orders: vendorOrders,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching vendor orders",
        error: error.message,
      });
    }
  }),
};

module.exports = vendorController;
