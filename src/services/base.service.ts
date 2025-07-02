import { IUser } from '../models/interfaces/IUser';

export class BaseService {
    public readonly WORK_DONE: boolean;

    constructor() {
        this.WORK_DONE = true;
    }

    public verifyUserData(userData: any): boolean {
        let isUserDataValid: boolean = true;

        if (
            !userData.password ||
            userData.password.length < 8 ||
            !userData.email ||
            !userData.email.includes('@') ||
            userData.email.includes(' ') ||
            userData.email.includes('<') ||
            userData.email.includes('>') ||
            !userData.firstname ||
            !userData.lastname ||
            !userData.birthdate ||
            !userData.role
        ) {
            return !isUserDataValid;
        }

        return isUserDataValid;
    }
}
