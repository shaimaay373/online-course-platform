import Category from '../models/Category.model.js';


export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (err) {
        next(err);
    }
};


export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const category = await Category.create({ name });
        res.status(201).json({ message: "Category created successfully", category });
    } catch (err) {
        next(err);
    }
};


export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        next(err);
    }
};