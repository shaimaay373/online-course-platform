import { Router } from 'express';
import {
    getAllCategories,
    createCategory,
    deleteCategory
} from '../controllers/category.controller.js';
import { validateAuth, allowedTo } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllCategories);                                         
router.post('/', validateAuth, allowedTo("instructor"), createCategory);   
router.delete('/:id', validateAuth, allowedTo("instructor"), deleteCategory); 

export default router;