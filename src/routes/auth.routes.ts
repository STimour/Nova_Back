import { Router } from 'express';
import AuthController from '../controllers/auth.controller';


const authRouter = Router();
const _authController = new AuthController();

authRouter.post('/login', _authController.login.bind(_authController));
authRouter.post('/logout', _authController.logout.bind(_authController));
authRouter.post('/', _authController.createUser.bind(_authController));

export default authRouter;
