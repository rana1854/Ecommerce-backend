import Product from '../models/product.js';

// Create product --Admin route 
export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const saveProducts = await product.save();
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            saveProducts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category').populate('user');//
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single product by ID
export const singleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete product by ID -- Admin route
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            deletedProduct
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update product by ID -- Admin route
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const dataToUpdate = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(productId, dataToUpdate, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updatedProduct
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
