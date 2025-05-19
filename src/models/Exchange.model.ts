import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { User } from './User.model';

export class Exchange extends Model {
  public id!: number;
  public userId!: number;
  public withUserId?: number;
  public duration!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Exchange.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    withUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'exchanges',
    modelName: 'Exchange',
    timestamps: true
  }
);

Exchange.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Exchange, { foreignKey: 'userId', as: 'exchanges' });
Exchange.belongsTo(User, { foreignKey: 'withUserId', as: 'exchangePartner' });
User.hasMany(Exchange, { foreignKey: 'withUserId', as: 'receivedExchanges' });
