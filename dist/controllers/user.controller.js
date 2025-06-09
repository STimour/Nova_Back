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
Object.defineProperty(exports, '__esModule', { value: true });
const User_model_1 = require('../models/User.model');
const baseController_controller_1 = require('./baseController.controller');
class UserController extends baseController_controller_1.BaseController {
    constructor() {
        super();
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_model_1.User.findAll();
                res.status(200).json(users);
            } catch (error) {
                res.status(500).json({ message: 'Error fetching users', error });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield User_model_1.User.create(req.body);
                res.status(201).json(newUser);
            } catch (error) {
                res.status(400).json({ message: 'Error creating user', error });
            }
        });
    }
}
exports.default = new UserController();
