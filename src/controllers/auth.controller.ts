import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import logger from '../utils/logger';
import { Request, Response } from 'express';

class AutController {
    private readonly _authService;
    private readonly _userService;

    constructor() {
        this._authService = new AuthService();
        this._userService = new UserService();
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, saveConnexion } = req.body;

            if (!email || !password) {
                res.status(400).send('Email and password are required');
                return;
            }

            const user = await this._userService.findUserByEmail(email);

            if (!user) {
                res.status(401).send('Invalid credentials');
                return;
            }

            const isPasswordValid = await this._authService.verifyPassword(user.password, password);

            if (!isPasswordValid) {
                res.status(401).send('Invalid credentials');
                return;
            }

            const token = await this._authService.createAuthToken(
                user.id,
                user.email,
                saveConnexion
            );

            res.status(200).json({ token });
            return;
        } catch (error) {
            logger.error('Error in auth.controller in login: %s, %s');
            res.status(500).send('Internal Server Error');
            return;
        }
    }
}

export default AutController;
