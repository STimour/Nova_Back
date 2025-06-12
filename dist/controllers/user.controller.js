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
const user_service_1 = __importDefault(require('../services/user.service'));
const errorHandler_middlewares_1 = require('../middlwares/errorHandler.middlewares'); // Importer pour logger
const logger_1 = __importDefault(require('../utils/logger'));
class UserController {
    constructor() {}
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_service_1.default.findAllUsers();
                if (users.length === 0) {
                    logger_1.default.warn('No users found');
                    res.status(404).json({ message: 'No users found' });
                    return;
                }
                res.status(200).json(users);
                return;
            } catch (error) {
                logger_1.default.error(
                    'Error in getAllUsers controller: %s',
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                res.status(500).json({ message: 'Error fetching users' });
                return;
            }
        });
    }
    getAllHelpers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const helpers = yield user_service_1.default.getAllHelpers();
                res.status(200).json(helpers);
                return;
            } catch (error) {
                logger_1.default.error(
                    'Error in getAllHelpers controller: %s',
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
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
                const helper = yield user_service_1.default.findHelper(helperId);
                if (!helper) {
                    logger_1.default.warn('Helper not found with ID: %s', helperId);
                    res.status(404).json({ message: 'Helper not found' });
                    return;
                }
                res.status(200).json(helper);
                return;
            } catch (error) {
                logger_1.default.error(
                    'Error in getHelperById controller for ID %s: %s',
                    req.params.id,
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                res.status(500).json({ message: 'Error fetching helper' });
                return;
            }
        });
    }
    getAllStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield user_service_1.default.findAllStudents();
                res.status(200).json(students);
                return;
            } catch (error) {
                logger_1.default.error(
                    'Error in getAllStudents controller: %s',
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
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
                const student = yield user_service_1.default.findStudent(studentId);
                if (!student) {
                    logger_1.default.warn('Student not found with ID: %s', studentId);
                    res.status(404).json({ message: 'Student not found' });
                    return;
                }
                res.status(200).json(student);
                return;
            } catch (error) {
                logger_1.default.error(
                    'Error in getStudentById controller for ID %s: %s',
                    req.params.id,
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                res.status(500).json({ message: 'Error fetching student' });
                return;
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let estInscrit;
                const newUser = req.body;
                estInscrit = yield user_service_1.default.createUser(newUser);
                if (!estInscrit) {
                    res.status(400).json({ message: 'Error creating user' });
                    return;
                }
                res.status(201).json(newUser);
                return;
            } catch (error) {
                logger_1.default.error(
                    'Error in createUser controller: %s',
                    (0, errorHandler_middlewares_1.getErrorMessage)(error)
                );
                res.status(500).json({ message: 'Error creating user' });
                return;
            }
        });
    }
}
exports.default = UserController;
