'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Availability = void 0;
const sequelize_1 = require('sequelize');
const db_1 = __importDefault(require('../configDB/db'));
const User_model_1 = require('./User.model');
class Availability extends sequelize_1.Model {}
exports.Availability = Availability;
Availability.init(
    {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idUser: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User_model_1.User,
                key: 'id'
            }
        },
        day: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false
        },
        startTime: {
            type: sequelize_1.DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: sequelize_1.DataTypes.TIME,
            allowNull: false
        }
    },
    {
        sequelize: db_1.default,
        tableName: 'availabilities',
        modelName: 'Availability',
        timestamps: true
    }
);
Availability.belongsTo(User_model_1.User, { foreignKey: 'idUser', as: 'user' });
User_model_1.User.hasMany(Availability, { foreignKey: 'idUser', as: 'availabilities' });
// Définir l'association
