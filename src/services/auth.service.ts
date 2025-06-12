// src/services/base.service.ts
import { Token } from '../models/Token.model';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { IJwtPayloadExtended } from '../typeExtends/jwt.extends';
import logger from '../utils/logger';

dotenv.config();

class AuthService {
    private readonly JWT_SECRET: string;
    private readonly JWT_PREFIX: string;
    private readonly DEFAULT_SESSION_HOURS: number = 1; // Pour une session normale
    private readonly REMEMBER_ME_SESSION_DAYS: number = 365; // Pour "se souvenir de moi"

    constructor() {
        if (!process.env.JWT_SECRET) {
            throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
        }
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_PREFIX = 'Bearer';
    }

    public async hashPassword(password: string): Promise<string> {
        try {
            return await argon2.hash(password);
        } catch (error) {
            console.error('Error hashing password:', error);
            throw new Error('Erreur lors du hachage du mot de passe.');
        }
    }

    public async verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
        try {
            return await argon2.verify(hashedPassword, plainPassword);
        } catch (error) {
            console.error('Error verifying password:', error);
            return false;
        }
    }

    public async createAuthToken(
        userId: number,
        userEmail: string,
        saveConnexion: boolean,
        userBirthdate?: string
    ): Promise<string> {
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

        let expirationDate: Date;
        let jwtExpiresIn: string;

        if (saveConnexion) {
            // L'utilisateur a coché "se souvenir de moi"
            expirationDate = new Date(
                now.getTime() + this.REMEMBER_ME_SESSION_DAYS * 24 * 60 * 60 * 1000
            );
            jwtExpiresIn = `${this.REMEMBER_ME_SESSION_DAYS}d`;
        } else {
            // Session normale
            expirationDate = new Date(now.getTime() + this.DEFAULT_SESSION_HOURS * 60 * 60 * 1000);
            jwtExpiresIn = `${this.DEFAULT_SESSION_HOURS}h`;
        }

        const optionJWT = {
            expiresIn: jwtExpiresIn,
            algorithm: 'HS256'
        };

        const tokenString = jwt.sign(
            payload,
            this.JWT_SECRET as jwt.PrivateKey,
            optionJWT as jwt.SignOptions
        );

        try {
            const newAuthToken = await Token.create({
                token: tokenString,
                userId: userId,
                // userEmail: userEmail, // Assurez-vous que votre modèle Token a bien ce champ si nécessaire
                isActive: true,
                expiresAt: expirationDate
            });

            if (!newAuthToken) {
                throw new Error('Impossible de créer le token d\'authentification.');
            }

            return `${this.JWT_PREFIX} ${tokenString}`;
        } catch (error) {
            console.error('Error creating auth token:', error);
            throw new Error('Impossible de créer le token d\'authentification.');
        }
    }

    public async verifyAuthToken(tokenString: string): Promise<boolean> {
        try {
            const now = new Date();

            const token = await Token.findOne({
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
    }

    public async analyseToken(fullTokenString: string): Promise<IJwtPayloadExtended | null> {
        if (!fullTokenString || typeof fullTokenString !== 'string') {
            logger.warn('analyseToken: fullTokenString is missing or not a string');
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

            let decodedPayload: IJwtPayloadExtended;
            try {
                decodedPayload = jwt.verify(tokenString, this.JWT_SECRET) as IJwtPayloadExtended;
            } catch (jwtError: any) {
                console.warn(
                    `analyseToken: JWT verification failed - ${jwtError.name}: ${jwtError.message}`
                );
                return null;
            }

            const tokenRecord = await Token.findOne({
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
        } catch (error: any) {
            // any pour attraper toutes les erreurs potentielles
            console.error('Error analysing token:', error.message); // Log seulement le message pour éviter trop de verbosité
            return null;
        }
    }

    public async deactivateAuthToken(tokenString: string): Promise<boolean> {
        try {
            const [updatedCount] = await Token.update(
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
            throw new Error('Impossible de désactiver le token d\'authentification.');
        }
    }
}

export default AuthService;
