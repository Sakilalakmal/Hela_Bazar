const express = require("express");
const isAuthenticatedUser = require("../middlewares/auth_user");
const hasRole = require("../middlewares/has_role_middleware");
const productController = require("../controllers/product_controller");
const { upload } = require("../service/cloudinary");
const productRouter = express.Router();

productRouter.post(
  "/add",
  isAuthenticatedUser,
  hasRole(["vendor"]),
  upload.array("images", 5),
  productController.createProducts
);

productRouter.get(
  "/all/products",
  productController.getAllProducts
);

productRouter.get(
  "/details/:productId",
  isAuthenticatedUser,
  productController.getSingleproduct
);

productRouter.put(
  "/update/:productId",
  isAuthenticatedUser,
  hasRole(["vendor"]),
  upload.array("images", 5),
  productController.updateProduct
);

productRouter.delete(
  "/delete/:productId",
  isAuthenticatedUser,
  hasRole(["vendor"]),
  productController.deleteProduct
);

productRouter.get(
  "/filtered",
  isAuthenticatedUser,
  productController.getFilteredProducts
);

module.exports = productRouter;
