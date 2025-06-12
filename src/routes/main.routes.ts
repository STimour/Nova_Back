import { Router } from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';

const MainRouter = Router();

MainRouter.use('/auth', authRouter);

MainRouter.use('/users', userRouter);

export default MainRouter;
