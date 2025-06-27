import { Model, DataTypes } from 'sequelize';
import sequelize from '../configDB/db';
import { User } from './User.model';
import { Skill } from './Skill.model';

export class UserSkill extends Model {
    userID!: number;
    skillId!: number;
}

UserSkill.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: User, key: 'id' }
        },
        skillId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Skill, key: 'id' }
        }
    },
    { sequelize, tableName: 'user_skills', timestamps: false }
);

// Associations
User.belongsToMany(Skill, { through: UserSkill, foreignKey: 'userId', as: 'skills' });
Skill.belongsToMany(User, { through: UserSkill, foreignKey: 'skillId', as: 'users' });
