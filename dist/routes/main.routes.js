"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const auth_middlewares_1 = require("../middlwares/auth.middlewares");
const MainRouter = (0, express_1.Router)();
const _middlewareService = new auth_middlewares_1.MiddlewareService();
MainRouter.use('/auth', auth_routes_1.default);
MainRouter.use('/users', _middlewareService.checkToken, user_routes_1.default);
exports.default = MainRouter;
