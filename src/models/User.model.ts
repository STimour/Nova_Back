import sequelize from '../configDB/db';
import { DataTypes } from 'sequelize';
import { Model } from 'sequelize';
import { Availability } from './Availability.model';
import { Token } from './Token.model';

export class User extends Model {
    public id!: number;
    public lastname?: string;
    public firstname?: string;
    public email!: string;
    public password!: string;
    public sexe!: string;
    public birthdate?: Date;
    public role!: string;
    public deleted!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sexe: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',
        timestamps: true
    }
);

