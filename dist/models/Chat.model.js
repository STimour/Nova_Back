'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ChatMessage = void 0;
const sequelize_1 = require('sequelize');
const db_1 = __importDefault(require('../config/db'));
const Session_model_1 = require('./Session.model');
const User_model_1 = require('./User.model');
class ChatMessage extends sequelize_1.Model {}
exports.ChatMessage = ChatMessage;
ChatMessage.init(
    {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idSession: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Session_model_1.Session,
                key: 'id'
            }
        },
        idSender: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User_model_1.User,
                key: 'id'
            }
        },
        idReceiver: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User_model_1.User,
                key: 'id'
            }
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        isAnonymized: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        readAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize: db_1.default,
        tableName: 'chat_messages',
        modelName: 'ChatMessage',
        timestamps: true
    }
);
