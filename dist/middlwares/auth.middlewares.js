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
exports.MiddlewareService = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
const User_model_1 = require("../models/User.model");
const errorHandler_middlewares_1 = require("./errorHandler.middlewares");
const logger_1 = __importDefault(require("../utils/logger"));
const error_messages_1 = __importDefault(require("../utils/error.messages"));
class MiddlewareService {
    constructor(_authService = new auth_service_1.default()) {
        this._authService = _authService;
    }
    checkToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullToken = req.headers.authorization;
            if (!fullToken || typeof fullToken !== 'string') {
                logger_1.default.warn(error_messages_1.default.missingAuth(), fullToken !== null && fullToken !== void 0 ? fullToken : '');
                res.status(401).json({ error: error_messages_1.default.missingAuth() });
                return;
            }
            try {
                const decodedPayload = yield this._authService.decodePayload(fullToken);
                if (decodedPayload === null) {
                    logger_1.default.warn(error_messages_1.default.invalidToken(), fullToken);
                    res.status(401).json({ error: error_messages_1.default.invalidToken() });
                    return;
                }
                const whereClause = Object.assign({ id: decodedPayload.userId, email: decodedPayload.userEmail, deleted: false }, (decodedPayload.userBirthdate && {
                    birthdate: decodedPayload.userBirthdate
                }));
                const userRecord = yield User_model_1.User.findOne({ where: whereClause });
                if (!userRecord) {
                    logger_1.default.warn(error_messages_1.default.forbidden(), JSON.stringify(whereClause));
                    res.status(403).json({ error: error_messages_1.default.forbidden() });
                    return;
                }
                req.user = userRecord;
                req.tokenPayload = decodedPayload;
                next();
            }
            catch (error) {
                const errorMessage = (0, errorHandler_middlewares_1.getErrorMessage)(error);
                logger_1.default.error(error_messages_1.default.internal(), errorMessage);
                res.status(500).json({
                    error: error_messages_1.default.internal()
                });
            }
        });
    }
}
exports.MiddlewareService = MiddlewareService;
