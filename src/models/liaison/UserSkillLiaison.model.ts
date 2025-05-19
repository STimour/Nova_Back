import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import { User } from '../User.model';
import { Skill } from '../Skill.model';
export class UserSkillLiaison extends Model {
  public id!: number;
  public idUser!: number;
  public idSkill!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

UserSkillLiaison.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    idSkill: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Skill,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'user_skill_liaisons',
    modelName: 'UserSkillLiaison',
    timestamps: true
  }
);
