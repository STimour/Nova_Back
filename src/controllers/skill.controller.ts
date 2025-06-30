import { Request, Response } from 'express';
import ErrorMessages from '../utils/error.messages';
import SkillService from '../services/skill.service';

class SkillController {
    private readonly _skillService: SkillService;
    constructor(_skillService = new SkillService()) {
        this._skillService = _skillService;
    }

    public async create(req: Request, res: Response): Promise<void> {
        const skillDate = req.body;
        try {
            const category = await this._skillService.create(skillDate);
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

    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this._skillService.getAll();
            if (!categories || categories.length === 0) {
                res.status(500).json(ErrorMessages.notFound());
                return;
            }
            res.status(201).json(JSON.stringify(categories));
            return;
        } catch (error) {
            res.status(500).json(ErrorMessages.badRequest());
            return;
        }
    }
}
export default SkillController;
