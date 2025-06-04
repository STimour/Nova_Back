import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/helpers', userController.getAllHelpers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
