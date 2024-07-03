import Product from '../models/product.js';
import ApiFeatures from '../utils/apifeatures.js'
import path from 'path';
// Create product --Admin route 
// export const createProduct = async (req, res) => {
//     try {
//         req.body.user = req.user.id; // give id of a user creating data
//         const product = new Product(req.body);
//         const images = req.file.path;
//         const saveProducts = await product.save();
//         res.status(201).json({
//             success: true,
//             message: 'Product created successfully',
//             saveProducts,
//             images: [],
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// //uplaod multiple images Api

// export const uploadMultipleUserImage = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const files = req.files;
//         const imagePath = files.map(file => ({
//             filename: file.filename,
//             path: file.path,

//         }))
//         const user = await Sid.findById(userId)
//         if (!user) {
//             return res.status(404).json({ message: "user not found" })
//         }
//         user.images.push(...imagePath)
//         await user.save();
//         res.status(200).json({ message: "images uploaded successfully", user })


//     } catch (error) {
//         res.status(500).json(error.message);

//     }
// }

export const createProductWithImages = async (req, res) => {
    try {
        // Extract user ID from the authenticated user
        req.body.user = req.user.id;

        // Create a new product instance with the request body
        const product = new Product(req.body);

        // Extract and map the image files to the required format
        const images = req.files.map(file => ({
            filename: file.filename,
            path: file.path,
        }));

        // Add the images to the product
        product.image = images;

        // Save the product to the database
        const saveProducts = await product.save();

        // Send a success response
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            saveProducts,
        });
    } catch (error) {
        // Send an error response in case of failure
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const resultPerPage = 10;
        const productCount = await Product.countDocuments()
        const apiFeature = new ApiFeatures(Product.find().populate("category", "name"), req.query).search().filter().pagination(resultPerPage);
        const products = await apiFeature.query.exec(); // Ensure the query is executed and results are awaited


        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get single product by ID
export const singleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate("category","name");
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
            });
        }
        res.status(200).json({
            success: true,
            product,

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

        // Find the existing product
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Handle image updates
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => ({
                filename: file.filename,
                path: file.path,
            }));
            req.body.image = images;
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updatedProduct
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};





// Create New Review or Update the review
export const createProductReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString()) {
                    rev.rating = rating;
                    rev.comment = comment;
                }
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let avg = 0;
        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'Review added/updated successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Reviews of a product
export const getProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.query.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Review
export const deleteReview = async (req, res) => {
    try {
        const product = await Product.findById(req.query.productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== req.query.id.toString()
        );

        let avg = 0;
        reviews.forEach((rev) => {
            avg += rev.rating;
        });

        const ratings = reviews.length === 0 ? 0 : avg / reviews.length;
        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(
            req.query.productId,
            {
                reviews,
                ratings,
                numOfReviews,
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
