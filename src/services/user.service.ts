import { UserRepository } from './../repositories/user.repository';
import { User } from '../models/User.model';
import { IUser } from '../models/interfaces/IUser';
import { BaseService } from './base.service';
import { getErrorMessage } from '../middlwares/errorHandler.middlewares';
import logger from '../utils/logger';

class UserService extends BaseService {
    private readonly IS_USER_DATA_VALID: boolean;
    private IS_NEW_USER: boolean;

    private readonly _userRepository;

    constructor() {
        super();
        this._userRepository = new UserRepository();
        this.IS_USER_DATA_VALID = true;
        this.IS_NEW_USER = true;
    }

    public async findAllUsers(): Promise<User[]> {
        try {
            const users: User[] = await this._userRepository.findAllUsers();
            return users;
        } catch (error) {
            logger.error('Error in UserService.findAllUsers: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async getAllHelpers(): Promise<User[]> {
        try {
            const helpers: User[] = await this._userRepository.findAllHelpers();
            return helpers;
        } catch (error) {
            logger.error('Error in UserService.getAllHelpers: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async findHelper(id: number): Promise<User | undefined> {
        try {
            const helper: User | undefined = await this._userRepository.findHelper(id);
            return helper;
        } catch (error) {
            logger.error('Error in UserService.findHelper: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async findAllStudents(): Promise<User[]> {
        try {
            const students: User[] = await this._userRepository.findAllStudents();
            return students;
        } catch (error) {
            logger.error('Error in UserService.findAllStudents: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async findStudent(id: number): Promise<User | undefined> {
        try {
            const student: User | undefined = await this._userRepository.findStudent(id);
            return student;
        } catch (error) {
            logger.error('Error in UserService.findStudent: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async createUser(userData: IUser): Promise<boolean> {
        // Dans la version finale il faudrait changer le type de retour pour gérér au mieux les cas avec des utilisateur existant
        try {
            if (!this.verifyUserData(userData)) return !this.IS_USER_DATA_VALID;

            userData.password = this.hashPassword(userData.password);

            const isUserExists: boolean = await this._userRepository.isUserExists(
                userData.email,
                userData.firstname
            );

            if (isUserExists) {
                logger.warn('User already exists', userData.firstname, userData.lastname);
                return !this.IS_NEW_USER;
            }

            const isUserCreated: boolean = await this._userRepository.createUser(userData);

            if (!isUserCreated) {
                logger.warn('Error creating user', userData.firstname, userData.lastname);
                return !this.IS_WORK_DONE;
            }

            return this.IS_WORK_DONE;
        } catch (error) {
            // a supprimer pour la prod
            console.error('Error creating user:', getErrorMessage(error));

            logger.error(
                'Error creating user:',
                userData.firstname,
                userData.lastname,
                getErrorMessage(error)
            );
            throw error;
        }
    }
    // public async deleteUser(id: number, isDelete: boolean) {
    //     // Logique métier pour récupérer un utilisateur par son ID
    //     const deleted: Boolean = true;
    //     if (isDelete === true) {
    //         await this._userRepository.delete(id);
    //     }

    //     await this._userRepository.update(id, deleted);

    //     return true;
    // }

    // ... autres méthodes (getUserById, updateUser, deleteUser avec logique métier)
}

export default new UserService(); // Ou injectez les dépendances si vous utilisez un conteneur d'injection
