import { Session } from '../models/Session.model';
import { User } from '../models/User.model';
export class HelperBadgeService {
    /**
     * Met à jour le badge superHelper pour tous les helpers chaque semaine.
     */
    public async updateSuperHelpers(): Promise<void> {
        const helpers = await User.findAll({ where: { role: 'helper' } });
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // début semaine (dimanche)
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        for (const helper of helpers) {
            const heuresDisponibles = await Session.count({
                where: {
                    idUser: helper.id,
                    day: {
                        $between: [startOfWeek, endOfWeek]
                    }
                }
            });
            await helper.update({ superHelper: heuresDisponibles > 5 });
        }
    }
}
