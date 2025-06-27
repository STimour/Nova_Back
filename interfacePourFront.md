import { Reputation } from '../../models/Reputation.model';
import { Availability } from '../../models/Availability.model';

export interface IHelperFront {
id: number;
lastname?: string;
firstname?: string;
email: string;
sexe: string;
birthdate?: string; // ou Date
role: string;
superHelper: boolean;
deleted: boolean;
createdAt: string; // ou Date
updatedAt: string; // ou Date

    // Champs calculés/statistiques
    noteSemaine: number; // Note moyenne sur 5 de la semaine

    // Relations (optionnelles selon l'API)
    reputations?: {
        id: number;
        idUser: number;
        score: number;
        createdAt: string;
        updatedAt: string;
    }[];

    availabilities?: {
        id: number;
        idUser: number;
        day: string; // ou Date
        startTime: string;
        endTime: string;
        createdAt: string;
        updatedAt: string;
    }[];

}
