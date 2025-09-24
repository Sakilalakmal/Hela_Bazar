const asyncHandler = require("express-async-handler");
const Product = require("../model/product_model");
const Cart = require("../model/cart_model");

const OrderManagementController = {
  addTocart: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity = 1, customization } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
    }

    // find the user's cart or create new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // check if the product already exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) =>
        String(item.productId) === String(productId) &&
        JSON.stringify(item.customization || {}) ===
          JSON.stringify(customization || {})
    );

    if (itemIndex > -1) {
      // If product exists in cart, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // If product does not exist in cart, add new item
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        image:
          product.images && product.images.length > 0 ? product.images[0] : "", // Assuming first image as thumbnail
        quantity: Number(quantity),
        customization: customization || {},
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(201).json({
      message: "Product added to cart successfully",
      cart,
    });
  }),

  deleteFromCart: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const {productId} = req.params;

    //check if the user's cart exists to delete
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({
        message: "Cart not found to delete",
      });
    }

    if(String(cart.userId) !== String(userId)){
      res.status(403).json({
        message: "You are not authorized to delete items from this cart",
      });
    }

    // Remove product from cart (no customization logic needed)
    cart.items = cart.items.filter(
      (item) => String(item.productId) !== String(productId)
    );

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });

  }),
};
module.exports = OrderManagementController;
