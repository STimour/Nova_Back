import sequelize from '../config/db';
import { DataTypes, Model } from 'sequelize';

export class SkillsCategory extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}
SkillsCategory.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'skills_categories',
    modelName: 'SkillsCategory',
    timestamps: true
  }
);
