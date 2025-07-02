"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("./../repositories/user.repository"));
const auth_service_1 = __importDefault(require("./../services/auth.service"));
const User_model_1 = require("../models/User.model");
const base_service_1 = require("./base.service");
const errorHandler_middlewares_1 = require("../middlwares/errorHandler.middlewares");
const logger_1 = __importDefault(require("../utils/logger"));
const error_messages_1 = __importDefault(require("../utils/error.messages"));
const reputationHistory_service_1 = require("./reputationHistory.service");
const db_1 = __importDefault(require("../configDB/db"));
//TODO -  || utiliser la class ErrorMessages
//TODO - revoir la gestion des types de renvoi pour tous le flux des methodes
class UserService extends base_service_1.BaseService {
    constructor() {
        super();
        this._userRepository = new user_repository_1.default();
        this._authService = new auth_service_1.default();
        this.IS_USER_DATA_VALID = true;
        this.IS_NEW_USER = true;
    }
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this._userRepository.findAllUsers();
                if (users === undefined)
                    return undefined;
                return users;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingUsers(), (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    findUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userRepository.findUser(id);
                if (user === null)
                    return null;
                return user;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingUser(), (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    /**
     * Retourne tous les helpers avec leur note hebdomadaire.
     */
    getAllHelpers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const helpers = yield this._userRepository.findAllHelpers();
                if (helpers === undefined)
                    return undefined;
                return helpers;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingHelpers(), (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    /**
     * Retourne un helper avec sa note hebdomadaire.
     */
    findHelper(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const helper = yield this._userRepository.findHelper(id);
                if (!helper)
                    return undefined;
                const reputationHistoryService = new reputationHistory_service_1.ReputationHistoryService();
                const noteSemaine = yield reputationHistoryService.getLastWeeklyNote(helper.id);
                return Object.assign(Object.assign({}, helper.toJSON()), { noteSemaine: Number(noteSemaine.toFixed(2)) });
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingUser(), (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    findAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield this._userRepository.findAllStudents();
                if (students === undefined) {
                    return undefined;
                }
                return students;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingStudents(), (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    findStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield this._userRepository.findStudent(id);
                return student;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingUser(), (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.verifyUserData(userData))
                    return !this.IS_USER_DATA_VALID;
                // Sélectionne uniquement les champs du modèle User
                const allowedFields = [
                    'lastname', 'firstname', 'email', 'password', 'sexe', 'birthdate', 'role', 'avatar'
                ];
                const userToCreate = {};
                for (const key of allowedFields) {
                    if (userData[key] !== undefined)
                        userToCreate[key] = userData[key];
                }
                if (!userToCreate.role)
                    userToCreate.role = 'student';
                //TODO Corriger côté front 
                if (userToCreate.birthdate && typeof userToCreate.birthdate === 'string') {
                    userToCreate.birthdate = new Date(userToCreate.birthdate);
                }
                // Hash du mot de passe
                userToCreate.password = (yield this._authService.hashPassword(userToCreate.password)).toString();
                // Voir si l'utilisateur existe déjà
                const isUserExists = yield this._userRepository.isUserExists(userToCreate.email, userToCreate.firstname);
                if (isUserExists) {
                    logger_1.default.warn('User already exists', userToCreate.firstname, userToCreate.lastname);
                    return !this.IS_NEW_USER;
                }
                // Crée l'utilisateur
                const isUserCreated = yield this._userRepository.createUser(userToCreate.lastname, userToCreate.firstname, userToCreate.email, userToCreate.password, userToCreate.sexe, userToCreate.birthdate, userToCreate.role, userToCreate.avatar);
                if (!isUserCreated) {
                    logger_1.default.warn('Error creating user', userToCreate.firstname, userToCreate.lastname);
                    return !this.WORK_DONE;
                }
                // Récupère l'utilisateur créé pour avoir son id
                const createdUser = yield User_model_1.User.findOne({ where: { email: userToCreate.email } });
                if (!createdUser) {
                    logger_1.default.warn('User not found after creation', userToCreate.email);
                    return !this.WORK_DONE;
                }
                // Liaison SkillsCategory (table user_skill_categories)
                if (Array.isArray(userData.SkillsCategory) && userData.SkillsCategory.length > 0) {
                    for (const skillCategoryId of userData.SkillsCategory) {
                        yield db_1.default.models.UserSkillCategory.create({
                            userId: createdUser.id,
                            skillCategoryId: skillCategoryId
                        });
                    }
                }
                // // Liaison Skill 
                // if (Array.isArray(userData.Skill) && userData.Skill.length > 0) {
                //     for (const skillId of userData.Skill) {
                //         await sequelize.models.UserSkill.create({
                //             userId: createdUser.id,
                //             skillId: skillId
                //         });
                //     }
                // }
                console.log('userToCreate:', userToCreate);
                return this.WORK_DONE;
            }
            catch (error) {
                console.log(error);
                logger_1.default.error(error_messages_1.default.errorCreatingUser(), userData.firstname, userData.lastname, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    deleteUser(userToDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findUser(parseInt(userToDelete.id), false);
            if (user === null) {
                logger_1.default.error(error_messages_1.default.errorDeletingUser(), userToDelete.id);
                return false;
            }
            if (!userToDelete.toDelete) {
                yield this._userRepository.deleteLogically(userToDelete.id);
                return true;
            }
            if (!(yield this._userRepository.deleteLogically(userToDelete.id)))
                return false;
            return true;
        });
    }
}
exports.default = UserService; // Ou injectez les dépendances si vous utilisez un conteneur d'injection
