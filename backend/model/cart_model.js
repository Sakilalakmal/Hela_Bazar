const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        image: String,
        quantity: { type: Number, default: 1 },
        customization: Object, // Optional
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
