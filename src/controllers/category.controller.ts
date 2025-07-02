import { Request, Response } from 'express';
import ErrorMessages from '../utils/error.messages';
import CategoryService from '../services/category.service';

class CategoryController {
    private readonly _categoryService: CategoryService;
    constructor(_categoryService = new CategoryService()) {
        this._categoryService = _categoryService;
    }

    public async createCategory(req: Request, res: Response): Promise<void> {
        const categoryDate = req.body;
        try {
            const category = await this._categoryService.createCategory(categoryDate);
            if (!category) {
                res.status(500).json(ErrorMessages.badRequest());
                return;
            }
            res.status(201).json(JSON.stringify(category));
            return;
        } catch (error) {
            res.status(500).json(ErrorMessages.badRequest());
            return;
        }
    }

    public async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this._categoryService.getAllCategories();
            if (!categories || categories.length === 0) {
                res.status(500).json(ErrorMessages.notFound());
                return;
            }
            res.status(200).json(categories);
            return;
        } catch (error) {
            res.status(500).json(ErrorMessages.badRequest());
            return;
        }
    }
}
export default CategoryController;
