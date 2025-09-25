const express = require("express");
const isAuthenticatedUser = require("../middlewares/auth_user");
const OrderManagementController = require("../controllers/order_controller");
const hasRole = require("../middlewares/has_role_middleware");
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

orderManagementRouter.get(
  "/myOrders",
  isAuthenticatedUser,
  OrderManagementController.getAllOrderForUser
);

orderManagementRouter.get(
  "/detials/:orderId",
  isAuthenticatedUser,
  OrderManagementController.getSingleOrderDetails
);

orderManagementRouter.patch(
  "/update/status/:orderId",
  isAuthenticatedUser,
  hasRole(["admin", "vendor"]),
  OrderManagementController.updateStatusInOrder
),
  orderManagementRouter.patch(
    "/cancel/:orderId",
    isAuthenticatedUser,
    hasRole(["consumer", "vendor"]),
    OrderManagementController.cancelOrder
  );

module.exports = orderManagementRouter;
