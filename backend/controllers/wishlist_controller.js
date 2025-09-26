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
};

module.exports = wishListController;
