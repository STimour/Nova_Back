import { SkillsCategory } from './../SkillsCategory.model';
import { Skill } from './../Skill.model';
import { Availability } from './../Availability.model';
import { Reputation } from './../Reputation.model';
import { Optional, Model } from 'sequelize';

// Définis les attributs du modèle
export interface IUser {
    id?: number;
    lastname: string;
    firstname: string;
    email: string;
    password: string;
    sexe: string;
    birthdate: Date;
    role: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    Skill?: Skill[];
    SkillsCategory?: SkillsCategory[];
    Reputation?: Reputation;
    Availability?: Availability;
}

// Définis les attributs nécessaires à la création
export interface UserCreationAttributes
    extends Optional<IUser, 'id' | 'createdAt' | 'updatedAt' | 'deleted'> {}
