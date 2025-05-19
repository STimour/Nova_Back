import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { User } from './User.model';
import { Session } from './Session.model';

export enum ReportStatus {
  OUVERT = 'ouvert',
  EN_COURS_EXAMEN = 'en_cours_examen',
  RESOLU_ACTION_PRISE = 'résolu_action_prise',
  RESOLU_SANS_ACTION = 'résolu_sans_action'
}

export class Report extends Model {
  public id!: number;
  public reporterId!: number;
  public reportedUserId?: number;
  public reportedSessionId?: number;
  public reason!: string;
  public status!: ReportStatus;
  public adminNotes?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public readonly reporter?: User;
  public readonly reportedUser?: User;
  public readonly reportedSession?: Session;
}

Report.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    reportedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    reportedSessionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Session,
        key: 'id'
      }
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ReportStatus)),
      allowNull: false,
      defaultValue: ReportStatus.OUVERT
    }
  },
  {
    sequelize,
    tableName: 'reports',
    modelName: 'Report',
    timestamps: true
  }
);
