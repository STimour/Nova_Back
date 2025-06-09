import { Request } from 'express';
import { User } from '../models/User.model';
import { I_JwtPayloadExtended } from './jwt.extends';

export interface AuthenticatedRequest extends Request {
    user?: User;
    tokenPayload?: I_JwtPayloadExtended;
}
