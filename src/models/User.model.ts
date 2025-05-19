import sequelize from '../config/db';
import { DataTypes } from 'sequelize';
import { Model } from 'sequelize';
import { GenreEnum } from './types/genre.enum';
import { RoleEnum } from './types/user.enum';
import { Availability } from './Availability.model';

export class User extends Model {
  public id!: number;
  public lastname?: string;
  public firstname?: string;
  public email!: string;
  public password!: string;
  public sexe!: GenreEnum;
  public role!: RoleEnum;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sexe: {
      type: DataTypes.ENUM(...Object.values(GenreEnum)),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(...Object.values(RoleEnum)),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true
  }
);

User.hasMany(Availability, { foreignKey: 'idUser', as: 'availabilities' });
Availability.belongsTo(User, { foreignKey: 'idUser', as: 'user' });
