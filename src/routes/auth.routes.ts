import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

class AuthRoutes {
    private router: Router;
    private readonly _authController;

    constructor() {
        this.router = Router();
        this._authController = new AuthController();
    }
}
export default AuthRoutes;
