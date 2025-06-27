import { Skill } from './../models/Skill.model';
import logger from '../utils/logger';
import ErrorMessages from '../utils/error.messages';

class SkillRepository {
    public async create(SkillData: any): Promise<Skill | null> {
        try {
            return await Skill.create(SkillData);
        } catch (error) {
            logger.error(ErrorMessages.errorCreatingSkill(), SkillData, error);
            return null;
        }
    }

    public async findById(id: string): Promise<Skill | null> {
        try {
            return await Skill.findByPk(id);
        } catch (error) {
            logger.error(ErrorMessages.notFound(), id, error);
            return null;
        }
    }

    public async update(id: string, updates: any): Promise<[number, Skill[]]> {
        try {
            return await Skill.update(updates, { where: { id }, returning: true });
        } catch (error) {
            logger.error(ErrorMessages.errorUpdatingSkill(), id, updates, error);
            return [0, []];
        }
    }

    public async delete(id: string): Promise<number> {
        try {
            return await Skill.destroy({ where: { id } });
        } catch (error) {
            logger.error(ErrorMessages.errorDeletingSkill(), id, error);
            return 0;
        }
    }

    public async findAllSameCategory(idCategory: number): Promise<Skill[]> {
        try {
            return await Skill.findAll({
                where: {
                    idCategory: idCategory
                }
            });
        } catch (error) {
            logger.error(ErrorMessages.notFound(), idCategory, error);
            return [];
        }
    }

    public async findAllUserSkill(idUser: number): Promise<Skill[]> {
        try {
            return await Skill.findAll({
                include: [
                    {
                        association: 'users',
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

    public async findAll(): Promise<Skill[]> {
        try {
            return await Skill.findAll();
        } catch (error) {
            logger.error(ErrorMessages.notFound(), error);
            return [];
        }
    }
}

export default SkillRepository;
