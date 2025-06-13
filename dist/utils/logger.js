"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
class Logger {
    constructor() {
        this.logger = (0, winston_1.createLogger)({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
            transports: [
                new winston_1.transports.Console(),
                new winston_daily_rotate_file_1.default({
                    filename: 'logs/error-%DATE%.log',
                    level: 'error',
                    maxSize: '40k',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: false
                }),
                new winston_daily_rotate_file_1.default({
                    filename: 'logs/info-%DATE%.log',
                    level: 'info',
                    maxSize: '40k',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: false
                }),
                new winston_daily_rotate_file_1.default({
                    filename: 'logs/warn-%DATE%.log',
                    level: 'warn',
                    maxSize: '40k',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: false
                }),
                new winston_daily_rotate_file_1.default({
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
    info(message, ...meta) {
        this.logger.info(message, ...meta);
    }
    error(message, ...meta) {
        this.logger.error(message, ...meta);
    }
    warn(message, ...meta) {
        this.logger.warn(message, ...meta);
    }
    debug(message, ...meta) {
        this.logger.debug(message, ...meta);
    }
}
exports.default = new Logger();
