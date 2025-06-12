'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.NotificationLog = exports.NotificationLogStatus = void 0;
const sequelize_1 = require('sequelize');
const db_1 = __importDefault(require('../configDB/db'));
const User_model_1 = require('./User.model');
var NotificationLogStatus;
(function (NotificationLogStatus) {})(
    NotificationLogStatus || (exports.NotificationLogStatus = NotificationLogStatus = {})
);
class NotificationLog extends sequelize_1.Model {}
exports.NotificationLog = NotificationLog;
NotificationLog.init(
    {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User_model_1.User,
                key: 'id'
            }
        },
        type: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        channel: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        },
        sentAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        },
        contentPreview: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db_1.default,
        tableName: 'notification_logs',
        modelName: 'NotificationLog',
        timestamps: true
    }
);
