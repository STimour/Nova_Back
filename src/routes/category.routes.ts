import { Router } from 'express';
import CategoryController from '../controllers/category.controller';

export const categoriesRoutes = Router();
const _categoryController = new CategoryController();

categoriesRoutes.post('/', _categoryController.createCategory.bind(_categoryController));
categoriesRoutes.get('/all', _categoryController.getAllCategories.bind(_categoryController));
