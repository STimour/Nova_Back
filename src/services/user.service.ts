import UserRepository from './../repositories/user.repository';
import AuthService from './../services/auth.service';
import { User } from '../models/User.model';
import { IUser } from '../models/interfaces/IUser';
import { BaseService } from './base.service';
import { getErrorMessage } from '../middlwares/errorHandler.middlewares';
import logger from '../utils/logger';
import { IUserToDelete } from '../models/interfaces/IUserToDelete.interface';
import ErrorMessages from '../utils/error.messages';

class UserService extends BaseService {
    private readonly IS_USER_DATA_VALID: boolean;
    private IS_NEW_USER: boolean;

    private readonly _userRepository;
    private readonly _authService;

    constructor() {
        super();
        this._userRepository = new UserRepository();
        this._authService = new AuthService();
        this.IS_USER_DATA_VALID = true;
        this.IS_NEW_USER = true;
    }

    public async findAllUsers(): Promise<User[] | undefined> {
        try {
            const users: User[] | undefined = await this._userRepository.findAllUsers();
            if(users === undefined) return undefined;
            return users;
        } catch (error) {
            logger.error('Error in UserService.findAllUsers: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async findUser(id: number): Promise<User | null> {
        try {
            const user: User | null = await this._userRepository.findUser(id);
            if(user === null) return null;
            return user;
        } catch (error) {
            logger.error('Error in UserService.findUser: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async findUserByEmail(email: string): Promise<User | undefined> {
        try {
            const user: User | undefined = await this._userRepository.findUserByEmail(email);
            if (user === undefined) {
                logger.info('User not found: %s', email);
                return undefined;
            }
            return user;
        } catch (error) {
            logger.error(
                'Error in UserService.findUserByEmail: %s; %s',
                email,
                getErrorMessage(error)
            );
            return undefined;
        }
    }

    public async getAllHelpers(): Promise<User[] | undefined> {
        try {
            const helpers: User[] | undefined = await this._userRepository.findAllHelpers();
            if(helpers === undefined){
                return undefined;
            }
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

    public async findAllStudents(): Promise<User[] | undefined> {
        try {
            const students: User[] | undefined = await this._userRepository.findAllStudents();

            if( students === undefined){
                return undefined
            }
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

            const password = this._authService.hashPassword(userData.password);
            userData.password = (await password).toString();

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

    public async deleteUser(userToDelete: IUserToDelete): Promise<boolean> {
         const user = await this._userRepository.findUser(parseInt(userToDelete.id), false);

        if(user === null){
            logger.error(ErrorMessages.notFound(),
            userToDelete.id);
            return false;
        }
        if(!userToDelete.toDelete){
        await this._userRepository.deleteLogically(userToDelete.id);


        return true;
    }

        if(!await this._userRepository.deleteLogically(userToDelete.id)) return false;

        return true;
    }
}

export default UserService; // Ou injectez les dépendances si vous utilisez un conteneur d'injection
