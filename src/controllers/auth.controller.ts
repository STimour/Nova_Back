import { getErrorMessage } from '../middlwares/errorHandler.middlewares';
import { IUser } from '../models/interfaces/IUser';
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
//TODO - revoir le type de newUser car le front envoie aussi les SkillsCategorie - plus de detail dans le controller 
    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            let estInscrit: boolean;

            const newUser: any = req.body;

            estInscrit = await this._userService.createUser(newUser);

            if (!estInscrit) {
                res.status(400).json({ message: 'Error creating user' });
                return;
            }
            const { password, ...userWithoutPassword } = newUser;
            res.status(201).json(userWithoutPassword);
            return;
        } catch (error) {
            logger.error('Error in createUser controller: %s', getErrorMessage(error));
            res.status(500).json({ message: 'Error creating user' });
            return;
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, saveConnexion } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }

            const user = await this._authService.findUserByEmail(email);

            if (!user) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            const isPasswordValid = await this._authService.verifyPassword(user.password, password);

            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            const token = await this._authService.createAuthToken(
                user.id,
                user.email,
                saveConnexion,
                user.birthdate?.toISOString()
            );

            res.status(200).json({ token });
            return;
        } catch (error) {
            logger.error('Error in auth.controller in login: %s, %s');
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
    }

    public async logout(req: Request, res: Response): Promise<void> {
        try {
            const tokenString = req.headers.authorization;

            if (!(await this._authService.desactivateAuthToken(tokenString as string))) {
                res.status(401).json({ message: 'Internal Server Error' });
                return;
            }

            res.status(200).json({ message: 'Logout successful' });

            return;
        } catch (error) {
            logger.error('Error in auth.controller in logout: %s, %s', getErrorMessage(error));
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
    }

    public async me(req: Request, res: Response): Promise<void> {}
}

export default AutController;
