const mongoose = require("mongoose");
const User = require("./user_model");

const VendorApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  businessName: { type: String, required: true },
  taxId: { type: String, required: true },
  category: { type: String, required: true },
  certifications: [String], // E.g., organic, fair trade
  businessAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  businessDescription: { type: String, required: true },
  contactPerson: {
    name: { type: String, required: true },
    position: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  website: { type: String },
  socialMediaLinks: [String],
  businessRegistrationNumber: { type: String, required: true },
  storeType: { type: String, required: true },
  paymentDetails: {
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    routingNumber: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["bank", "paypal", "stripe"],
      required: true,
    },
  },
  initialProductList: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: [String], required: true }, // URL to the product image from Cloudinary
    },
  ],

  preferredShippingMethods: [String],
  status: { type: String, default: "pending" }, // 'pending', 'approved', 'rejected'
  createdAt: { type: Date, default: Date.now },

  shopImages: { type: [String], required: true }, // URL to the shop image/logo from Cloudinary
});

const VendorApplication = mongoose.model(
  "VendorApplication",
  VendorApplicationSchema
);
module.exports = VendorApplication;
