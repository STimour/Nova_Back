import logger from '../utils/logger';
import ErrorMessages from '../utils/error.messages';
import { SkillsCategory } from '../models/SkillsCategory.model';

class SkillCategoryRepository {
    public async create(SkillCategoryData: any): Promise<SkillsCategory | null> {
        try {
            return await SkillsCategory.create(SkillCategoryData);
        } catch (error) {
            logger.error(ErrorMessages.errorCreatingSkillCategory(), SkillCategoryData, error);
            return null;
        }
    }

    public async findById(id: number): Promise<SkillsCategory | null> {
        try {
            return await SkillsCategory.findByPk(id);
        } catch (error) {
            logger.error(ErrorMessages.notFound(), id, error);
            return null;
        }
    }

    public async update(id: number, updates: any): Promise<[number, SkillsCategory[]]> {
        try {
            return await SkillsCategory.update(updates, { where: { id }, returning: true });
        } catch (error) {
            logger.error(ErrorMessages.errorUpdatingSkillCategory(), id, updates, error);
            return [0, []];
        }
    }

    public async findAllUserSkill(idUser: number): Promise<SkillsCategory[]> {
        try {
            // Utilise l'association via la table de jointure UserSkillCategory
            return await SkillsCategory.findAll({
                include: [
                    {
                        association: 'learners',
                        where: { id: idUser },
                        attributes: []
                    }
                ]
            });
        } catch (error) {
            logger.error(ErrorMessages.notFound(), idUser, error);
            return [];
        }
    }

    public async delete(id: number): Promise<number> {
        try {
            return await SkillsCategory.destroy({ where: { id } });
        } catch (error) {
            logger.error(ErrorMessages.errorDeletingSkillCategory(), id, error);
            return 0;
        }
    }

    public async findAll(): Promise<SkillsCategory[]> {
        try {
            return await SkillsCategory.findAll();
        } catch (error) {
            logger.error(ErrorMessages.notFound(), error);
            return [];
        }
    }
}

export default SkillCategoryRepository;
