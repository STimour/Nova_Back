'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserRepository = void 0;
const Availability_model_1 = require('./../models/Availability.model');
const Reputation_model_1 = require('./../models/Reputation.model');
const User_model_1 = require('../models/User.model');
const logger_1 = __importDefault(require('../utils/logger'));
const errorHandler_middlewares_1 = require('../middlwares/errorHandler.middlewares');
class UserRepository {
    constructor() {
        this.USER_NOT_FOUND = true;
    }
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield User_model_1.User.findAll();
            } catch (error) {
                logger_1.default.error(
                    'Error in UserRepository.findAllUsers: %s',
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                throw error;
            }
        });
    }
    findAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield User_model_1.User.findAll({ where: { role: 'student' } });
            } catch (error) {
                logger_1.default.error(
                    'Error in UserRepository.findAllStudents: %s',
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                throw error;
            }
        });
    }
    findAllHelpers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield User_model_1.User.findAll({
                    where: { role: 'helper' },
                    include: [{ model: Reputation_model_1.Reputation, as: 'reputations' }]
                });
            } catch (error) {
                logger_1.default.error(
                    'Error in UserRepository.findAllHelpers: %s',
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                throw error;
            }
        });
    }
    isUserExists(email_1, firstname_1) {
        return __awaiter(this, arguments, void 0, function* (email, firstname, deleted = false) {
            try {
                const user = yield User_model_1.User.findOne({
                    where: { email: email, firstname: firstname, deleted }
                });
                if (user !== null) return !this;
                return false;
            } catch (error) {
                logger_1.default.error(
                    'Error in UserRepository.verifyUserBeforeInscription for %s %s: %s',
                    firstname,
                    email,
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                throw error;
            }
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield User_model_1.User.create(user);
                if (!newUser) {
                    logger_1.default.warn(
                        'UserRepository.createUser: Failed to create user %s %s',
                        user.firstname,
                        user.lastname
                    );
                    return false;
                }
                return true;
            } catch (error) {
                logger_1.default.error(
                    'Error in UserRepository.createUser for %s %s: %s',
                    user.firstname,
                    user.lastname,
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                throw error;
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
                    logger_1.default.error("Helper for id %d: %s wasn't found", id);
                    return undefined;
                }
                return helper;
            } catch (error) {
                logger_1.default.error(
                    'Error in UserRepository.findById for id %d: %s',
                    id,
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                throw error;
            }
        });
    }
    findStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield User_model_1.User.findOne({
                    where: { id: id, role: 'student' }
                });
                if (student === null) {
                    logger_1.default.error("Student for id %d: %s wasn't found", id);
                    return undefined;
                }
                return student;
            } catch (error) {
                logger_1.default.error(
                    'Error in UserRepository.findById for id %d: %s',
                    id,
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;
