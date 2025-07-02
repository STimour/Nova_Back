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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_middlewares_1 = require("../middlwares/errorHandler.middlewares");
const auth_service_1 = __importDefault(require("../services/auth.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
const logger_1 = __importDefault(require("../utils/logger"));
class AutController {
    constructor() {
        this._authService = new auth_service_1.default();
        this._userService = new user_service_1.default();
    }
    //TODO - revoir le type de newUser car le front envoie aussi les SkillsCategorie - plus de detail dans le controller 
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let estInscrit;
                const newUser = req.body;
                estInscrit = yield this._userService.createUser(newUser);
                if (!estInscrit) {
                    res.status(400).json({ message: 'Error creating user' });
                    return;
                }
                const { password } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
                res.status(201).json(userWithoutPassword);
                return;
            }
            catch (error) {
                logger_1.default.error('Error in createUser controller: %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                res.status(500).json({ message: 'Error creating user' });
                return;
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { email, password, saveConnexion } = req.body;
                if (!email || !password) {
                    res.status(400).json({ message: 'Email and password are required' });
                    return;
                }
                const user = yield this._authService.findUserByEmail(email);
                if (!user) {
                    res.status(401).json({ message: 'Invalid credentials' });
                    return;
                }
                const isPasswordValid = yield this._authService.verifyPassword(user.password, password);
                if (!isPasswordValid) {
                    res.status(401).json({ message: 'Invalid credentials' });
                    return;
                }
                const token = yield this._authService.createAuthToken(user.id, user.email, saveConnexion, (_a = user.birthdate) === null || _a === void 0 ? void 0 : _a.toISOString());
                res.status(200).json({ token });
                return;
            }
            catch (error) {
                logger_1.default.error('Error in auth.controller in login: %s, %s');
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenString = req.headers.authorization;
                if (!(yield this._authService.desactivateAuthToken(tokenString))) {
                    res.status(401).json({ message: 'Internal Server Error' });
                    return;
                }
                res.status(200).json({ message: 'Logout successful' });
                return;
            }
            catch (error) {
                logger_1.default.error('Error in auth.controller in logout: %s, %s', (0, errorHandler_middlewares_1.getErrorMessage)(error));
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = AutController;
