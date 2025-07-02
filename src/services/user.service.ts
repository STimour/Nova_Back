import UserRepository from './../repositories/user.repository';
import AuthService from './../services/auth.service';
import { User } from '../models/User.model';
import { IUser } from '../models/interfaces/IUser';
import { BaseService } from './base.service';
import { getErrorMessage } from '../middlwares/errorHandler.middlewares';
import logger from '../utils/logger';
import { IUserToDelete } from '../models/interfaces/IUserToDelete.interface';
import ErrorMessages from '../utils/error.messages';
import { ReputationHistoryService } from './reputationHistory.service';
import { HelperWithNote } from '../typeExtends/user.extends';
import sequelize from '../configDB/db';

//TODO -  || utiliser la class ErrorMessages
//TODO - revoir la gestion des types de renvoi pour tous le flux des methodes

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
            if (users === undefined) return undefined;
            return users;
        } catch (error) {
            logger.error('Error in UserService.findAllUsers: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async findUser(id: number): Promise<User | null> {
        try {
            const user: User | null = await this._userRepository.findUser(id);
            if (user === null) return null;
            return user;
        } catch (error) {
            logger.error('Error in UserService.findUser: %s', getErrorMessage(error));
            throw error;
        }
    }

    /**
     * Retourne tous les helpers avec leur note hebdomadaire.
     */
    public async getAllHelpers(): Promise<HelperWithNote[] | undefined> {
        try {
            const helpers: HelperWithNote[] | undefined =
                await this._userRepository.findAllHelpers();

            if (helpers === undefined) return undefined;

            return helpers;
        } catch (error) {
            logger.error('Error in UserService.getAllHelpers: %s', getErrorMessage(error));
            throw error;
        }
    }

    /**
     * Retourne un helper avec sa note hebdomadaire.
     */
    public async findHelper(id: number): Promise<any | undefined> {
        try {
            const helper: User | undefined = await this._userRepository.findHelper(id);
            if (!helper) return undefined;
            const reputationHistoryService = new ReputationHistoryService();
            const noteSemaine = await reputationHistoryService.getLastWeeklyNote(helper.id);
            return {
                ...helper.toJSON(),
                noteSemaine: Number(noteSemaine.toFixed(2))
            };
        } catch (error) {
            logger.error('Error in UserService.findHelper: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async findAllStudents(): Promise<User[] | undefined> {
        try {
            const students: User[] | undefined = await this._userRepository.findAllStudents();

            if (students === undefined) {
                return undefined;
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
        let createdUser;
        try {
       
        if (!this.verifyUserData(userData)) return !this.IS_USER_DATA_VALID;

        // Séparation des champs attendus pour User
        const allowedFields = [
            'lastname',
            'firstname',
            'email',
            'password',
            'sexe',
            'birthdate',
            'role',
            'avatar'
        ];
        const userToCreate: any = {};
        for (const key of allowedFields) {
            if (userData[key as keyof IUser] !== undefined) userToCreate[key] = userData[key as keyof IUser];
        }

        // Valeurs par défaut
        userToCreate.deleted = false;
        if (!userToCreate.role) userToCreate.role = 'student';

        // Hash du mot de passe
        const password = await this._authService.hashPassword(userToCreate.password);
        userToCreate.password = password.toString();

        // Vérification existence user
        const isUserExists: boolean = await this._userRepository.isUserExists(
            userToCreate.email,
            userToCreate.firstname
        );
        if (isUserExists) {
            logger.warn('User already exists', userToCreate.firstname, userToCreate.lastname);
            return !this.IS_NEW_USER;
        }

        // Création du user
        const isUserCreated: boolean = await this._userRepository.createUser(userToCreate);
        if (!isUserCreated) {
            logger.warn('Error creating user', userToCreate.firstname, userToCreate.lastname);
            return !this.WORK_DONE;
        }

        //TODO - Liaison Skills et SkillsCategory (faire un truc estethique) et surtout gerer le cas où la liaison n'as pas fonctionnait
        if(this.WORK_DONE){
            createdUser = await User.findOne({ where: { email: userToCreate.email } });
            
            if (Array.isArray(userData.SkillsCategory) && userData.SkillsCategory.length > 0) {
                for (const skillCategoryId of userData.SkillsCategory) {
                    await sequelize.models.UserSkillCategory.create({
                        userId: createdUser?.id,
                        skillCategoryId: skillCategoryId
                    });
                }
            }
        }
        return this.WORK_DONE;
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

        if (user === null) {
            logger.error(ErrorMessages.notFound(), userToDelete.id);
            return false;
        }
        if (!userToDelete.toDelete) {
            await this._userRepository.deleteLogically(userToDelete.id);

            return true;
        }

        if (!(await this._userRepository.deleteLogically(userToDelete.id))) return false;

        return true;
    }
}

export default UserService; // Ou injectez les dépendances si vous utilisez un conteneur d'injection
