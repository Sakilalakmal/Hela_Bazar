const express = require("express");
const isAuthenticatedUser = require("../middlewares/auth_user");
const OrderManagementController = require("../controllers/order_controller");
const orderManagementRouter = express.Router();

orderManagementRouter.post(
  "/cart/add",
  isAuthenticatedUser,
  OrderManagementController.addTocart
);

orderManagementRouter.delete(
  "/cart/remove/:productId",
  isAuthenticatedUser,
  OrderManagementController.deleteFromCart
);

orderManagementRouter.post(
  "/cart/removeAll",
  isAuthenticatedUser,
  OrderManagementController.removeAllCarts
);

orderManagementRouter.post(
  "/placeorder",
  isAuthenticatedUser,
  OrderManagementController.placeOrder
);

module.exports = orderManagementRouter;
