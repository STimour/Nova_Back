"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsCategory = void 0;
const db_1 = __importDefault(require("../configDB/db"));
const sequelize_1 = require("sequelize");
class SkillsCategory extends sequelize_1.Model {
}
exports.SkillsCategory = SkillsCategory;
SkillsCategory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize: db_1.default,
    tableName: 'skills_categories',
    modelName: 'SkillsCategory',
    timestamps: true
});
