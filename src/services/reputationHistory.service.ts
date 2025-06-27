import { User } from '../models/User.model';
import { Reputation } from '../models/Reputation.model';
import { ReputationHistory } from '../models/ReputationHistory.model';

export class ReputationHistoryService {
    /**
     * Sauvegarde la réputation actuelle de chaque helper dans l'historique chaque semaine
     * et retourne la note sur 5.
     */
    public async saveWeeklyReputation(): Promise<void> {
        const helpers = await User.findAll({ where: { role: 'helper' } });
        const today = new Date();

        for (const helper of helpers) {
            // On suppose que chaque Reputation a un champ 'score' sur 5
            const reputations = await Reputation.findAll({ where: { idUser: helper.id } });
            const noteSur5 =
                reputations.length > 0
                    ? reputations.reduce((sum, r) => sum + r.score, 0) / reputations.length
                    : 0;

            // Enregistrement dans l'historique
            await ReputationHistory.create({
                idUser: helper.id,
                score: noteSur5,
                date: today
            });

            // Affichage dans la console (ou log)
            console.log(`Helper ${helper.id} : note ${noteSur5.toFixed(2)} / 5`);
        }
    }

    /**
     * Récupère la note moyenne de la dernière semaine pour un helper.
     */
    public async getLastWeeklyNote(idUser: number): Promise<number> {
        const lastHistory = await ReputationHistory.findOne({
            where: { idUser },
            order: [['date', 'DESC']]
        });
        return lastHistory ? lastHistory.score : 0;
    }
}
