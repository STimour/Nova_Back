"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor() {
        this.WORK_DONE = true;
    }
    verifyUserData(userData) {
        let isUserDataValid = true;
        if (!userData.password ||
            userData.password.length < 8 ||
            !userData.email ||
            !userData.email.includes('@') ||
            userData.email.includes(' ') ||
            userData.email.includes('<') ||
            userData.email.includes('>') ||
            !userData.firstname ||
            !userData.lastname ||
            !userData.birthdate ||
            !userData.role) {
            return !isUserDataValid;
        }
        return isUserDataValid;
    }
}
exports.BaseService = BaseService;
