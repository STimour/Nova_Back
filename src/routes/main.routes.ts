import { Router } from 'express';
import userRoutes from './user.routes';
// import sessionRoutes from './session.routes';
const MainRouter = Router();

MainRouter.use('/users', userRoutes);
// router.use('/sessions', sessionRoutes);

export default MainRouter;
