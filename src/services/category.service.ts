import { getErrorMessage } from '../middlwares/errorHandler.middlewares';
import SkillCategoryRepository from '../repositories/skillCategory.repository';

import ErrorMessages from '../utils/error.messages';
import logger from '../utils/logger';

class CategoryService {
    private readonly _categoryRepository: SkillCategoryRepository;

    constructor(_categoryRepository = new SkillCategoryRepository()) {
        this._categoryRepository = _categoryRepository;
    }

    public async createCategory(categoryDate: any) {
        try {
            return await this._categoryRepository.create(categoryDate);
        } catch (error) {
            logger.error(ErrorMessages.errorCreatingSkillCategory(), getErrorMessage(error));
            return;
        }
    }

    public async getAllCategories() {
        try {
            return await this._categoryRepository.findAll();
        } catch (error) {
            logger.error(ErrorMessages.errorCreatingSkillCategory(), getErrorMessage(error));
            return;
        }
    }
}
export default CategoryService;
