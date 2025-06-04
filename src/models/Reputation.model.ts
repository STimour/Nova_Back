import { DataTypes, Model } from 'sequelize';
import sequelize from '../configDB/db';
import { User } from './User.model';

export class Reputation extends Model {
    public id!: number;
    public idUser!: number;
    public score!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Reputation.init(
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
        }
    },
    {
        sequelize,
        tableName: 'reputations',
        modelName: 'Reputation',
        timestamps: true
    }
);

Reputation.belongsTo(User, { foreignKey: 'idUser', as: 'user' });
User.hasMany(Reputation, { foreignKey: 'idUser', as: 'reputations' });
