import { Request, Response } from "express";
import { Availability } from '../models/Availability.model';

export class AvailabilityService {
    /**
     * Calcule le taux de disponibilité d'un helper sur une période donnée.
     */
    public async getDisponibiliteHelper(idUser: number, startDate: Date, endDate: Date, totalCreneaux: number): Promise<number> {
        const count = await Availability.count({
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