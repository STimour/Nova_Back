import { Request } from 'express';
import { User } from '../models/User.model';
import { IJwtPayloadExtended } from './jwt.extends';

export interface AuthenticatedRequest extends Request {
    user?: User;
    tokenPayload?: IJwtPayloadExtended;
}
