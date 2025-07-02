import { NextFunction, Response } from 'express';
import AuthService from '../services/auth.service';
import { AuthenticatedRequest } from '../typeExtends/request.extends';
import { IJwtPayloadExtended } from '../typeExtends/jwt.extends';
import { User } from '../models/User.model';
import { getErrorMessage } from './errorHandler.middlewares';
import logger from '../utils/logger';
import ErrorMessages from '../utils/error.messages';

export class MiddlewareService {
    private readonly _authService: AuthService;

    constructor(_authService = new AuthService()) {
        this._authService = _authService;
    }

    public checkToken = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const fullToken: string | undefined = req.headers.authorization;

        if (!fullToken || typeof fullToken !== 'string') {
            logger.warn(ErrorMessages.missingAuth(), fullToken ?? '');
            res.status(401).json({ error: ErrorMessages.missingAuth() });
            return;
        }

        try {
            const decodedPayload: IJwtPayloadExtended | null =
                await this._authService.decodePayload(fullToken);

            if (decodedPayload === null) {
                logger.warn(ErrorMessages.invalidToken(), fullToken);
                res.status(401).json({ error: ErrorMessages.invalidToken() });
                return;
            }

            const whereClause: Record<string, any> = {
                id: decodedPayload.userId,
                email: decodedPayload.userEmail,
                deleted: false
            };

            const userRecord = await User.findOne({ where: whereClause });

            if (!userRecord) {
                logger.warn(ErrorMessages.forbidden(), JSON.stringify(whereClause));
                res.status(403).json({ error: ErrorMessages.forbidden() });
                return;
            }

            req.user = userRecord;
            req.tokenPayload = decodedPayload;

            next();
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error);
            logger.error(ErrorMessages.internal(), errorMessage);
            res.status(500).json({
                error: ErrorMessages.internal()
            });
        }
    };
}
