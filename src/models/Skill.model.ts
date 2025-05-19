import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { SkillsCategory } from './SkillsCategory.model';

export class Skill extends Model {
  public id!: number;
  public name!: string;
  public idCategory?: number;
  public description?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Skill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    idCategory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SkillsCategory,
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'skills',
    modelName: 'Skill',
    timestamps: true
  }
);
