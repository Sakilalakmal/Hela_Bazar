const asyncHandler = require("express-async-handler");
const Product = require("../model/product_model");

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
    if(!name || !description || !category || !price || !stock){
        res.status(400).json({
            message: "Please fill these required feilds to show your prouducts in the hela bazar marketplace"
        })
    }

    //images from cloudinary
    const images = req.files ? req.files.map((file) => file.path) : [];

    if(images.length === 0 ){
        res.status(400).json({
            message:"Al least provide one image for your products"
        });
    }


    if(isNaN(price) || price <=0){
        res.status(400).json({
            message:"Price must be a positive number"
        });
    }

    if(isNaN(stock) || stock < 0){
        res.status(400).json({
            message:"if you don't have stock put 0 "
        })
    }

    const newProduct = new Product({
        vendorId: userId,
        name,
        brand,
        description,
        images,
        category,
        tags:tags ? tags.split(',').map(tag => tag.trim()) : [],
        price,
        stock,
        discount : discount || 0,
        variants,
        customizationOptions :customizationOptions ? JSON.parse(customizationOptions) : [],
        rating :variants ? JSON.parse(variants) : [],
        reviewCount,
        slug,
        isActive,
        isFeatured
    });

    const createdProduct = await newProduct.save();

    res.status(201).json({
        message: "Product created successfully",
        product: createdProduct
    });


  }),
};

module.exports = productController;
