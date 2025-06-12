"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reputation = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../configDB/db"));
const User_model_1 = require("./User.model");
class Reputation extends sequelize_1.Model {
}
exports.Reputation = Reputation;
Reputation.init({
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
    score: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize: db_1.default,
    tableName: 'reputations',
    modelName: 'Reputation',
    timestamps: true
});
Reputation.belongsTo(User_model_1.User, { foreignKey: 'idUser', as: 'user' });
User_model_1.User.hasMany(Reputation, { foreignKey: 'idUser', as: 'reputations' });
