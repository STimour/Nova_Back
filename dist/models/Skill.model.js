'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Skill = void 0;
const sequelize_1 = require('sequelize');
const db_1 = __importDefault(require('../configDB/db'));
const SkillsCategory_model_1 = require('./SkillsCategory.model');
class Skill extends sequelize_1.Model {}
exports.Skill = Skill;
Skill.init(
    {
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
        idCategory: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: SkillsCategory_model_1.SkillsCategory,
                key: 'id'
            }
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize: db_1.default,
        tableName: 'skills',
        modelName: 'Skill',
        timestamps: true
    }
);
