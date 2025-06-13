"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.getErrorMessage = getErrorMessage;
const logger_1 = __importDefault(require("../utils/logger"));
function errorHandler(err, req, res, next) {
    const statusCode = err.status || 500;
    const errorMessageForLog = getErrorMessage(err);
    // Log détaillé incluant la stack trace si disponible
    let logMessage = `[${statusCode}] ${req.method} ${req.path} - Message: ${errorMessageForLog}`;
    if (err.stack) {
        logMessage += `\nStack: ${err.stack}`;
    }
    logger_1.default.error(logMessage);
    // Déterminer le message à envoyer au client
    let clientErrorMessage = err.message;
    // En production, pour les erreurs serveur, envoyer un message générique
    // Vous pouvez ajuster la condition (par exemple, process.env.NODE_ENV === 'production')
    if (statusCode >= 500 /* && process.env.NODE_ENV === 'production' */) {
        clientErrorMessage = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
    }
    res.status(statusCode).json({ error: clientErrorMessage });
}
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
