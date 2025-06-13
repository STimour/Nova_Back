import { Router } from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import { MiddlewareService } from '../middlwares/auth.middlewares';

const MainRouter = Router();
const _middlewareService = new MiddlewareService();

MainRouter.use('/auth', authRouter);

MainRouter.use('/users', _middlewareService.checkToken, userRouter);

export default MainRouter;
