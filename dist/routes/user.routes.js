"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userRouter = (0, express_1.Router)();
const _userController = new user_controller_1.default();
userRouter.get('/', _userController.getAllUsers.bind(_userController));
userRouter.get('/helpers', _userController.getAllHelpers.bind(_userController));
userRouter.get('/helpers/:id', _userController.getHelperById.bind(_userController));
userRouter.get('/students', _userController.getAllStudents.bind(_userController));
userRouter.get('/students/:id', _userController.getStudentById.bind(_userController));
exports.default = userRouter;
