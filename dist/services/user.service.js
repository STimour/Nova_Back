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
const base_service_1 = require("./base.service");
const errorHandler_middlewares_1 = require("../middlwares/errorHandler.middlewares");
const logger_1 = __importDefault(require("../utils/logger"));
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
                return users;
            }
            catch (error) {
                logger_1.default.error('Error in UserService.findAllUsers: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    findUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userRepository.findUser(id);
                return user;
            }
            catch (error) {
                logger_1.default.error('Error in UserService.findUser: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userRepository.findUserByEmail(email);
                if (user === undefined) {
                    logger_1.default.info('User not found: %s', email);
                    return undefined;
                }
                return user;
            }
            catch (error) {
                logger_1.default.error('Error in UserService.findUserByEmail: %s; %s', email, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return undefined;
            }
        });
    }
    getAllHelpers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const helpers = yield this._userRepository.findAllHelpers();
                return helpers;
            }
            catch (error) {
                logger_1.default.error('Error in UserService.getAllHelpers: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    findHelper(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const helper = yield this._userRepository.findHelper(id);
                return helper;
            }
            catch (error) {
                logger_1.default.error('Error in UserService.findHelper: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    findAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield this._userRepository.findAllStudents();
                return students;
            }
            catch (error) {
                logger_1.default.error('Error in UserService.findAllStudents: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
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
                logger_1.default.error('Error in UserService.findStudent: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Dans la version finale il faudrait changer le type de retour pour gérér au mieux les cas avec des utilisateur existant
            try {
                if (!this.verifyUserData(userData))
                    return !this.IS_USER_DATA_VALID;
                const password = this._authService.hashPassword(userData.password);
                userData.password = (yield password).toString();
                const isUserExists = yield this._userRepository.isUserExists(userData.email, userData.firstname);
                if (isUserExists) {
                    logger_1.default.warn('User already exists', userData.firstname, userData.lastname);
                    return !this.IS_NEW_USER;
                }
                const isUserCreated = yield this._userRepository.createUser(userData);
                if (!isUserCreated) {
                    logger_1.default.warn('Error creating user', userData.firstname, userData.lastname);
                    return !this.IS_WORK_DONE;
                }
                return this.IS_WORK_DONE;
            }
            catch (error) {
                // a supprimer pour la prod
                console.error('Error creating user:', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                logger_1.default.error('Error creating user:', userData.firstname, userData.lastname, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                throw error;
            }
        });
    }
}
exports.default = UserService; // Ou injectez les dépendances si vous utilisez un conteneur d'injection
