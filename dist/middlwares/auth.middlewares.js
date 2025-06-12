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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareService = void 0;
const auth_service_1 = require("../services/auth.service");
const User_model_1 = require("../models/User.model");
const errorHandler_middlewares_1 = require("./errorHandler.middlewares");
class MiddlewareService {
    constructor(_authService = new auth_service_1.AuthService()) {
        this._authService = _authService;
    }
    checkToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullToken = req.headers.authorization;
            if (!fullToken || typeof fullToken !== 'string') {
                return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
            }
            try {
                const decodedPayload = yield this._authService.analyseToken(fullToken);
                if (decodedPayload === null) {
                    return res.status(401).json({ error: 'Invalid, expired, or unauthorized token.' });
                }
                const whereClause = Object.assign({ id: decodedPayload.userId, email: decodedPayload.userEmail, deleted: false }, (decodedPayload.userBirthdate && {
                    birthdate: decodedPayload.userBirthdate
                }));
                const userRecord = yield User_model_1.User.findOne({
                    where: whereClause
                });
                if (!userRecord) {
                    return res.status(403).json({
                        error: 'Forbidden. User associated with the token not found or inactive.'
                    });
                }
                req.user = userRecord;
                req.tokenPayload = decodedPayload;
                next();
            }
            catch (error) {
                const errorMessage = (0, errorHandler_middlewares_1.getErrorMessage)(error);
                console.error('Unexpected error in checkToken middleware:', error);
                if (!res.headersSent) {
                    return res.status(500).json({
                        error: 'Internal server error during token verification.',
                        details: errorMessage
                    });
                }
            }
        });
    }
}
exports.MiddlewareService = MiddlewareService;
