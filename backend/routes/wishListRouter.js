const express = require("express");
const isAuthenticatedUser = require("../middlewares/auth_user");
const wishListController = require("../controllers/wishlist_controller");
const wishListRouter = express.Router();

wishListRouter.post(
  "/add/:productId",
  isAuthenticatedUser,
  wishListController.addProductToWishList
);

wishListRouter.post(
  "/remove/:productId",
  isAuthenticatedUser,
  wishListController.removefromWishList
);

module.exports = wishListRouter;
