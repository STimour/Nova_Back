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
const Availability_model_1 = require("./../models/Availability.model");
const Reputation_model_1 = require("./../models/Reputation.model");
const User_model_1 = require("../models/User.model");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler_middlewares_1 = require("../middlwares/errorHandler.middlewares");
const error_messages_1 = __importDefault(require("../utils/error.messages"));
class UserRepository {
    constructor() {
        this.USER_FOUND = true;
    }
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_model_1.User.findAll();
                if (!users || users.length === 0) {
                    logger_1.default.warn(error_messages_1.default.errorFetchingUsers());
                    return undefined;
                }
                return users;
            }
            catch (error) {
                logger_1.default.error('Error in UserRepository.findAllUsers: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return undefined;
            }
        });
    }
    findUser(id, deleted) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereClause = { id: id };
                if (typeof deleted !== 'undefined') {
                    whereClause.deleted = deleted;
                }
                const user = yield User_model_1.User.findOne({
                    where: whereClause
                });
                if (user === null) {
                    logger_1.default.error('User for id %d: %s wasn\'t found', id);
                    return null;
                }
                return user;
            }
            catch (error) {
                logger_1.default.error('Error in UserRepository.findUser: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return null;
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_model_1.User.findOne({
                    where: { email: email }
                });
                if (user === null) {
                    return undefined;
                }
                return user;
            }
            catch (error) {
                logger_1.default.error('Error in UserRepository.findUserByEmail: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return undefined;
            }
        });
    }
    findAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield User_model_1.User.findAll({ where: { role: 'student' } });
            }
            catch (error) {
                logger_1.default.error('Error in UserRepository.findAllStudents: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return undefined;
            }
        });
    }
    findAllHelpers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_model_1.User.findAll({
                    where: { role: 'helper' },
                    include: [{ model: Reputation_model_1.Reputation, as: 'reputations' }]
                });
                if (!users || users.length === 0) {
                    logger_1.default.error('No helpers were found');
                    return undefined;
                }
                return users;
            }
            catch (error) {
                logger_1.default.error('Error in UserRepository.findAllHelpers: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return undefined;
            }
        });
    }
    isUserExists(email_1, firstname_1) {
        return __awaiter(this, arguments, void 0, function* (email, firstname, deleted = false) {
            try {
                const user = yield User_model_1.User.findOne({
                    where: { email: email, firstname: firstname, deleted }
                });
                if (user !== null)
                    return this.USER_FOUND;
                return !this.USER_FOUND;
            }
            catch (error) {
                logger_1.default.error('Error in UserRepository.verifyUserBeforeInscription for %s %s: %s', firstname, email, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return this.USER_FOUND;
            }
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield User_model_1.User.create(user);
                if (!newUser) {
                    logger_1.default.warn('UserRepository.createUser: Failed to create user %s %s', user.firstname, user.lastname);
                    return false;
                }
                return true;
            }
            catch (error) {
                logger_1.default.error('Error in UserRepository.createUser for %s %s: %s', user.firstname, user.lastname, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return false;
            }
        });
    }
    findHelper(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const helper = yield User_model_1.User.findOne({
                    where: { id: id, role: 'helper' },
                    include: [
                        { model: Reputation_model_1.Reputation, as: 'reputations' },
                        { model: Availability_model_1.Availability, as: 'availabilities' }
                    ]
                });
                if (helper === null) {
                    logger_1.default.error('Helper for id %d: %s wasn\'t found', id);
                    return undefined;
                }
                return helper;
            }
            catch (error) {
                logger_1.default.error('Error in UserRepository.findById for id %d: %s', id, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return undefined;
            }
        });
    }
    findStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield User_model_1.User.findOne({ where: { id: id, role: 'student' } });
                if (student === null) {
                    logger_1.default.error('Student for id %d: %s wasn\'t found', id);
                    return undefined;
                }
                return student;
            }
            catch (error) {
                logger_1.default.error('Error in UserRepository.findById for id %d: %s', id, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return undefined;
            }
        });
    }
    deleteLogically(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereClause = { id: id, deleted: false };
                const [affectedRows] = yield User_model_1.User.update({ deleted: true }, { where: { whereClause } });
                if (affectedRows === 0) {
                    logger_1.default.warn(error_messages_1.default.invalidUserId(), id);
                    return false;
                }
                return true;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.internalServerError(), id, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return false;
            }
        });
    }
    deleteDefinitely(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const affectedRows = yield User_model_1.User.destroy({ where: { id: id } });
                if (affectedRows === 0) {
                    logger_1.default.warn(error_messages_1.default.invalidUserId(), id);
                    return false;
                }
                return true;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.internalServerError(), id, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return false;
            }
        });
    }
}
exports.default = UserRepository;
