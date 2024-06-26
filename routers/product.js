import express from 'express';
const productRouter = express.Router();
import { createProduct, deleteProduct, getAllProducts, singleProduct, updateProduct } from '../controllers/product.js';

productRouter.post('/create-product', createProduct);
productRouter.get('/get-products', getAllProducts);
productRouter.get('/single-product/:id',singleProduct);
productRouter.delete('/delete-product/:id',deleteProduct);
productRouter.put('/update-product/:id',updateProduct);


export default productRouter;
