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
            logger.error(ErrorMessages.errorFetchingUsers(), getErrorMessage(error));
            throw error;
        }
    }

    public async findUser(id: number): Promise<User | null> {
        try {
            const user: User | null = await this._userRepository.findUser(id);
            if (user === null) return null;
            return user;
        } catch (error) {
            logger.error(ErrorMessages.errorFetchingUser(), getErrorMessage(error));
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
            logger.error(ErrorMessages.errorFetchingHelpers(), getErrorMessage(error));
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
                helper,
                noteSemaine: Number(noteSemaine.toFixed(2))
            };
        } catch (error) {
            logger.error(ErrorMessages.errorFetchingUser(), getErrorMessage(error));
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
            logger.error(ErrorMessages.errorFetchingStudents(), getErrorMessage(error));
            throw error;
        }
    }

    public async findStudent(id: number): Promise<User | undefined> {
        try {
            const student: User | undefined = await this._userRepository.findStudent(id);
            return student;
        } catch (error) {
            logger.error(ErrorMessages.errorFetchingUser(), getErrorMessage(error));
            throw error;
        }
    }

    public async createUser(userData: any): Promise<boolean> {
        try {
            console.log(userData)
            if (!this.verifyUserData(userData)) return !this.IS_USER_DATA_VALID;

            if (!userData.role) userData.role = 'student';

            //TODO Corriger côté front 
            if (userData.birthdate && typeof userData.birthdate === 'string') {
                userData.birthdate = new Date(userData.birthdate);
            }

            // Hash du mot de passe
            userData.password = (await this._authService.hashPassword(userData.password)).toString();

            // Voir si l'utilisateur existe déjà
            const isUserExists = await this._userRepository.isUserExists(
                userData.email,
                userData.firstname
            );
            if (isUserExists) {
                logger.warn('User already exists', userData.firstname, userData.lastname);
                return !this.IS_NEW_USER;
            }

            // Crée l'utilisateur
            const isUserCreated = await this._userRepository.createUser(
                userData.lastname,
                userData.firstname,
                userData.email,
                userData.password,
                userData.sexe,
                userData.birthdate,
                userData.role,
                userData.avatar
            );
            if (!isUserCreated) {
                logger.warn('Error creating user', userData.firstname, userData.lastname);
                 console.error('Erreur lors de la création user:');
                return !this.WORK_DONE;
            }

            // Récupère l'utilisateur créé pour avoir son id
            // const createdUser = await User.findOne({ where: { email: userData.email } });
            // if (!createdUser) {
            //     logger.warn('User not found after creation', userData.email);
            //     return !this.WORK_DONE;
            // }

            // Liaison SkillsCategory (table user_skill_categories)
            // if (Array.isArray(userData.SkillsCategory) && userData.SkillsCategory.length > 0) {
            //     for (const skillCategoryId of userData.SkillsCategory) {
            //         await sequelize.models.UserSkillCategory.create({
            //             userId: createdUser.id,
            //             skillCategoryId: skillCategoryId
            //         });
            //     }
            // }

            // // Liaison Skill 
            // if (Array.isArray(userData.Skill) && userData.Skill.length > 0) {
            //     for (const skillId of userData.Skill) {
            //         await sequelize.models.UserSkill.create({
            //             userId: createdUser.id,
            //             skillId: skillId
            //         });
            //     }
            // }

            console.log('userData:', userData);

            return this.WORK_DONE;
        } catch (error) {
            console.log(error)
            logger.error(
                ErrorMessages.errorCreatingUser(),
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
            logger.error(ErrorMessages.errorDeletingUser(), userToDelete.id);
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
