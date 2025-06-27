import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const authRouter = Router();
const _authController = new AuthController();

// Connexion
authRouter.post('/login', _authController.login.bind(_authController));

// Deconnexion
authRouter.post('/logout', _authController.logout.bind(_authController));

// Inscription
authRouter.post('/inscription', _authController.createUser.bind(_authController));

export default authRouter;
