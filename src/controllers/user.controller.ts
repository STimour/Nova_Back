import { Request, Response } from 'express';
import userService from '../services/user.service';
import { getErrorMessage } from '../middlwares/errorHandler.middlewares'; // Importer pour logger
import { IUser } from '../models/interfaces/IUser';
import logger from '../utils/logger';

class UserController {
    private readonly _userService;

    constructor() {
        this._userService = new userService();
    }

    public async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this._userService.findAllUsers();
            if (users.length === 0) {
                logger.warn('No users found');
                res.status(404).json({ message: 'No users found' });
                return;
            }
            res.status(200).json(users as unknown as IUser[]);
            return;
        } catch (error) {
            logger.error('Error in getAllUsers controller: %s', getErrorMessage(error));
            res.status(500).json({ message: 'Error fetching users' });
            return;
        }
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                logger.warn('Invalid user ID: %s', userId);
                res.status(400).json({ message: 'Invalid user ID' });
                return;
            }
            const user = await this._userService.findUser(userId);
            if (!user) {
                logger.warn('User not found with ID: %s', userId);
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
            return;
        } catch (error) {
            logger.error(
                'Error in getUserById controller for ID %s: %s',
                req.params.id,
                getErrorMessage(error)
            );
            res.status(500).json({ message: 'Error fetching user' });
            return;
        }
    }

    public async getAllHelpers(req: Request, res: Response): Promise<void> {
        try {
            const helpers = await this._userService.getAllHelpers();
            res.status(200).json(helpers);
            return;
        } catch (error) {
            logger.error('Error in getAllHelpers controller: %s', getErrorMessage(error));
            res.status(500).json({ message: 'Error fetching helpers' });
            return;
        }
    }

    public async getHelperById(req: Request, res: Response): Promise<void> {
        try {
            const helperId = parseInt(req.params.id);
            if (isNaN(helperId)) {
                logger.warn('Invalid helper ID: %s:', helperId);
                res.status(400).json({ message: 'Invalid helper ID' });
                return;
            }
            const helper = await this._userService.findHelper(helperId);
            if (!helper) {
                logger.warn('Helper not found with ID: %s', helperId);
                res.status(404).json({ message: 'Helper not found' });
                return;
            }
            res.status(200).json(helper);
            return;
        } catch (error) {
            logger.error(
                'Error in getHelperById controller for ID %s: %s',
                req.params.id,
                getErrorMessage(error)
            );
            res.status(500).json({ message: 'Error fetching helper' });
            return;
        }
    }

    public async getAllStudents(req: Request, res: Response): Promise<void> {
        try {
            const students = await this._userService.findAllStudents();
            res.status(200).json(students);
            return;
        } catch (error) {
            logger.error('Error in getAllStudents controller: %s', getErrorMessage(error));
            res.status(500).json({ message: 'Error fetching students' });
            return;
        }
    }

    public async getStudentById(req: Request, res: Response): Promise<void> {
        try {
            const studentId = parseInt(req.params.id);
            if (isNaN(studentId)) {
                logger.warn('Invalid student ID: %s');
                res.status(400).json({ message: 'Invalid student ID' });
                return;
            }
            const student = await this._userService.findStudent(studentId);
            if (!student) {
                logger.warn('Student not found with ID: %s', studentId);
                res.status(404).json({ message: 'Student not found' });
                return;
            }
            res.status(200).json(student);
            return;
        } catch (error) {
            logger.error(
                'Error in getStudentById controller for ID %s: %s',
                req.params.id,
                getErrorMessage(error)
            );
            res.status(500).json({ message: 'Error fetching student' });
            return;
        }
    }

    // public async deleteUser(req: Request, res: Response): Promise<void> {
    //     try {
    //         const userId = parseInt(req.params.id);

    //         const isDelete = req.body;

    //         if (isNaN(userId)) {
    //             res.status(500).json({ error: 'Erreur interne du serveur' });
    //         }
    //         // Trouver l'utilisateur
    //         const user = await userService.deleteUser(userId, isDelete);

    //         if (!user) {
    //             res.status(400).json({ error: 'Une erreur est survenue lors de la suppression' });
    //             return;
    //         }

    //         res.status(200).json({ message: 'Utilisateur supprimé "lg"' });
    //         return;
    //     } catch (error) {
    //         console.error("Erreur lors de la suppression de l'utilisateur :", error);
    //         res.status(500).json({ error: 'Erreur interne du serveur' });
    //         return;
    //     }
    // }
}

export default UserController;
