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

module.exports = productRouter;
