import { Session } from '../models/Session.model';

class SessionRepository {
    public async create(sessionData: any): Promise<Session> {
        return await Session.create(sessionData);
    }

    public async findById(id: number): Promise<Session | null> {
        return await Session.findByPk(id);
    }

    public async update(id: number, updates: any): Promise<[number, Session[]]> {
        return await Session.update(updates, { where: { id }, returning: true });
    }

    public async delete(id: number): Promise<number> {
        return await Session.destroy({ where: { id } });
    }

    public async findAll(idUser: number): Promise<Session[]> {
        return await Session.findAll({
            where: {
                id: idUser
            }
        });
    }

    /**
     * Calcule le taux de disponibilité d'un helper sur une période donnée.
     */
    public async getDisponibiliteHelper(
        idUser: number,
        startDate: Date,
        endDate: Date,
        totalCreneaux: number
    ): Promise<number> {
        const count = await Session.count({
            where: {
                idUser,
                day: {
                    $between: [startDate, endDate]
                }
            }
        });
        return (count / totalCreneaux) * 100;
    }
}

export default SessionRepository;
