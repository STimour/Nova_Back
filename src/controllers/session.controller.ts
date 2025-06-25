import { Session } from "../models/Session.model";
import SessionService from "../services/session.service";
import { Request, Response } from 'express';

class SessionController {
    private readonly _sessionService: SessionService;

    constructor(_sessionService: SessionService = new SessionService()) {
        this._sessionService = _sessionService;
    }

    // POST /session/all
    public async getAllSessions(req: Request, res: Response): Promise<void> {
        try {
            const { idUser } = req.body;
            if (!idUser) {
                res.status(400).json({ error: "idUser is required" });
                return;
            }
            const sessions = await this._sessionService.getAllSessions(idUser.toString());
            if (!sessions) {
                res.status(404).json({ error: "No sessions found" });
                return;
            }
            res.status(200).json(sessions);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // GET /session/:id
    public async getSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "Session id is required" });
                return;
            }
            const session = await this._sessionService.getSession(id);
            if (!session) {
                res.status(404).json({ error: "Session not found" });
                return;
            }
            res.status(200).json(session);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // PATCH /session/:id
    public async updateSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;
            if (!id) {
                res.status(400).json({ error: "Session id is required" });
                return;
            }
            const updated = await this._sessionService.updateSession(id, updates);
            if (!updated) {
                res.status(404).json({ error: "Session not found or not updated" });
                return;
            }
            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // POST /session/:id
    public async deleteSession(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "Session id is required" });
                return;
            }
            const deleted = await this._sessionService.deleteSession(id);
            if (!deleted) {
                res.status(404).json({ error: "Session not found or not deleted" });
                return;
            }
            res.status(200).json({ message: "Session deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default SessionController;