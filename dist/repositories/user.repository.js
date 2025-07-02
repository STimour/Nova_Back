"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = require("./../models/User.model");
const Availability_model_1 = require("./../models/Availability.model");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler_middlewares_1 = require("../middlwares/errorHandler.middlewares");
const error_messages_1 = __importDefault(require("../utils/error.messages"));
const node_cache_1 = __importDefault(require("node-cache"));
const reputationHistory_service_1 = require("../services/reputationHistory.service");
const console_1 = require("console");
//TODO - revoir comment on fait le cache - trouver comment créer un service à part
class UserRepository {
    constructor(_reputationHistoryService = new reputationHistory_service_1.ReputationHistoryService()) {
        this._reputationHistoryService = _reputationHistoryService;
        this.USER_FOUND = true;
        this.helpersCache = new node_cache_1.default({ stdTTL: 300 }); // 5 min
        this.reputationCache = new node_cache_1.default({ stdTTL: 432000 }); // 5 jours
    }
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_model_1.User.findAll({ attributes: { exclude: ['password'] } });
                if (!users || users.length === 0) {
                    logger_1.default.warn(error_messages_1.default.errorFetchingUsers());
                    return undefined;
                }
                return users;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingUsers(), (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return undefined;
            }
        });
    }
    findUser(id, deleted) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereClause = { id: id };
                if (typeof deleted !== 'undefined') {
                    whereClause.deleted = deleted;
                }
                const user = yield User_model_1.User.findOne({
                    where: whereClause,
                    attributes: { exclude: ['password'] }
                });
                if (user === null) {
                    logger_1.default.error(error_messages_1.default.errorFetchingUser(), id);
                    return null;
                }
                return user;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingUser(), (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return null;
            }
        });
    }
    findAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield User_model_1.User.findAll({
                    where: { role: 'student' },
                    attributes: { exclude: ['password'] }
                });
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingStudents(), (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return undefined;
            }
        });
    }
    //TODO - Ca serait bien d'alleger cette paté
    findAllHelpers() {
        return __awaiter(this, void 0, void 0, function* () {
            // On chercher si les helpers sont dans le cache
            const cachedHelpers = this.helpersCache.get('allHelpers');
            if (cachedHelpers) {
                // On récupère la reputation du cache si dispo
                for (const helper of cachedHelpers) {
                    let noteSemaine = this.reputationCache.get(`noteSemaine_${helper.id}`);
                    // Si pas en cache, on va la chercher et on la met en cache
                    if (noteSemaine === undefined) {
                        noteSemaine = yield this._reputationHistoryService.getLastWeeklyNote(helper.id);
                    }
                    helper.noteSemaine = noteSemaine;
                }
                return cachedHelpers;
            }
            // sinon on va chercher dans la bdd
            const users = yield User_model_1.User.findAll({
                where: { role: 'helper' },
                attributes: { exclude: ['password'] }
            });
            if (!users || users.length === 0) {
                logger_1.default.error('No helpers were found');
                return undefined;
            }
            // On met en cache court les helpers (sans les reputations) c
            const usersToCache = users.map((u) => u.toJSON());
            this.helpersCache.set('allHelpers', usersToCache);
            for (const helper of usersToCache) {
                let noteSemaine = this.reputationCache.get(`noteSemaine_${helper.id}`);
                if (noteSemaine === undefined) {
                    noteSemaine = yield this._reputationHistoryService.getLastWeeklyNote(helper.id);
                    this.reputationCache.set(`noteSemaine_${helper.id}`, noteSemaine);
                }
                helper.noteSemaine = noteSemaine;
            }
            return usersToCache;
        });
    }
    isUserExists(email_1, firstname_1) {
        return __awaiter(this, arguments, void 0, function* (email, firstname, deleted = false) {
            try {
                const user = yield User_model_1.User.findOne({
                    where: { email: email, firstname: firstname, deleted },
                    attributes: { exclude: ['password'] }
                });
                if (user !== null)
                    return this.USER_FOUND;
                return !this.USER_FOUND;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingUser(), firstname, email, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return this.USER_FOUND;
            }
        });
    }
    createUser(lastname, firstname, email, password, sexe, birthdate, role, avatar) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield User_model_1.User.create({
                    lastname,
                    firstname,
                    email,
                    password,
                    sexe,
                    birthdate,
                    role,
                    avatar
                });
                if (!newUser) {
                    logger_1.default.warn(error_messages_1.default.errorCreatingUser(), firstname, lastname);
                    throw console_1.error;
                }
                return true;
            }
            catch (error) {
                console.log('Erreur lors de la création user:', error);
                logger_1.default.error(error_messages_1.default.errorCreatingUser(), firstname, lastname, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return false;
            }
        });
    }
    findHelper(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // On vérifie si le helper est dans le cache court
            const cachedHelper = this.helpersCache.get('allHelpers');
            if (cachedHelper) {
                const helper = cachedHelper.find((h) => h.id === id);
                if (helper) {
                    // On ajoute la noteSemaine depuis le cache long ou la BDD
                    let noteSemaine = this.reputationCache.get(`noteSemaine_${helper.id}`);
                    if (noteSemaine === undefined) {
                        noteSemaine = yield this._reputationHistoryService.getLastWeeklyNote(helper.id);
                        this.reputationCache.set(`noteSemaine_${helper.id}`, noteSemaine);
                    }
                    helper.noteSemaine = noteSemaine;
                    return helper;
                }
            }
            // Sinon on cherche dans la bdd
            const helper = yield User_model_1.User.findOne({
                where: { id: id, role: 'helper' },
                include: [{ model: Availability_model_1.Availability, as: 'availabilities' }],
                attributes: { exclude: ['password'] }
            });
            if (helper === null) {
                logger_1.default.error(error_messages_1.default.errorFetchingUser(), id);
                return undefined;
            }
            let allHelpers = this.helpersCache.get('allHelpers') || [];
            if (!allHelpers.find((h) => h.id === helper.id)) {
                allHelpers.push(helper.toJSON());
                this.helpersCache.set('allHelpers', allHelpers);
            }
            const noteSemaine = yield this._reputationHistoryService.getLastWeeklyNote(helper.id);
            this.reputationCache.set(`noteSemaine_${helper.id}`, noteSemaine);
            helper.noteSemaine = noteSemaine;
            return helper;
        });
    }
    findStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield User_model_1.User.findOne({ where: { id: id } });
                if (student === null) {
                    logger_1.default.error(error_messages_1.default.errorFetchingUser(), id);
                    return undefined;
                }
                return student;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.errorFetchingUser(), id, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return undefined;
            }
        });
    }
    deleteLogically(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereClause = { id: id, deleted: false };
                const [affectedRows] = yield User_model_1.User.update({ deleted: true }, { where: { whereClause } });
                if (affectedRows === 0) {
                    logger_1.default.warn(error_messages_1.default.invalidUserId(), id);
                    return false;
                }
                return true;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.internalServerError(), id, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return false;
            }
        });
    }
    deleteDefinitely(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const affectedRows = yield User_model_1.User.destroy({ where: { id: id } });
                if (affectedRows === 0) {
                    logger_1.default.warn(error_messages_1.default.invalidUserId(), id);
                    return false;
                }
                return true;
            }
            catch (error) {
                logger_1.default.error(error_messages_1.default.internalServerError(), id, (0, errorHandler_middlewares_1.getErrorMessage)(error));
                return false;
            }
        });
    }
}
exports.default = UserRepository;
