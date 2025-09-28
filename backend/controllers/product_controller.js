const asyncHandler = require("express-async-handler");
const Product = require("../model/product_model");
const { cloudinary } = require("../service/cloudinary");

const productController = {
  createProducts: asyncHandler(async (req, res) => {
    const {
      name,
      brand,
      description,
      category,
      tags,
      price,
      stock,
      discount,
      variants,
      customizationOptions,
      rating,
      reviewCount,
      slug,
      isActive,
      isFeatured,
    } = req.body;
    const userId = req.user.id;

    //validations
    if (!name || !description || !category || !price || !stock) {
      res.status(400).json({
        message:
          "Please fill these required feilds to show your prouducts in the hela bazar marketplace",
      });
    }

    //images from cloudinary
    const images = req.files ? req.files.map((file) => file.path) : [];

    if (images.length === 0) {
      res.status(400).json({
        message: "Al least provide one image for your products",
      });
    }

    if (isNaN(price) || price <= 0) {
      res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    if (isNaN(stock) || stock < 0) {
      res.status(400).json({
        message: "if you don't have stock put 0 ",
      });
    }

    const newProduct = new Product({
      vendorId: userId,
      name,
      brand,
      description,
      images,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      price,
      stock,
      discount: discount || 0,
      variants: variants ? JSON.parse(variants) : [],
      customizationOptions: customizationOptions
        ? JSON.parse(customizationOptions)
        : [],
      rating,
      reviewCount,
      slug,
      isActive,
      isFeatured,
    });

    const createdProduct = await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  }),

  getAllProducts: asyncHandler(async (req, res) => {
    const products = await Product.find();

    if (products.length === 0) {
      res.status(400).json({
        message:
          " There aren't any product available in here we will add soon please wait...",
      });
    }

    res.status(201).json({
      message: "All products fetched successfully",
      products,
      productCount: products.length,
    });
  }),

  getSingleproduct: asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const singleProduct = await Product.findById(productId).populate(
      "vendorId",
      "username email"
    );

    if (!singleProduct) {
      res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Single product fetched successfully",
      product: singleProduct,
    });
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({
        message: "Product not found try again ",
      });
    }

    if (String(product.vendorId) !== String(userId)) {
      res.status(403).json({
        message: "You are not authorized to update this product",
      });
    }

    const {
      name,
      brand,
      description,
      category,
      tags,
      price,
      stock,
      discount,
      variants,
      customizationOptions,
      rating,
      reviewCount,
      slug,
      isActive,
      isFeatured,
    } = req.body;

    if (name) product.name = name;
    if (brand) product.brand = brand;
    if (description) product.description = description;
    if (category) product.category = category;
    if (tags) product.tags = tags.split(",").map((tag) => tag.trim());
    if (price) {
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({
          message: "Price must be a positive number",
        });
      }
      product.price = price;
    }
    if (stock) {
      if (isNaN(stock) || stock < 0) {
        return res.status(400).json({
          message: "if you don't have stock put 0 ",
        });
      }
      product.stock = stock;
    }
    if (discount) product.discount = discount;
    if (variants)
      product.variants =
        typeof variants === "string" ? JSON.parse(variants) : variants;
    if (customizationOptions)
      product.customizationOptions =
        typeof customizationOptions === "string"
          ? JSON.parse(customizationOptions)
          : customizationOptions;
    if (rating) product.rating = rating;
    if (reviewCount) product.reviewCount = reviewCount;
    if (slug) product.slug = slug;
    if (isActive) product.isActive = isActive;
    if (isFeatured) product.isFeatured = isFeatured;

    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => file.path);
      product.images = images;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({
        message: "Product not found try again",
      });
    }

    if (String(product.vendorId) !== String(userId)) {
      res.status(403).json({
        message: "You are not authorized to delete this product",
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    await Product.findOneAndDelete({ _id: productId });

    res.status(201).json({
      message: "Product deleted successfully",
    });
  }),

  getFilteredProducts: asyncHandler(async (req, res) => {
    try {
      const {
        search,
        category,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 12,
      } = req.query;

      // 2. Build filter object
      let filter = {};

      // Search in name and description (case-insensitive, partial match)
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Category filtering (partial match, case-insensitive)
      if (category) {
        filter.category = { $regex: category, $options: "i" };
      }

      // Price filtering
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      // You can add more filters: tags, vendor, rating, isActive, etc.

      // 3. Pagination
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 12;
      const skip = (pageNumber - 1) * pageSize;

      // 4. Sorting
      let sortOption = { createdAt: -1 }; // default: newest first
      if (sort) {
        // Examples: 'price', '-price', 'rating', '-rating'
        const order = sort.startsWith("-") ? -1 : 1;
        const field = sort.replace("-", "");
        sortOption = { [field]: order };
      }

      // 5. Count total products (for pagination UI)
      const totalProducts = await Product.countDocuments(filter);

      // 6. Query products
      const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize);

      // 7. Send response
      res.status(200).json({
        products,
        page: pageNumber,
        pageSize,
        totalProducts,
        totalPages: Math.ceil(totalProducts / pageSize),
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }),
};

function getPublicIdFromUrl(url) {
  // This works for default Cloudinary URLs
  // Example: .../hela_bazar/product123_1713568956.png => hela_bazar/product123_1713568956
  const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)\./);
  return matches ? matches[1] : null;
}

module.exports = productController;
