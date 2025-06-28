import { Session } from '../models/Session.model';
import SessionRepository from '../repositories/session.repository';
import logger from '../utils/logger';
import ErrorMessages from '../utils/error.messages';
import EmailTemplates from '../utils/email.templates';
import { notifyUserByEmail } from './nodemailer.service';
import { User } from '../models/User.model';

//TODO - amelieurer l'envoie des mails
//TODO -  || utiliser la class ErrorMessages
//TODO - revoir la gestion des types de renvoi pour tous le flux des methodes

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

    public async getSession(id: number): Promise<Session | null> {
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

    public async updateSession(id: number, updates: any): Promise<Session | null> {
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

    public async deleteSession(id: number): Promise<boolean> {
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

    public async requestSession(
        sessionId: number,
        studentId: number,
        message: string = ''
    ): Promise<boolean> {
        const session = await this._sessionRepository.findById(sessionId);
        if (!session) return false;
        if (session.status !== 'available') return false;

        await this._sessionRepository.update(sessionId, {
            status: 'pending',
            requestedBy: studentId
        });

        // Notifier le helper par email
        try {
            const helper = await User.findByPk(session.idHelper);
            const student = await User.findByPk(studentId);
            if (helper && helper.email && student) {
                await notifyUserByEmail(
                    helper.email,
                    'Nouvelle demande de session',
                    EmailTemplates.sessionRequest(
                        helper.firstname!,
                        student.firstname!,
                        session.date,
                        message
                    )
                );
            }
        } catch (mailError) {
            logger.error("Erreur lors de l'envoi du mail de notification helper", mailError);
        }

        return true;
    }

    public async acceptSession(
        sessionId: number,
        helperId: number,
        message: string = ''
    ): Promise<boolean> {
        const session = await this._sessionRepository.findById(sessionId);
        if (!session) return false;
        if (session.status !== 'pending' || session.idHelper !== helperId) return false;

        await this._sessionRepository.update(sessionId, {
            status: 'confirmed'
        });

        // Notifier le student par email
        try {
            if (session.requestedBy) {
                const student = await User.findByPk(session.requestedBy);
                const helper = await User.findByPk(helperId);
                if (student && student.email && helper) {
                    await notifyUserByEmail(
                        student.email,
                        'Nova - Session acceptée',
                        EmailTemplates.sessionAccepted(
                            student.firstname!,
                            helper.firstname!,
                            sessionId,
                            message
                        )
                    );
                }
            }
        } catch (mailError) {
            logger.error(
                "Erreur lors de l'envoi du mail de notification student (accept)",
                mailError
            );
        }

        return true;
    }

    public async refuseSession(
        sessionId: number,
        helperId: number,
        message: string = ''
    ): Promise<boolean> {
        const session = await this._sessionRepository.findById(sessionId);
        if (!session) return false;
        if (session.status !== 'pending' || session.idHelper !== helperId) return false;

        await this._sessionRepository.update(sessionId, {
            status: 'available',
            requestedBy: null
        });

        // Notifier le student du refus par email
        try {
            if (session.requestedBy) {
                const student = await User.findByPk(session.requestedBy);
                const helper = await User.findByPk(helperId);
                if (student && student.email && helper) {
                    await notifyUserByEmail(
                        student.email!,
                        'Session refusée',
                        EmailTemplates.sessionRefused(
                            student.firstname!,
                            helper.firstname!,
                            sessionId,
                            message
                        )
                    );
                }
            }
        } catch (mailError) {
            logger.error(
                "Erreur lors de l'envoi du mail de notification student (refuse)",
                mailError
            );
        }

        return true;
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
