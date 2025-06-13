import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface CustomError extends Error {
    status?: number;
}

export function errorHandler(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const statusCode = err.status || 500;
    const errorMessageForLog = getErrorMessage(err);

    // Log détaillé incluant la stack trace si disponible
    let logMessage = `[${statusCode}] ${req.method} ${req.path} - Message: ${errorMessageForLog}`;
    if (err.stack) {
        logMessage += `\nStack: ${err.stack}`;
    }
    logger.error(logMessage);

    // Déterminer le message à envoyer au client
    let clientErrorMessage = err.message;
    // En production, pour les erreurs serveur, envoyer un message générique
    // Vous pouvez ajuster la condition (par exemple, process.env.NODE_ENV === 'production')
    if (statusCode >= 500 /* && process.env.NODE_ENV === 'production' */) {
        clientErrorMessage = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
    }

    res.status(statusCode).json({ error: clientErrorMessage });
}

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}
