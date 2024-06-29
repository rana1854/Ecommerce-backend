import express from 'express';
const productRouter = express.Router();
import { createProduct, deleteProduct, getAllProducts, singleProduct, updateProduct } from '../controllers/product.js';
import { authRole, authenticateUser } from '../middleware/authmiddleware.js';

productRouter.post('/create-product',authenticateUser,authRole(['admin']), createProduct);
productRouter.get('/get-products', getAllProducts);
productRouter.get('/single-product/:id',singleProduct);
productRouter.delete('/delete-product/:id',authenticateUser, authRole(["admin"]),deleteProduct);
productRouter.put('/update-product/:id',authenticateUser, authRole(["admin"]),updateProduct);


export default productRouter;
