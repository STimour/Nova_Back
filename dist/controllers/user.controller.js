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
const user_service_1 = __importDefault(require("../services/user.service"));
const errorHandler_middlewares_1 = require("../middlwares/errorHandler.middlewares"); // Importer pour logger
const logger_1 = __importDefault(require("../utils/logger"));
const error_messages_1 = __importDefault(require("../utils/error.messages"));
//TODO - revoir le model User - peut être vaut mieux separer les deux types et avoir deux tables
class UserController {
    constructor() {
        this._userService = new user_service_1.default();
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this._userService.findAllUsers();
                if (users === undefined) {
                    res.status(404).json({ message: 'No users found' });
                    return;
                }
                res.status(200).json(users);
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching users' });
                return;
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.id);
                if (isNaN(userId)) {
                    res.status(400).json({ message: 'Invalid user ID' });
                    return;
                }
                const user = yield this._userService.findUser(userId);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.status(200).json(user);
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching user' });
                return;
            }
        });
    }
    getAllHelpers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const helpers = yield this._userService.getAllHelpers();
                if (helpers === undefined) {
                    res.status(404).json({ message: 'No users found' });
                    return;
                }
                res.status(200).json(helpers);
                return;
            }
            catch (error) {
                logger_1.default.error('Error in getAllHelpers controller: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                res.status(500).json({ message: 'Error fetching helpers' });
                return;
            }
        });
    }
    getHelperById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const helperId = parseInt(req.params.id);
                if (isNaN(helperId)) {
                    logger_1.default.warn('Invalid helper ID: %s:', helperId);
                    res.status(400).json({ message: 'Invalid helper ID' });
                    return;
                }
                const helper = yield this._userService.findHelper(helperId);
                if (!helper) {
                    res.status(404).json({ message: 'Helper not found' });
                    return;
                }
                res.status(200).json(helper);
                return;
            }
            catch (error) {
                logger_1.default.error('Error in getHelperById controller for ID %s: %s', req.params.id, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                res.status(500).json({ message: 'Error fetching helper' });
                return;
            }
        });
    }
    getAllStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield this._userService.findAllStudents();
                if (students === undefined) {
                    res.status(404).json({ message: error_messages_1.default.errorFetchingUsers });
                    return;
                }
                res.status(200).json(students);
                return;
            }
            catch (error) {
                logger_1.default.error('Error in getAllStudents controller: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                res.status(500).json({ message: 'Error fetching students' });
                return;
            }
        });
    }
    getStudentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = parseInt(req.params.id);
                if (isNaN(studentId)) {
                    logger_1.default.warn('Invalid student ID: %s');
                    res.status(400).json({ message: 'Invalid student ID' });
                    return;
                }
                const student = yield this._userService.findStudent(studentId);
                if (!student) {
                    logger_1.default.warn('Student not found with ID: %s', studentId);
                    res.status(404).json({ message: 'Student not found' });
                    return;
                }
                res.status(200).json(student);
                return;
            }
            catch (error) {
                logger_1.default.error('Error in getStudentById controller for ID %s: %s', req.params.id, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                res.status(500).json({ message: 'Error fetching student' });
                return;
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userToDelete = req.body;
                if (userToDelete === '') {
                    logger_1.default.error(error_messages_1.default.forbidden(), JSON.stringify(userToDelete));
                    res.status(400).json({ message: error_messages_1.default.internalServerError() });
                    return;
                }
                if (isNaN(parseInt(userToDelete.id))) {
                    logger_1.default.error(error_messages_1.default.invalidUserId(), JSON.stringify(userToDelete));
                    res.status(400).json({ message: error_messages_1.default.internalServerError() });
                    return;
                }
                if (!(yield this._userService.findUser(parseInt(userToDelete.id)))) {
                    logger_1.default.error(error_messages_1.default.notFound(), JSON.stringify(userToDelete));
                    res.status(400).json({ message: error_messages_1.default.internalServerError() });
                    return;
                }
                if (!(yield this._userService.deleteUser(userToDelete))) {
                    logger_1.default.error(error_messages_1.default.notFound(), JSON.stringify(userToDelete));
                    res.status(400).json({ message: error_messages_1.default.internalServerError() });
                    return;
                }
                res.status(204).json('Deleted');
            }
            catch (error) {
                logger_1.default.error('Error in deleteUser controller for ID %s: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                res.status(500).json({ message: 'Error fetching student' });
                return;
            }
        });
    }
}
exports.default = UserController;
