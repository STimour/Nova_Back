"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../configDB/db"));
const User_model_1 = require("./User.model");
const Session_model_1 = require("./Session.model");
class Report extends sequelize_1.Model {
}
exports.Report = Report;
Report.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    reporterId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_model_1.User,
            key: 'id'
        }
    },
    reportedUserId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User_model_1.User,
            key: 'id'
        }
    },
    reportedSessionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Session_model_1.Session,
            key: 'id'
        }
    },
    reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'ouvert'
    }
}, {
    sequelize: db_1.default,
    tableName: 'reports',
    modelName: 'Report',
    timestamps: true
});
