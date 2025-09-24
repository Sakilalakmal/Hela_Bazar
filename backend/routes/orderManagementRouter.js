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

module.exports = orderManagementRouter;
