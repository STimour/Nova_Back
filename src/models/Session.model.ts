import { Model, DataTypes } from 'sequelize';
import sequelize from '../configDB/db';
import { User } from './User.model';
import { Availability } from './Availability.model';

export class Session extends Model {
    public id!: number;
    public name!: string;
    public meetUrl!: string;
    public idHelper?: number;
    public idStudent?: number;
    public date!: Date;
    public startTime!: Date;
    public endTime!: Date;
    public status!: string;
    public requestedBy!: number;
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
        meetUrl: {
            type: DataTypes.TEXT,
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
        },
        status: {
            type: DataTypes.ENUM('available', 'pending', 'confirmed', 'refused'),
            allowNull: false,
            defaultValue: 'available'
        },
        requestedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: 'id'
            }
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

Session;
