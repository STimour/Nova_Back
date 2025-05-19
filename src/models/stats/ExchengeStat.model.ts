import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db';
import { Exchange } from '../Exchange.model';

export class ExchangeStat extends Model {
  public id!: number;
  public idExchange!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ExchangeStat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idExchange: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Exchange,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'exchange_stats',
    modelName: 'ExchangeStat',
    timestamps: true
  }
);
