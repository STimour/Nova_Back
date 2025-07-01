import { getErrorMessage } from '../middlwares/errorHandler.middlewares';
import SkillRepository from '../repositories/skillCategory.repository';

import ErrorMessages from '../utils/error.messages';
import logger from '../utils/logger';

class SkillService {
    private readonly _skillRepository: SkillRepository;

    constructor(_skillRepository = new SkillRepository()) {
        this._skillRepository = _skillRepository;
    }

    public async create(skillDate: any) {
        try {
            return await this._skillRepository.create(skillDate);
        } catch (error) {
            logger.error(ErrorMessages.errorCreatingSkill(), getErrorMessage(error));
            return;
        }
    }

    public async getAll() {
        try {
            return await this._skillRepository.findAll();
        } catch (error) {
            logger.error(ErrorMessages.errorCreatingSkill(), getErrorMessage(error));
            return;
        }
    }
}
export default SkillService;
