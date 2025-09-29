const express = require("express");
const isAuthenticatedUser = require("../middlewares/auth_user");
const wishListController = require("../controllers/wishlist_controller");
const wishListRouter = express.Router();

wishListRouter.post(
  "/add/:productId",
  isAuthenticatedUser,
  wishListController.addProductToWishList
);

wishListRouter.get(
  "/all/items",
  isAuthenticatedUser,
  wishListController.getAllWishListProducts
);

wishListRouter.post(
  "/remove/:productId",
  isAuthenticatedUser,
  wishListController.removefromWishList
);

wishListRouter.post(
  "/removeAll",
  isAuthenticatedUser,
  wishListController.removeAllFromWishList
);

module.exports = wishListRouter;
