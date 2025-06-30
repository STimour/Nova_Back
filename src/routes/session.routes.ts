import { Router } from 'express';
import SessionController from '../controllers/session.controller';

export const sessionRoutes = Router();
const _sessionController = new SessionController();

sessionRoutes.post('/all', _sessionController.getAllSessions.bind(_sessionController));
sessionRoutes.post('/:id', _sessionController.deleteSession.bind(_sessionController));
sessionRoutes.patch('/:id', _sessionController.updateSession.bind(_sessionController));
sessionRoutes.get('/:id', _sessionController.getSession.bind(_sessionController));
sessionRoutes.post('/create', _sessionController.createSession.bind(_sessionController));
