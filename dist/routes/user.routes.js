"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userRouter = (0, express_1.Router)();
const _userController = new user_controller_1.default();
// Afficher tous les utilisateurs
userRouter.get('/', _userController.getAllUsers.bind(_userController));
// Afficher tous les helpers
userRouter.get('/helpers', _userController.getAllHelpers.bind(_userController));
// Afficher detail d'un helper
userRouter.get('/helpers/:id', _userController.getHelperById.bind(_userController));
// Supprimer un helper
userRouter.post('/helpers/:id', _userController.deleteUser.bind(_userController));
// Afficher tous les étudiants
userRouter.get('/students', _userController.getAllStudents.bind(_userController));
// Afficher detail d'un étudant
userRouter.get('/students/:id', _userController.getStudentById.bind(_userController));
//supprimer un étudant
userRouter.post('/students/:id', _userController.deleteUser.bind(_userController));
exports.default = userRouter;
