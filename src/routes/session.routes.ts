import { Router } from "express";
import SessionController from "../controllers/session.controller";

const sessionRoutes = Router();
const _sessionController = new SessionController();

sessionRoutes.post("/session/all", _sessionController.getAllSessions.bind(_sessionController));
sessionRoutes.post("/session/:id", _sessionController.deleteSession.bind(_sessionController))
sessionRoutes.patch("/session/:id", _sessionController.updateSession.bind(_sessionController))
sessionRoutes.get("/session/:id", _sessionController.getSession.bind(_sessionController))