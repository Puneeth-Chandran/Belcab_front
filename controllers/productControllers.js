import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Product from '../models/products.js';
import ErrorHandler from '../utils/errorhandler.js';

//Create new Product => /api/bel/admin/products
export const getProducts = catchAsyncErrors(async (req,res)=>{

    const products= await Product.find()

    res.status(200).json({
        products,
    });
});

//Create new Product => /api/bel/admin/products
export const newProduct = catchAsyncErrors(async (req,res)=>{
    const product = await Product.create(req.body)

    res.status(200).json({
        product,
    })
});

//Get single product => /api/bel/products/:id
export const getProductDetails= catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req?.params?.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        product,
    });
});

//Update product details => /api/bel/products/:id
export const updateProduct = catchAsyncErrors(async (req,res,next)=>{
    let product = await Product.findById(req?.params?.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
        product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {new: true});
    
        res.status(200).json({
            product,
        });
});

//Delete product => /api/bel/products/:id
export const deleteProduct = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req?.params?.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    };

    await product.deleteOne();

    res.status(200).json({
        message:"Product Deleted",
    });
});