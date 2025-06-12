import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

class Logger {
    private logger: WinstonLogger;

    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                format.splat(),
                format.json()
            ),
            transports: [
                new transports.Console(),
                new DailyRotateFile({
                    filename: 'logs/error-%DATE%.log',
                    level: 'error',
                    maxSize: '40k',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: false
                }),
                new DailyRotateFile({
                    filename: 'logs/info-%DATE%.log',
                    level: 'info',
                    maxSize: '40k',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: false
                }),
                new DailyRotateFile({
                    filename: 'logs/warn-%DATE%.log',
                    level: 'warn',
                    maxSize: '40k',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: false
                }),
                new DailyRotateFile({
                    filename: 'logs/debug-%DATE%.log',
                    level: 'debug',
                    maxSize: '40k',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: false
                })
            ],
            exitOnError: false
        });
    }

    info(message: string, ...meta: any[]) {
        this.logger.info(message, ...meta);
    }

    error(message: string, ...meta: any[]) {
        this.logger.error(message, ...meta);
    }

    warn(message: string, ...meta: any[]) {
        this.logger.warn(message, ...meta);
    }

    debug(message: string, ...meta: any[]) {
        this.logger.debug(message, ...meta);
    }
}

export default new Logger();
