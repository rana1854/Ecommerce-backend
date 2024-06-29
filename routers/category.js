import express from 'express';
const categoryRouter = express.Router();
import { createCategory, deleteCategory, getAllCategories, singleCategory, updateCategory } from '../controllers/category.js';
import { authRole, authenticateUser } from '../middleware/authmiddleware.js';

categoryRouter.post('/create-category',authenticateUser,authRole(['admin']), createCategory);
categoryRouter.get('/get-categories', getAllCategories);
categoryRouter.get('/single-category/:id', singleCategory)
categoryRouter.delete('/delete-category/:id',authenticateUser, authRole(["admin"]), deleteCategory)
categoryRouter.put('/update-category/:id',authenticateUser, authRole(["admin"]), updateCategory)

export default categoryRouter;
