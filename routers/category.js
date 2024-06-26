import express from 'express';
const categoryRouter = express.Router();
import { createCategory, deleteCategory, getAllCategories, singleCategory, updateCategory } from '../controllers/category.js';

categoryRouter.post('/create-category', createCategory);
categoryRouter.get('/get-categories', getAllCategories);
categoryRouter.get('/single-category/:id', singleCategory)
categoryRouter.delete('/delete-category/:id', deleteCategory)
categoryRouter.put('/update-category/:id', updateCategory)

export default categoryRouter;
