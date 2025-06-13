import { JwtPayload } from 'jsonwebtoken';

export interface IJwtPayloadExtended extends JwtPayload {
    // Ajout de userId pour correspondre au payload
    userId: number; // Ajout de userId pour correspondre au payload
    userEmail: string;
    userBirthdate?: string;
}
