'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ExchangeStat = void 0;
const sequelize_1 = require('sequelize');
const db_1 = __importDefault(require('../../configDB/db'));
const Exchange_model_1 = require('../Exchange.model');
class ExchangeStat extends sequelize_1.Model {}
exports.ExchangeStat = ExchangeStat;
ExchangeStat.init(
    {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idExchange: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Exchange_model_1.Exchange,
                key: 'id'
            }
        }
    },
    {
        sequelize: db_1.default,
        tableName: 'exchange_stats',
        modelName: 'ExchangeStat',
        timestamps: true
    }
);
