import sequelize from '../configDB/db';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.model';

export class Token extends Model {
    public id!: number;
    public token!: string;
    public userId!: number;
    public isActive!: boolean;
    public expiresAt!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Associations (optionnel, mais utile pour TypeScript)
    public readonly user?: User;
}

Token.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'tokens',
        modelName: 'Token',
        timestamps: true
    }
);

// Définir l'association
// Un token appartient à un utilisateur
Token.belongsTo(User, { foreignKey: 'userId', as: 'user' });
