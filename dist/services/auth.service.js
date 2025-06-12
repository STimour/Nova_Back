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
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthService = void 0;
// src/services/base.service.ts
const Token_model_1 = require('../models/Token.model');
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const argon2_1 = __importDefault(require('argon2'));
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
class AuthService {
    constructor() {
        this.JWT_PREFIX = 'Bearer';
        this.DEFAULT_SESSION_HOURS = 1; // Pour une session normale
        this.REMEMBER_ME_SESSION_DAYS = 365; // Pour "se souvenir de moi"
        if (!process.env.JWT_SECRET) {
            throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
        }
        this.JWT_SECRET = process.env.JWT_SECRET;
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield argon2_1.default.hash(password);
            } catch (error) {
                console.error('Error hashing password:', error);
                throw new Error('Erreur lors du hachage du mot de passe.');
            }
        });
    }
    verifyPassword(hashedPassword, plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield argon2_1.default.verify(hashedPassword, plainPassword);
            } catch (error) {
                console.error('Error verifying password:', error);
                return false;
            }
        });
    }
    createAuthToken(userId, userEmail, saveConnexion, userBirthdate) {
        return __awaiter(this, void 0, void 0, function* () {
            // La vérification de JWT_SECRET est maintenant dans le constructeur
            if (!this.JWT_SECRET) {
                // Garder une vérification par sécurité, bien que le constructeur doive l'attraper
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
                expirationDate = new Date(
                    now.getTime() + this.REMEMBER_ME_SESSION_DAYS * 24 * 60 * 60 * 1000
                );
                jwtExpiresIn = `${this.REMEMBER_ME_SESSION_DAYS}d`;
            } else {
                // Session normale
                expirationDate = new Date(
                    now.getTime() + this.DEFAULT_SESSION_HOURS * 60 * 60 * 1000
                );
                jwtExpiresIn = `${this.DEFAULT_SESSION_HOURS}h`;
            }
            const optionJWT = {
                expiresIn: jwtExpiresIn,
                algorithm: 'HS256'
            };
            const tokenString = jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, optionJWT);
            try {
                const newAuthToken = yield Token_model_1.Token.create({
                    token: tokenString,
                    userId: userId,
                    // userEmail: userEmail, // Assurez-vous que votre modèle Token a bien ce champ si nécessaire
                    isActive: true,
                    expiresAt: expirationDate
                });
                if (!newAuthToken) {
                    throw new Error("Impossible de créer le token d'authentification.");
                }
                return `${this.JWT_PREFIX} ${tokenString}`;
            } catch (error) {
                console.error('Error creating auth token:', error);
                throw new Error("Impossible de créer le token d'authentification.");
            }
        });
    }
    verifyAuthToken(tokenString) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const token = yield Token_model_1.Token.findOne({
                    where: {
                        token: tokenString,
                        isActive: true
                    }
                });
                if (!token || !token.isActive) {
                    return false; // Token non trouvé ou inactif
                }
                if (token.expiresAt && token.expiresAt < now) {
                    return false; // Token expiré
                }
                return true; // Token valide
            } catch (error) {
                console.error('Error verifying auth token:', error);
                return false;
            }
        });
    }
    analyseToken(fullTokenString) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fullTokenString || typeof fullTokenString !== 'string') {
                console.warn('analyseToken: fullTokenString is missing or not a string');
                return null;
            }
            try {
                const parts = fullTokenString.split(' ');
                if (parts.length !== 2 || parts[0] !== this.JWT_PREFIX) {
                    console.warn(
                        `analyseToken: Invalid token format. Expected '${this.JWT_PREFIX} <token>'`
                    );
                    return null;
                }
                const tokenString = parts[1];
                let decodedPayload;
                try {
                    decodedPayload = jsonwebtoken_1.default.verify(tokenString, this.JWT_SECRET);
                } catch (jwtError) {
                    console.warn(
                        `analyseToken: JWT verification failed - ${jwtError.name}: ${jwtError.message}`
                    );
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
                    console.warn(
                        'analyseToken: Token not found in DB, is inactive, or userId mismatch.'
                    );
                    return null;
                }
                return decodedPayload;
            } catch (error) {
                // any pour attraper toutes les erreurs potentielles
                console.error('Error analysing token:', error.message); // Log seulement le message pour éviter trop de verbosité
                return null;
            }
        });
    }
    deactivateAuthToken(tokenString) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updatedCount] = yield Token_model_1.Token.update(
                    { isActive: false },
                    {
                        where: {
                            token: tokenString,
                            isActive: true
                        }
                    }
                );
                if (updatedCount === 0) {
                    throw new Error(`Token not found or already inactive: ${tokenString}`);
                }
                return true; // Désactivation réussie
            } catch (error) {
                console.error('Error deactivating auth token:', error);
                throw new Error("Impossible de désactiver le token d'authentification.");
            }
        });
    }
}
exports.AuthService = AuthService;
