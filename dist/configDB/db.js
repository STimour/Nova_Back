'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const sequelize_1 = require('sequelize');
require('dotenv/config');
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables');
}
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: true
});
exports.default = sequelize;
