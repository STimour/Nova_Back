import { IUser } from '../models/interfaces/IUser';

export class BaseService {
    public readonly IS_WORK_DONE: boolean;

    constructor() {
        this.IS_WORK_DONE = true;
    }

    public hashPassword(password: string): string {
        const hashedPassword = '';

        return hashedPassword;
    }

    public verifyUserData(userData: IUser): boolean {
        let isUserDataValid: boolean = true;

        if (
            !userData.password ||
            userData.password.length < 8 ||
            !userData.email ||
            !userData.email.includes('@') ||
            userData.email.includes(' ') ||
            !userData.firstname ||
            !userData.lastname ||
            !userData.sexe ||
            !userData.birthdate ||
            !userData.role
        ) {
            return !isUserDataValid;
        }

        return isUserDataValid;
    }
}
