"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this._userController = new user_controller_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/', this._userController.getAllUsers.bind(this._userController));
        this.router.get('/helpers', this._userController.getAllHelpers.bind(this._userController));
        this.router.get('/helpers/:id', this._userController.getHelperById.bind(this._userController));
        this.router.get('/students', this._userController.getAllStudents.bind(this._userController));
        this.router.get('/students/:id', this._userController.getStudentById.bind(this._userController));
        this.router.post('/', this._userController.createUser.bind(this._userController));
    }
}
exports.default = new UserRoutes().router;
