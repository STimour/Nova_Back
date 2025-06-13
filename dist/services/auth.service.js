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
// src/services/base.service.ts
const Token_model_1 = require("../models/Token.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../utils/logger"));
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
dotenv_1.default.config();
class AuthService {
    constructor(_authRepository = new auth_repository_1.default()) {
        this.DEFAULT_SESSION_HOURS = 1; // Pour une session normale
        this.REMEMBER_ME_SESSION_DAYS = 365; // Pour "se souvenir de moi"
        this._authRepository = _authRepository;
        if (!process.env.JWT_SECRET) {
            throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
        }
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_PREFIX = 'Bearer';
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield argon2_1.default.hash(password);
            }
            catch (error) {
                console.error('Error hashing password:', error);
                throw new Error('Erreur lors du hachage du mot de passe.');
            }
        });
    }
    verifyPassword(hashedPassword, plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield argon2_1.default.verify(hashedPassword, plainPassword);
            }
            catch (error) {
                console.error('Error verifying password:', error);
                return false;
            }
        });
    }
    createAuthToken(userId, userEmail, saveConnexion, userBirthdate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.JWT_SECRET) {
                throw new Error('JWT_SECRET is not configured. Cannot create token.');
            }
            const now = new Date();
            const payload = {
                userId: userId,
                userEmail: userEmail,
                userBirthdate: userBirthdate
            };
            let expirationDate;
            let jwtExpiresIn;
            if (saveConnexion) {
                // L'utilisateur a coché "se souvenir de moi"
                expirationDate = new Date(now.getTime() + this.REMEMBER_ME_SESSION_DAYS * 24 * 60 * 60 * 1000);
                jwtExpiresIn = `${this.REMEMBER_ME_SESSION_DAYS}d`;
            }
            else {
                // Session normale
                expirationDate = new Date(now.getTime() + this.DEFAULT_SESSION_HOURS * 60 * 60 * 1000);
                jwtExpiresIn = `${this.DEFAULT_SESSION_HOURS}h`;
            }
            const optionJWT = {
                expiresIn: jwtExpiresIn,
                algorithm: 'HS256'
            };
            const tokenString = jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, optionJWT);
            try {
                const newAuthToken = yield this._authRepository.createToken(tokenString, userId, expirationDate);
                if (!newAuthToken) {
                    throw new Error("Impossible de créer le token d'authentification.");
                }
                return `${this.JWT_PREFIX} ${tokenString}`;
            }
            catch (error) {
                logger_1.default.error('Error creating auth token:', error);
                throw new Error("Impossible de créer le token d'authentification.");
            }
        });
    }
    verifyAuthToken(tokenString) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const token = yield this._authRepository.findToken(tokenString);
                if (token === undefined) {
                    return false; // Token non trouvé ou inactif
                }
                if ((token.expiresAt && token.expiresAt < now) || !token.isActive) {
                    return false; // Token expiré
                }
                return true; // Token valide
            }
            catch (error) {
                console.error('Error verifying auth token:', error);
                return false;
            }
        });
    }
    decodePayload(fullTokenString) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fullTokenString || typeof fullTokenString !== 'string') {
                logger_1.default.warn('decodePayload: fullTokenString is missing or not a string');
                return null;
            }
            try {
                const parts = this.splitToken(fullTokenString);
                const tokenString = parts[1];
                let decodedPayload;
                try {
                    decodedPayload = jsonwebtoken_1.default.verify(tokenString, this.JWT_SECRET);
                }
                catch (jwtError) {
                    console.warn(`decodePayload: JWT verification failed - ${jwtError.name}: ${jwtError.message}`);
                    return null;
                }
                const tokenRecord = yield Token_model_1.Token.findOne({
                    where: {
                        token: tokenString,
                        userId: decodedPayload.userId,
                        isActive: true
                    }
                });
                if (!tokenRecord) {
                    logger_1.default.warn('decodePayload: Token not found in DB, is inactive, or userId mismatch.');
                    return null;
                }
                return decodedPayload;
            }
            catch (error) {
                // any pour attraper toutes les erreurs potentielles
                console.error('Error analysing token:', error.message); // Log seulement le message pour éviter trop de verbosité
                return null;
            }
        });
    }
    desactivateAuthToken(tokenString) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = this.splitToken(tokenString);
                const isTokenDesactivated = yield this._authRepository.desactivateAuthToken(token);
                if (!isTokenDesactivated)
                    return false;
                return true;
            }
            catch (error) {
                console.error('Error deactivating auth token:', error);
                throw new Error("Impossible de désactiver le token d'authentification.");
            }
        });
    }
    splitToken(fullTokenString) {
        const parts = fullTokenString.split(' ');
        if (parts.length === 2 && parts[0] === this.JWT_PREFIX) {
            return parts[1];
        }
        return '';
    }
}
exports.default = AuthService;
