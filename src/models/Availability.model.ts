import { Model, DataTypes } from 'sequelize';
import sequelize from '../configDB/db';
import { User } from './User.model';

export class Availability extends Model {
    public id!: number;
    public idUser!: number;
    public day!: Date;
    public startTime!: string;
    public endTime!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Availability.init(
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
        day: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'availabilities',
        modelName: 'Availability',
        timestamps: true
    }
);

Availability.belongsTo(User, { foreignKey: 'idUser', as: 'user' });
User.hasMany(Availability, { foreignKey: 'idUser', as: 'availabilities' });
// Définir l'association
