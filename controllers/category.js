import Category from '../models/category.js';

// Create category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({
            name,
            description,
        });
        await category.save();
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single category by ID
export const singleCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found",
            });
        }
        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete category by ID
export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            deletedCategory
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update category by ID
export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const dataToUpdate = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, dataToUpdate, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            updatedCategory
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
