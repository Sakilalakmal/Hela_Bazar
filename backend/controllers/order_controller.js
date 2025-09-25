const asyncHandler = require("express-async-handler");
const Product = require("../model/product_model");
const Cart = require("../model/cart_model");
const Order = require("../model/order_model");
const { default: mongoose, get } = require("mongoose");
const { getSingleproduct } = require("./product_controller");

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
    const { productId } = req.params;

    //check if the user's cart exists to delete
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({
        message: "Cart not found to delete",
      });
    }

    if (String(cart.userId) !== String(userId)) {
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

  removeAllCarts: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    //check if the user's cart exists to delete
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(404).json({
        message: "You dont have cart to remove ",
      });
    }

    if (String(cart.userId) !== String(userId)) {
      res.status(403).json({
        message: "You are not authorized to delete items from this cart",
      });
    }

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json({
      message: "All items removed from cart successfully",
      cart,
    });
  }),

  placeOrder: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    //desctructure the shipping address and payment method from req.body
    const { shippingAddress, paymentMethod, notes } = req.body;

    //validate required fields
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.country
    ) {
      res.status(400).json({
        message: "Please provide all required shipping address fields",
      });
    }

    //check if the user's cart exists to place order
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        message:
          "You dont have cart to place order first add some products to cart",
      });
    }

    //calculate total amount
    let totalAmount = 0;
    let orderProducts = [];

    for (const cartItems of cart.items) {
      const product = await Product.findById(cartItems.productId);
      if (!product) {
        return res.status(404).json({
          message: `Product with ID ${cartItems.productId} not found`,
        });
      }

      if (product.stock < cartItems.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}. Available stock: ${product.stock}`,
        });
      }

      //calculate total price
      const totalPrice = product.price * cartItems.quantity;
      totalAmount += totalPrice;

      //push to order products array
      orderProducts.push({
        productId: product._id,
        vendorId: product.vendorId,
        name: product.name,
        image:
          product.images && product.images.length > 0 ? product.images[0] : "",
        price: product.price,
        quantity: cartItems.quantity,
        customization: cartItems.customization || {},
      });
    }

    //create order document
    const order = new Order({
      customerId: userId,
      products: orderProducts,
      shippingAddress,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      status: paymentMethod === "cod" ? "pending" : "confirmed",
      notes: notes || "",
    });

    //save order to MongoDB
    await order.save();

    //reduce product stock
    for (const cartItems of cart.items) {
      const product = await Product.findById(cartItems.productId);
      product.stock -= cartItems.quantity;
      await product.save();
    }

    //clear user's cart
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(201).json({
      message: "Your Order has been placed successfully",
      order: order,
    });
  }),

  getAllOrderForUser: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const orders = await Order.find({ customerId: userId })
      .populate("customerId", "username email")
      .populate("products.productId", "name price image")
      .populate("products.vendorId", "username email")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "You have no orders yet browse products and place your order",
      });
    }

    res.status(200).json({
      message: "All your orders fetched successfully",
      orders,
    });
  }),

  getSingleOrderDetails: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("customerId", "username email")
      .populate("products.productId", "name price image")
      .populate("products.vendorId", "username email");

    //check order exists
    if (!order) {
      res.status(404).json({
        message: "This order not found",
      });
    }

    if (
      String(order.customerId._id) !== String(userId) ||
      req.user.role === "admin"
    ) {
      res.status(403).json({
        message: "You are not authorized to view this order details",
      });
    }

    res.status(200).json({
      message: "Order details fetched successfully",
      order,
    });
  }),
};
module.exports = OrderManagementController;
