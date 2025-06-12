import { NextFunction, Response } from 'express';
import AuthService from '../services/auth.service';
import { AuthenticatedRequest } from '../typeExtends/request.extends';
import { IJwtPayloadExtended } from '../typeExtends/jwt.extends';
import { User } from '../models/User.model';
import { getErrorMessage } from './errorHandler.middlewares';

export class MiddlewareService {
    private readonly _authService: AuthService;

    constructor(_authService = new AuthService()) {
        this._authService = _authService;
    }

    public async checkToken(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const fullToken: string | undefined = req.headers.authorization;

        if (!fullToken || typeof fullToken !== 'string') {
            return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
        }

        try {
            const decodedPayload: IJwtPayloadExtended | null =
                await this._authService.analyseToken(fullToken);

            if (decodedPayload === null) {
                return res.status(401).json({ error: 'Invalid, expired, or unauthorized token.' });
            }

            const whereClause: Record<string, any> = {
                id: decodedPayload.userId,
                email: decodedPayload.userEmail,
                deleted: false,
                ...(decodedPayload.userBirthdate && {
                    birthdate: decodedPayload.userBirthdate
                })
            };

            const userRecord = await User.findOne({
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
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error);
            console.error('Unexpected error in checkToken middleware:', error);
            if (!res.headersSent) {
                return res.status(500).json({
                    error: 'Internal server error during token verification.',
                    details: errorMessage
                });
            }
        }
    }
}
