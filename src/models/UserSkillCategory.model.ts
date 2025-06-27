import { Model, DataTypes } from 'sequelize';
import sequelize from '../configDB/db';
import { User } from './User.model';
import { SkillsCategory } from './SkillsCategory.model';

export class UserSkillCategory extends Model {}

UserSkillCategory.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: User, key: 'id' }
        },
        skillCategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: SkillsCategory, key: 'id' }
        }
    },
    { sequelize, tableName: 'user_skill_categories', timestamps: false }
);

// Associations
User.belongsToMany(SkillsCategory, {
    through: UserSkillCategory,
    foreignKey: 'userId',
    as: 'learningCategories'
});
SkillsCategory.belongsToMany(User, {
    through: UserSkillCategory,
    foreignKey: 'skillCategoryId',
    as: 'learners'
});
