import { getErrorMessage } from '../middlwares/errorHandler.middlewares';
import { Token } from '../models/Token.model';
import logger from '../utils/logger';

class AuthRepository {
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
            logger.error(
                'Error while verifing token: %s, %d; error: %s',
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
            logger.error('Error while verifing token: %s', tokenString, getErrorMessage(error));
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
            logger.error('Error while desactivateAuthToken, token: %s, was not found', tokenString);
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
            logger.error('Error while desactivateAuthToken: %s:', tokenString);
            return false;
        }

        return true; // Désactivation réussie
    }
}
export default AuthRepository;
