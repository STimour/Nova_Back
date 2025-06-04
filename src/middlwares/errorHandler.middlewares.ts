import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status?: number;
}

export function errorHandler(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
}

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}
