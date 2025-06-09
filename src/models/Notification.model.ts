import { DataTypes, Model } from 'sequelize';
import sequelize from '../configDB/db';
import { User } from './User.model';
export enum NotificationLogStatus {}
export class NotificationLog extends Model {
    public id!: number;
    public userId!: number;
    public type!: string;
    public channel!: string;
    public status!: string;
    public sentAt?: Date;
    public contentPreview!: string;
}

NotificationLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        channel: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        },
        sentAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        contentPreview: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'notification_logs',
        modelName: 'NotificationLog',
        timestamps: true
    }
);
