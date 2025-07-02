import { Router } from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import { MiddlewareService } from '../middlwares/auth.middlewares';
import { sessionRoutes } from './session.routes';
import { categoriesRoutes } from './category.routes';
import { skillRoutes } from './skill.routes';
import UserController from '../controllers/user.controller';

const MainRouter = Router();
const _middlewareService = new MiddlewareService();
const _userController = new UserController();

// MainRouter.use('/users/helpers', _userController.getAllHelpers.bind(_userController));

MainRouter.use('/auth', authRouter);

MainRouter.use('/users', _middlewareService.checkToken, userRouter);

MainRouter.use('/session/', _middlewareService.checkToken, sessionRoutes);

MainRouter.use('/categories/', categoriesRoutes);

MainRouter.use('/skills/', skillRoutes);

export default MainRouter;
