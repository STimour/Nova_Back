"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor() {
        this.IS_WORK_DONE = true;
    }
    hashPassword(password) {
        const hashedPassword = '';
        return hashedPassword;
    }
    verifyUserData(userData) {
        let isUserDataValid = true;
        if (!userData.password ||
            userData.password.length < 8 ||
            !userData.email ||
            !userData.email.includes('@') ||
            userData.email.includes(' ') ||
            !userData.firstname ||
            !userData.lastname ||
            !userData.sexe ||
            !userData.birthdate ||
            !userData.role) {
            return !isUserDataValid;
        }
        return isUserDataValid;
    }
}
exports.BaseService = BaseService;
