import { DataTypes, Model } from 'sequelize';
import sequelize from '../configDB/db';
import { User } from './User.model';

export class ReputationHistory extends Model {
    public id!: number;
    public idUser!: number;
    public score!: number;
    public date!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ReputationHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'reputation_histories',
        modelName: 'ReputationHistory',
        timestamps: true
    }
);
