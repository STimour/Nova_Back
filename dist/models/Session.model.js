'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Session = void 0;
const sequelize_1 = require('sequelize');
const db_1 = __importDefault(require('../config/db'));
const User_model_1 = require('./User.model');
class Session extends sequelize_1.Model {}
exports.Session = Session;
Session.init(
    {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        idHelper: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User_model_1.User,
                key: 'id'
            }
        },
        idStudent: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User_model_1.User,
                key: 'id'
            }
        },
        date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize: db_1.default,
        tableName: 'sessions',
        modelName: 'Session',
        timestamps: true
    }
);
Session.belongsTo(User_model_1.User, {
    foreignKey: 'idHelper',
    as: 'helper'
});
Session.belongsTo(User_model_1.User, {
    foreignKey: 'idStudent',
    as: 'student'
});
User_model_1.User.hasMany(Session, {
    foreignKey: 'idHelper',
    as: 'helperSessions'
});
User_model_1.User.hasMany(Session, {
    foreignKey: 'idStudent',
    as: 'studentSessions'
});
