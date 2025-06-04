'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.User = void 0;
const db_1 = __importDefault(require('../config/db'));
const sequelize_1 = require('sequelize');
const sequelize_2 = require('sequelize');
const Availability_model_1 = require('./Availability.model');
class User extends sequelize_2.Model {}
exports.User = User;
User.init(
    {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        lastname: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        firstname: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        sexe: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db_1.default,
        tableName: 'users',
        modelName: 'User',
        timestamps: true
    }
);
User.hasMany(Availability_model_1.Availability, {
    foreignKey: 'idUser',
    as: 'availabilities'
});
Availability_model_1.Availability.belongsTo(User, {
    foreignKey: 'idUser',
    as: 'user'
});
