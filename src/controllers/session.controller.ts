import { Session } from '../models/Session.model';
import SessionService from '../services/session.service';
import { Request, Response } from 'express';

class SessionController {
    private readonly _sessionService: SessionService;

    constructor(_sessionService: SessionService = new SessionService()) {
        this._sessionService = _sessionService;
    }

    // POST /session/create
    public async createSession(req: Request, res: Response): Promise<void> {
        try {
            const sessionData: Session = req.body;
            if (!sessionData.idHelper) {
                res.status(400).json({ error: 'idUser is required' });
                return;
            }
            //TODO - ajouter des vérifications
            await this._sessionService.createSession(sessionData);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }

    // POST /session/all
    public async getAllSessions(req: Request, res: Response): Promise<void> {
        try {
            const { idUser } = req.body;
            if (!idUser) {
                res.status(400).json({ error: 'idUser is required' });
                return;
            }
            const sessions = await this._sessionService.getAllSessions(idUser.toString());
            if (!sessions) {
                res.status(404).json({ error: 'No sessions found' });
                return;
            }
            res.status(200).json(sessions);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }

    // GET /session/:id
    public async getSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const sessionId: number = parseInt(id);

            if (!id || isNaN(sessionId)) {
                res.status(400).json({ error: 'Session id is required' });
                return;
            }
            const session = await this._sessionService.getSession(sessionId);
            if (!session) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }
            res.status(200).json(session);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }

    // PATCH /session/:id
    public async updateSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;
            const sessionId: number = parseInt(id);

            if (!id || isNaN(sessionId)) {
                res.status(400).json({ error: 'Session id is required' });
                return;
            }
            const updated = await this._sessionService.updateSession(sessionId, updates);
            if (!updated) {
                res.status(404).json({ error: 'Session not found or not updated' });
                return;
            }
            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }

    // POST /session/:id
    public async deleteSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const sessionId: number = parseInt(id);

            if (!id || isNaN(sessionId)) {
                res.status(400).json({ error: 'Session id is required' });
                return;
            }
            const deleted = await this._sessionService.deleteSession(sessionId);
            if (!deleted) {
                res.status(404).json({ error: 'Session not found or not deleted' });
                return;
            }
            res.status(200).json({ message: 'Session deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }

    // POST /session/:id/request
    public async requestSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { studentId } = req.body;
            if (!id || !studentId) {
                res.status(400).json({ error: 'Session id and studentId are required' });
                return;
            }
            const result = await this._sessionService.requestSession(Number(id), Number(studentId));
            if (!result) {
                res.status(400).json({ error: 'Session unavailable or already requested' });
                return;
            }
            res.status(200).json({ message: 'Session requested successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }

    // POST /session/:id/accept
    public async acceptSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { helperId } = req.body;
            if (!id || !helperId) {
                res.status(400).json({ error: 'Session id and helperId are required' });
                return;
            }
            const result = await this._sessionService.acceptSession(Number(id), Number(helperId));
            if (!result) {
                res.status(400).json({ error: 'Session not pending or helper mismatch' });
                return;
            }
            res.status(200).json({ message: 'Session accepted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }

    // POST /session/:id/refuse
    public async refuseSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { helperId } = req.body;
            if (!id || !helperId) {
                res.status(400).json({ error: 'Session id and helperId are required' });
                return;
            }
            const result = await this._sessionService.refuseSession(Number(id), Number(helperId));
            if (!result) {
                res.status(400).json({ error: 'Session not pending or helper mismatch' });
                return;
            }
            res.status(200).json({ message: 'Session refused and made available again' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }
}

export default SessionController;
