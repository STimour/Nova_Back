import { Sequelize } from 'sequelize';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    'postgres://your_username:your_password@localhost:5432/skillup_dev',
  {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: true
  }
);

export default sequelize;
