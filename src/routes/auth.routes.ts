import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

class AuthRoutes {
    private router: Router;
    private readonly _authController;

    constructor() {
        this.router = Router();
        this._authController = new AuthController();
        this.initRoutes();
    }

    public initRoutes() {
        this.router.post('/login', this._authController.login.bind(this._authController));
        this.router.post('/logout', this._authController.logout.bind(this._authController));
    }
}

export default AuthRoutes;
