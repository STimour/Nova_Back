import { Session } from '../models/Session.model';
import SessionRepository from '../repositories/session.repository';
import logger from '../utils/logger';
import ErrorMessages from '../utils/error.messages';
import { count } from 'console';
import { parse } from 'path';

class SessionService {
    private readonly _sessionRepository: SessionRepository;

    constructor(_sessionRepository: SessionRepository = new SessionRepository()) {
        this._sessionRepository = _sessionRepository;
    }

    public async createSession(sessionData: any): Promise<Session | null> {
        try {
            const session = await this._sessionRepository.create(sessionData);
            if (!session) {
                logger.warn(ErrorMessages.operationFailed(), JSON.stringify(sessionData));
                return null;
            }
            return session;
        } catch (error) {
            logger.error(ErrorMessages.errorCreatingUser(), JSON.stringify(sessionData), error);
            return null;
        }
    }

    public async getSession(id: string): Promise<Session | null> {
        try {
            if (!id) {
                logger.warn(ErrorMessages.invalidUserId(), id);
                return null;
            }
            const session = await this._sessionRepository.findById(id);
            if (!session) {
                logger.warn(ErrorMessages.notFound(), id);
                return null;
            }
            return session;
        } catch (error) {
            logger.error(ErrorMessages.errorFetchingUser(), id, error);
            return null;
        }
    }

    public async updateSession(id: string, updates: any): Promise<Session | null> {
        try {
            if (!id) {
                logger.warn(ErrorMessages.invalidUserId(), id);
                return null;
            }
            const [count, sessions] = await this._sessionRepository.update(id, updates);
            if (count === 0 || !sessions[0]) {
                logger.warn(ErrorMessages.operationFailed(), id);
                return null;
            }
            return sessions[0];
        } catch (error) {
            logger.error(ErrorMessages.errorUpdatingUser(), id, error);
            return null;
        }
    }

    public async deleteSession(id: string): Promise<boolean> {
        try {
            if (!id) {
                logger.warn(ErrorMessages.invalidUserId(), id);
                return false;
            }
            const deleted = await this._sessionRepository.delete(id);
            if (deleted === 0) {
                logger.warn(ErrorMessages.errorDeletingUser(), id);
                return false;
            }
            return true;
        } catch (error) {
            logger.error(ErrorMessages.errorDeletingUser(), id, error);
            return false;
        }
    }

    public async getAllSessions(idUser: string): Promise<Session[] | undefined> {
        try {
            const id = parseInt(idUser);
            if (isNaN(id)) {
                logger.error(ErrorMessages.invalidUserId(), idUser);
                return undefined;
            }
            const sessions = await this._sessionRepository.findAll(id);
            if (!sessions || sessions.length === 0) {
                logger.warn(ErrorMessages.notFound(), 'sessions');
                return undefined;
            }
            return sessions;
        } catch (error) {
            logger.error(ErrorMessages.errorFetchingUsers(), error);
            return undefined;
        }
    }

    public async getDisponibiliteHelper(
        idUser: string,
        startDate: Date,
        endDate: Date
    ): Promise<number | undefined> {
        try {
            const id = parseInt(idUser);
            const totalCreneaux = await this.getAllSessions(idUser);
            if (isNaN(id)) {
                logger.warn(ErrorMessages.operationFailed());
                return undefined;
            }
            if (totalCreneaux === undefined || totalCreneaux?.length === 0) {
                logger.warn(ErrorMessages.operationFailed());
                return undefined;
            }
            const count = await this._sessionRepository.getDisponibiliteHelper(
                parseInt(idUser),
                startDate,
                endDate,
                totalCreneaux.length
            );

            return count;
        } catch (error) {
            logger.error(ErrorMessages.forbiddenGeneric(), JSON.stringify(error));
            return undefined;
        }
    }
}

export default SessionService;
