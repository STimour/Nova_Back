import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/helpers', userController.getAllHelpers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.put('/:id', userController.deleteUser);

export default router;
