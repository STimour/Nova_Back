import { Router } from 'express';
import SkillController from '../controllers/skill.controller';

export const skillRoutes = Router();
const _skillController = new SkillController();

skillRoutes.post('/', _skillController.create.bind(_skillController));
skillRoutes.get('/all', _skillController.getAll.bind(_skillController));
