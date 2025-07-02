import { User } from './../models/User.model';
import { Availability } from './../models/Availability.model';
import { IUser, UserCreationAttributes } from '../models/interfaces/IUser';
import logger from '../utils/logger';
import { IUserRepository } from './interfaces/IUserRepository';
import { getErrorMessage } from '../middlwares/errorHandler.middlewares';
import ErrorMessages from '../utils/error.messages';
import NodeCache from 'node-cache';
import { ReputationHistoryService } from '../services/reputationHistory.service';
import { HelperWithNote } from '../typeExtends/user.extends';

//TODO - revoir comment on fait le cache - trouver comment créer un service à part

class UserRepository implements IUserRepository {
    private readonly _reputationHistoryService: ReputationHistoryService;
    private readonly USER_FOUND: boolean;

    private helpersCache: NodeCache;
    private reputationCache: NodeCache;

    constructor(_reputationHistoryService = new ReputationHistoryService()) {
        this._reputationHistoryService = _reputationHistoryService;
        this.USER_FOUND = true;
        this.helpersCache = new NodeCache({ stdTTL: 300 }); // 5 min
        this.reputationCache = new NodeCache({ stdTTL: 432000 }); // 5 jours
    }

    public async findAllUsers(): Promise<User[] | undefined> {
        try {
            const users = await User.findAll({ attributes: { exclude: ['password'] } });
            if (!users || users.length === 0) {
                logger.warn(ErrorMessages.errorFetchingUsers());
                return undefined;
            }
            return users;
        } catch (error) {
            logger.error(ErrorMessages.errorFetchingUsers(), getErrorMessage(error));
            return undefined;
        }
    }

    public async findUser(id: number, deleted?: boolean): Promise<User | null> {
        try {
            const whereClause: any = { id: id };
            if (typeof deleted !== 'undefined') {
                whereClause.deleted = deleted;
            }

            const user: User | null = await User.findOne({
                where: whereClause,
                attributes: { exclude: ['password'] }
            });

            if (user === null) {
                logger.error(ErrorMessages.errorFetchingUser(), id);
                return null;
            }

            return user;
        } catch (error) {
            logger.error(ErrorMessages.errorFetchingUser(), getErrorMessage(error));
            return null;
        }
    }

    public async findAllStudents(): Promise<User[] | undefined> {
        try {
            return await User.findAll({
                where: { role: 'student' },
                attributes: { exclude: ['password'] }
            });
        } catch (error) {
            logger.error(ErrorMessages.errorFetchingStudents(), getErrorMessage(error));
            return undefined;
        }
    }

    //TODO - Ca serait bien d'alleger cette paté
    public async findAllHelpers(): Promise<HelperWithNote[] | undefined> {
        // On chercher si les helpers sont dans le cache
        const cachedHelpers = this.helpersCache.get<HelperWithNote[]>('allHelpers');
        if (cachedHelpers) {
            // On récupère la reputation du cache si dispo
            for (const helper of cachedHelpers) {
                let noteSemaine = this.reputationCache.get<number>(`noteSemaine_${helper.id}`);
                // Si pas en cache, on va la chercher et on la met en cache
                if (noteSemaine === undefined) {
                    noteSemaine = await this._reputationHistoryService.getLastWeeklyNote(helper.id);
                }
                helper.noteSemaine = noteSemaine;
            }
            return cachedHelpers;
        }

        // sinon on va chercher dans la bdd
        const users = await User.findAll({
            where: { role: 'helper' },
            attributes: { exclude: ['password'] }
        });

        if (!users || users.length === 0) {
            logger.error('No helpers were found');
            return undefined;
        }

        // On met en cache court les helpers (sans les reputations) c
        const usersToCache = users.map((u) => u.toJSON());
        this.helpersCache.set('allHelpers', usersToCache);

        for (const helper of usersToCache) {
            let noteSemaine = this.reputationCache.get<number>(`noteSemaine_${helper.id}`);
            if (noteSemaine === undefined) {
                noteSemaine = await this._reputationHistoryService.getLastWeeklyNote(helper.id);
                this.reputationCache.set(`noteSemaine_${helper.id}`, noteSemaine);
            }
            helper.noteSemaine = noteSemaine;
        }
        return usersToCache;
    }

    public async isUserExists(
        email: string,
        firstname: string,
        deleted: boolean = false
    ): Promise<boolean> {
        try {
            const user = await User.findOne({
                where: { email: email, firstname: firstname, deleted },
                attributes: { exclude: ['password'] }
            });

            if (user !== null) return this.USER_FOUND;

            return !this.USER_FOUND;
        } catch (error) {
            logger.error(
                ErrorMessages.errorFetchingUser(),
                firstname,
                email,
                getErrorMessage(error)
            );
            return this.USER_FOUND;
        }
    }

    public async createUser(lastname: string, firstname: string, email: string, password: string, sexe: string, birthdate: Date, role: string, avatar: string): Promise<boolean> {
        try {
            const newUser = await User.create({
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
                logger.warn(
                    ErrorMessages.errorCreatingUser(),
                    firstname,
                    lastname
                );
                return false;
            }

            return true;
        } catch (error) {
            logger.error(
                ErrorMessages.errorCreatingUser(),
                firstname,
                lastname,
                getErrorMessage(error)
            );
            return false;
        }
    }

    public async findHelper(id: number): Promise<HelperWithNote | undefined> {
        // On vérifie si le helper est dans le cache court
        const cachedHelper = this.helpersCache.get<any[]>('allHelpers');
        if (cachedHelper) {
            const helper = cachedHelper.find((h) => h.id === id);
            if (helper) {
                // On ajoute la noteSemaine depuis le cache long ou la BDD
                let noteSemaine = this.reputationCache.get<number>(`noteSemaine_${helper.id}`);
                if (noteSemaine === undefined) {
                    noteSemaine = await this._reputationHistoryService.getLastWeeklyNote(helper.id);
                    this.reputationCache.set(`noteSemaine_${helper.id}`, noteSemaine);
                }
                helper.noteSemaine = noteSemaine;
                return helper;
            }
        }

        // Sinon on cherche dans la bdd
        const helper: HelperWithNote | null = await User.findOne({
            where: { id: id, role: 'helper' },
            include: [{ model: Availability, as: 'availabilities' }],
            attributes: { exclude: ['password'] }
        });

        if (helper === null) {
            logger.error(ErrorMessages.errorFetchingUser(), id);
            return undefined;
        }
        let allHelpers = this.helpersCache.get<any[]>('allHelpers') || [];
        if (!allHelpers.find((h) => h.id === helper.id)) {
            allHelpers.push(helper.toJSON());
            this.helpersCache.set('allHelpers', allHelpers);
        }

        const noteSemaine = await this._reputationHistoryService.getLastWeeklyNote(helper.id);
        this.reputationCache.set(`noteSemaine_${helper.id}`, noteSemaine);
        helper.noteSemaine = noteSemaine;

        return helper;
    }

    public async findStudent(id: number): Promise<User | undefined> {
        try {
            const student = await User.findOne({ where: { id: id, role: 'student' } });
            if (student === null) {
                logger.error(ErrorMessages.errorFetchingUser(), id);
                return undefined;
            }
            return student;
        } catch (error) {
            logger.error(ErrorMessages.errorFetchingUser(), id, getErrorMessage(error));
            return undefined;
        }
    }

    public async deleteLogically(id: string): Promise<boolean> {
        try {
            const whereClause: any = { id: id, deleted: false };
            const [affectedRows] = await User.update({ deleted: true }, { where: { whereClause } });

            if (affectedRows === 0) {
                logger.warn(ErrorMessages.invalidUserId(), id);
                return false;
            }

            return true;
        } catch (error) {
            logger.error(ErrorMessages.internalServerError(), id, getErrorMessage(error));
            return false;
        }
    }

    public async deleteDefinitely(id: string): Promise<boolean> {
        try {
            const affectedRows = await User.destroy({ where: { id: id } });
            if (affectedRows === 0) {
                logger.warn(ErrorMessages.invalidUserId(), id);
                return false;
            }
            return true;
        } catch (error) {
            logger.error(ErrorMessages.internalServerError(), id, getErrorMessage(error));
            return false;
        }
    }
}

export default UserRepository;
