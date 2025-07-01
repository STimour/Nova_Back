import { getErrorMessage } from '../middlwares/errorHandler.middlewares';
import { Token } from '../models/Token.model';
import { User } from '../models/User.model';
import ErrorMessages from '../utils/error.messages';
import logger from '../utils/logger';
import { IAuthRepository } from './interfaces/IAuthRepository';

class AuthRepository implements IAuthRepository {
    public async createToken(
        newAuthToken: string,
        userId: number,
        expiresAt: Date
    ): Promise<Token | undefined> {
        try {
            const token: Token = await Token.create({
                token: newAuthToken,
                userId: userId,
                expiresAt: expiresAt
            });

            if (token === null) {
                return undefined;
            }

            return token;
        } catch (error) {
            // TODO - Revoir la gestion des erreurs
            logger.error(
                ErrorMessages.badRequest(),
                newAuthToken,
                userId,
                getErrorMessage(error)
            );
            return undefined;
        }
    }

    public async findToken(tokenString: string): Promise<Token | undefined> {
        try {
            const token: Token | null = await Token.findOne({
                where: {
                    token: tokenString,
                    isActive: true
                }
            });

            if (token === null) {
                return undefined;
            }

            return token as Token;
        } catch (error) {
            logger.error(ErrorMessages.badRequest(), tokenString, getErrorMessage(error));
            return undefined;
        }
    }

    public async desactivateAuthToken(tokenString: string): Promise<boolean> {
        const token: Token | null = await Token.findOne({
            where: {
                token: tokenString,
                isActive: true
            }
        });

        if (token === null) {
            // Token non trouvé ou déjà désactivé
            // TODO - Revoir la gestion des erreurs
            logger.error(ErrorMessages.badRequest(), tokenString);
            return false;
        }

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
            logger.error(ErrorMessages.badRequest(), tokenString);
            return false;
        }

        return true; // Désactivation réussie
    }

    // utilisé pour l'aut mais avoir une autre façon pour ne pas retourner le mdp
    public async findUserByEmail(email: string): Promise<User | undefined> {
        try {
            const user: User | null = await User.findOne({
                where: { email: email }
            });

            if (user === null) {
                return undefined;
            }

            return user;
        } catch (error) {
            logger.error(ErrorMessages.errorFetchingUser(), getErrorMessage(error));
            return undefined;
        }
    }
}
export default AuthRepository;
