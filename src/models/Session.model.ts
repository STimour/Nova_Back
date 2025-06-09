import { Model, DataTypes } from 'sequelize';
import sequelize from '../configDB/db';
import { User } from './User.model';

export class Session extends Model {
    public id!: number;
    public name!: string;
    public idHelper?: number;
    public idStudent?: number;
    public date!: Date;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idHelper: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: 'id'
            }
        },
        idStudent: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: 'id'
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'sessions',
        modelName: 'Session',
        timestamps: true
    }
);
Session.belongsTo(User, {
    foreignKey: 'idHelper',
    as: 'helper'
});

Session.belongsTo(User, {
    foreignKey: 'idStudent',
    as: 'student'
});

User.hasMany(Session, {
    foreignKey: 'idHelper',
    as: 'helperSessions'
});

User.hasMany(Session, {
    foreignKey: 'idStudent',
    as: 'studentSessions'
});
