import * as jwt from 'jsonwebtoken';

export interface I_JwtPayloadExtended extends jwt.JwtPayload {
    userId: number; // Ajout de userId pour correspondre au payload
    userEmail: string;
    userBirthdate?: string;
}
