import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { Session } from './Session.model';
import { User } from './User.model';

export class ChatMessage extends Model {
  public id!: number;
  public idSession?: number;
  public idSender!: number;
  public idReceiver!: number;
  public content!: string;
  public isAnonymized!: boolean;
  public readAt?: Date;

  public createdAt!: Date;
  public updatedAt!: Date;
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idSession: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Session,
        key: 'id'
      }
    },
    idSender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    idReceiver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isAnonymized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'chat_messages',
    modelName: 'ChatMessage',
    timestamps: true
  }
);
