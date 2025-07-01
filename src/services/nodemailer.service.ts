import nodemailer from 'nodemailer';
import logger from '../utils/logger';
import ErrorMessages from '../utils/error.messages';

export const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendMail(to: string, subject: string, text: string) {
    await mailer.sendMail({
        from: '"Nova" <no-reply@nova.com>',
        to,
        subject,
        text
    });
}

export async function notifyUserByEmail(
    toEmail: string,
    subject: string,
    text: string
): Promise<void> {
    try {
        await sendMail(toEmail, subject, text);
    } catch (error) {
        // TODO - Revoir la gestion des erreurs
        logger.error(ErrorMessages.badRequest(), toEmail, getErrorMessage(error));
    }
}
