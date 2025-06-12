'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Token = void 0;
const db_1 = __importDefault(require('../configDB/db'));
const sequelize_1 = require('sequelize');
const User_model_1 = require('./User.model');
class Token extends sequelize_1.Model {}
exports.Token = Token;
Token.init(
    {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User_model_1.User,
                key: 'id'
            }
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize: db_1.default,
        tableName: 'tokens',
        modelName: 'Token',
        timestamps: true
    }
);
// Définir l'association
// Un token appartient à un utilisateur
Token.belongsTo(User_model_1.User, { foreignKey: 'userId', as: 'user' });
