'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserSkillLiaison = void 0;
const sequelize_1 = require('sequelize');
const db_1 = __importDefault(require('../../config/db'));
const User_model_1 = require('../User.model');
const Skill_model_1 = require('../Skill.model');
class UserSkillLiaison extends sequelize_1.Model {}
exports.UserSkillLiaison = UserSkillLiaison;
UserSkillLiaison.init(
    {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        idUser: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User_model_1.User,
                key: 'id'
            }
        },
        idSkill: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Skill_model_1.Skill,
                key: 'id'
            }
        }
    },
    {
        sequelize: db_1.default,
        tableName: 'user_skill_liaisons',
        modelName: 'UserSkillLiaison',
        timestamps: true
    }
);
