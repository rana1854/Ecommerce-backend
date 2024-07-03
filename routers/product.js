import express from 'express';
const productRouter = express.Router();
import {  createProductReview, createProductWithImages, deleteProduct, deleteReview, getAllProducts, getProductReviews, singleProduct, updateProduct } from '../controllers/product.js';
import { authRole, authenticateUser } from '../middleware/authmiddleware.js';
import upload from '../middleware/multer.js';

productRouter.post('/create-product', authenticateUser, authRole(['admin']),upload.array('image', 5),createProductWithImages); //
// productRouter.post('/create-product', authenticateUser, authRole(['admin']),upload.array('image', 5), createProduct); //
productRouter.get('/get-products', getAllProducts);
productRouter.get('/single-product/:id', singleProduct);
productRouter.delete('/delete-product/:id', authenticateUser, authRole(['admin']), deleteProduct);
productRouter.put('/update-product/:id', authenticateUser, authRole(['admin']), upload.array('image', 5), updateProduct);

//reviews Api's
productRouter.put('/createReview', authenticateUser, createProductReview);
productRouter.get('/get-reviews', getProductReviews);
productRouter.delete('/deleteReview', authenticateUser, deleteReview);


export default productRouter;
