import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { BaseController } from './base.controller';
import userService from '../services/user.service';

class UserController extends BaseController {
    constructor() {
        super();
    }

    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const newUser = await User.create(req.body);

            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: 'Error creating user', error });
        }
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (e) {
            res.status(500).json({ message: 'Error fetching user', error: e });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const [updatedRows] = await User.update(req.body, {
                where: { id: req.params.id }
            });
            if (updatedRows === 0) {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.status(200).json({ message: 'User updated successfully' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id);
        
            const isDelete = req.body;

            if(isNaN(userId)){
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
            // Trouver l'utilisateur
            const user = await userService.deleteUser(userId, isDelete)

            if (user) {
                res.status(400).json({ error: 'Une erreur est survenue lors de la suppression' });
                return;
            }

            if(isDelete){
                await user.destroy();
                res.status(200).json({ message: 'Utilisateur supprimé "ph"' });
                return;
            }

            // Suppression logique
            user!.deleted = false;
            let deletedUser: User = await user!.save();

            if (!deletedUser.deleted) {
                res.status(400).json({ error: 'Une erreur est survenue lors de la suppression' });
                return;
            }

            res.status(200).json({ message: 'Utilisateur supprimé "lg"' });
            return;
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
            return;
        }
    }

    public async getAllHelpers(req: Request, res: Response): Promise<void> {
        try {
            const users = await User.findAll({
                where: {
                    role: 'helper',
                    deleted: false
                }
            });
            res.status(200).json(users);
            return;
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
            return;
        }
    }
}

export default new UserController();
