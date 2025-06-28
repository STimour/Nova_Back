class EmailTemplates {
    // Demande de session envoyée au helper
    public static sessionRequest(
        helperName: string,
        studentName: string,
        sessionDate: Date,
        message: string
    ): string {
        const dateStr = sessionDate instanceof Date ? sessionDate.toLocaleString() : sessionDate;
        return `
            <body style="background:#2c3e91;padding:2rem;color:#fff;font-family:sans-serif;">
                <div style="max-width:600px;margin:auto;">
                    <h2 style="color:#fff;">Nouvelle demande de session</h2>
                    <p>Bonjour ${helperName},</p>
                    <p>L'étudiant <strong>${studentName}</strong> a demandé votre session du <b>${dateStr}</b>.</p>
                    ${message && message.trim() ? `<div style=\"background:rgba(0,0,0,0.15);padding:1rem;border-radius:8px;margin:1rem 0;\"><strong>Message du demandeur :</strong><br><span>${message}</span></div>` : ''}
                    <p>Merci de vous connecter à la plateforme pour accepter ou refuser la demande.</p>
                    <hr style="border:1px solid #fff;opacity:0.2;">
                    <small style="color:#fff;">Ce message est automatique, merci de ne pas répondre.</small>
                </div>
            </body>
        `;
    }

    // Notification d'acceptation envoyée au student
    public static sessionAccepted(
        studentName: string,
        helperName: string,
        sessionId: number,
        message: string
    ): string {
        return `
            <body style="background:#2c3e91;padding:2rem;color:#fff;font-family:sans-serif;">
                <div style="max-width:600px;margin:auto;">
                    <h2 style="color:#fff;">Votre session a été acceptée !</h2>
                    <p>Bonjour ${studentName},</p>
                    <p>Votre demande de session <b>#${sessionId}</b> a été acceptée par <strong>${helperName}</strong>.</p>
                    ${message && message.trim() ? `<div style=\"background:rgba(0,0,0,0.15);padding:1rem;border-radius:8px;margin:1rem 0;\"><strong>Message du helper :</strong><br><span>${message}</span></div>` : ''}
                    <p>Rendez-vous sur la plateforme pour plus de détails.</p>
                    <hr style="border:1px solid #fff;opacity:0.2;">
                    <small style="color:#fff;">Ce message est automatique, merci de ne pas répondre.</small>
                </div>
            </body>
        `;
    }

    // Notification de refus envoyée au student
    public static sessionRefused(
        studentName: string,
        helperName: string,
        sessionId: number,
        message: string
    ): string {
        return `
            <body style="background:#2c3e91;padding:2rem;color:#fff;font-family:sans-serif;">
                <div style="max-width:600px;margin:auto;">
                    <h2 style="color:#fff;">Votre session a été refusée</h2>
                    <p>Bonjour ${studentName},</p>
                    <p>Votre demande de session <b>#${sessionId}</b> a été refusée par <strong>${helperName}</strong>.</p>
                    ${message && message.trim() ? `<div style=\"background:rgba(0,0,0,0.15);padding:1rem;border-radius:8px;margin:1rem 0;\"><strong>Message du helper :</strong><br><span>${message}</span></div>` : ''}
                    <p>Vous pouvez demander une autre session si besoin.</p>
                    <hr style="border:1px solid #fff;opacity:0.2;">
                    <small style="color:#fff;">Ce message est automatique, merci de ne pas répondre.</small>
                </div>
            </body>
        `;
    }
}

export default EmailTemplates;
