const asyncHandler = require("express-async-handler");
const Product = require("../model/product_model");
const Wishlist = require("../model/wishList_model");

const wishListController = {
  addProductToWishList: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      //check product availabke for add to wishlist
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          message: "This product isn't available for add to wishlist",
        });
      }

      //check if the current user is the owner of this wishlist
      if(String(product.vendorId) === String(userId)){
        return res.status(403).json({
          message: "You cannot add your own product to wishlist",
        });
      }

      //check if the current user is the owner of this wishlist
      if (String(wishList.userId) !== String(userId)) {
        return res.status(403).json({
          message:
            "You are not authorized to add products to this wishlist",
        });
      }

      //create wishlist if currenrt user doesn't have one
      let wishList = await Wishlist.findOne({ userId });
      if (!wishList) {
        wishList = new Wishlist({ userId, products: [] });
      }

      //check product already in wishlist
      if (wishList.products.includes(productId)) {
        return res.status(400).json({
          message: "Product already in wishlist",
        });
      }

      // Add product to wishlist
      wishList.products.push(productId);
      await wishList.save();

      return res.status(201).json({
        message: "Product added to wishlist",
        wishList,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }),

  removefromWishList: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      //check wishlist exist
      const wishList = await Wishlist.findOne({ userId });
      if (!wishList) {
        return res.status(404).json({
          message: "You don't have any wishlist to remove product",
        });
      }

      //check product in wishlist
      if (!wishList.products.includes(productId)) {
        return res.status(404).json({
          message: "This product is not in your wishlist",
        });
      }

      //chekc if the current user owner of this wishlist
      if (String(wishList.userId) !== String(userId)) {
        return res.status(403).json({
          message:
            "You are not authorized to remove products from this wishlist",
        });
      }

      // Remove product from wishlist
      wishList.products = wishList.products.filter(
        (prodId) => prodId.toString() !== productId
      );
      await wishList.save();

      res.status(200).json({
        message: "Product removed from wishlist",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }),

  removeAllFromWishList: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;

      //check wishlist exist
      const wishList = await Wishlist.findOne({ userId });
      if (!wishList) {
        return res.status(404).json({
          message: "You don't have any wishlist to remove",
        });
      }

      //check if the current user owner of this wishlist
      if (String(wishList.userId) !== String(userId)) {
        return res.status(403).json({
          message:
            "You are not authorized to remove products from this wishlist",
        });
      }

      // Remove all products from wishlist
      wishList.products = [];
      await wishList.save();
      res.status(200).json({
        message: "All products removed from wishlist",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }),
};

module.exports = wishListController;
