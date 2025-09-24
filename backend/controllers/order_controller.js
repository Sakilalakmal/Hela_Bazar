const asyncHandler = require('express-async-handler');
const Product = require('../model/product_model');

const OrderManagementController = {

    addTocart: asyncHandler(async(req , res)=>{
        const userId = req.user.id;
        const {productId, quantity = 1, customization} = req.body;

        const product = await Product.findById(productId);

        if(!product){
            res.status(404).json({
                message: "Product not found"
            });
        }
    })
};