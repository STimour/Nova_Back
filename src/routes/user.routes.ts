import { Router } from 'express';
import UserController from '../controllers/user.controller';

const userRouter = Router();
const _userController = new UserController();

// Afficher tous les utilisateurs
userRouter.get('/', _userController.getAllUsers.bind(_userController));

// Afficher tous les helpers
userRouter.get('/helpers', _userController.getAllHelpers.bind(_userController));

// Afficher detail d'un helper
userRouter.get('/helpers/:id', _userController.getHelperById.bind(_userController));

// Supprimer un helper
userRouter.post('/helpers/:id', _userController.deleteUser.bind(_userController));

// Afficher tous les étudiants
userRouter.get('/students', _userController.getAllStudents.bind(_userController));

// Afficher detail d'un étudant
userRouter.get('/students/:id', _userController.getStudentById.bind(_userController));

//supprimer un étudant
userRouter.post('/students/:id', _userController.deleteUser.bind(_userController));

export default userRouter;
