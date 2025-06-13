import { Router } from 'express';
import UserController from '../controllers/user.controller';

const userRouter = Router();
const _userController = new UserController();

userRouter.get('/', _userController.getAllUsers.bind(_userController));
userRouter.get('/helpers', _userController.getAllHelpers.bind(_userController));
userRouter.get('/helpers/:id', _userController.getHelperById.bind(_userController));
userRouter.get('/students', _userController.getAllStudents.bind(_userController));
userRouter.get('/students/:id', _userController.getStudentById.bind(_userController));

export default userRouter;
