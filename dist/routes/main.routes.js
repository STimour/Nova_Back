"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const auth_middlewares_1 = require("../middlwares/auth.middlewares");
const session_routes_1 = require("./session.routes");
const category_routes_1 = require("./category.routes");
const skill_routes_1 = require("./skill.routes");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const MainRouter = (0, express_1.Router)();
const _middlewareService = new auth_middlewares_1.MiddlewareService();
const _userController = new user_controller_1.default();
// MainRouter.use('/users/helpers', _userController.getAllHelpers.bind(_userController));
MainRouter.use('/auth', auth_routes_1.default);
MainRouter.use('/users', _middlewareService.checkToken, user_routes_1.default);
MainRouter.use('/session/', _middlewareService.checkToken, session_routes_1.sessionRoutes);
MainRouter.use('/categories/', category_routes_1.categoriesRoutes);
MainRouter.use('/skills/', skill_routes_1.skillRoutes);
exports.default = MainRouter;
