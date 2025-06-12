import { Router } from 'express';
import UserController from '../controllers/user.controller';

class UserRoutes {
    public router: Router;
    private readonly _userController;

    constructor() {
        this.router = Router();
        this._userController = new UserController();
        this.initRoutes();
    }

    private initRoutes(): void {
        /**
         * à voir si cette route est utile
         * this.router.get('/', this._userController.getAllUsers.bind(this._userController));
         */
        this.router.get('/id', this._userController.getUserById.bind(this._userController));

        this.router.get('/helpers', this._userController.getAllHelpers.bind(this._userController));

        this.router.get(
            '/helpers/:id',
            this._userController.getHelperById.bind(this._userController)
        );
        this.router.get(
            '/students',
            this._userController.getAllStudents.bind(this._userController)
        );
        this.router.get(
            '/students/:id',
            this._userController.getStudentById.bind(this._userController)
        );
        this.router.post('/', this._userController.createUser.bind(this._userController));
    }
}

export default new UserRoutes().router;
