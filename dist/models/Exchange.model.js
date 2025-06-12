'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Exchange = void 0;
const sequelize_1 = require('sequelize');
const db_1 = __importDefault(require('../configDB/db'));
const User_model_1 = require('./User.model');
class Exchange extends sequelize_1.Model {}
exports.Exchange = Exchange;
Exchange.init(
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
        withUserId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User_model_1.User,
                key: 'id'
            }
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: db_1.default,
        tableName: 'exchanges',
        modelName: 'Exchange',
        timestamps: true
    }
);
Exchange.belongsTo(User_model_1.User, { foreignKey: 'userId', as: 'user' });
User_model_1.User.hasMany(Exchange, { foreignKey: 'userId', as: 'exchanges' });
Exchange.belongsTo(User_model_1.User, { foreignKey: 'withUserId', as: 'exchangePartner' });
User_model_1.User.hasMany(Exchange, { foreignKey: 'withUserId', as: 'receivedExchanges' });
