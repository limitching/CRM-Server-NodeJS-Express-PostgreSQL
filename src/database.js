import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import * as env from './env.js';

dotenv.config();

const sequelize = new Sequelize(
  env.MYSQL_DATABASE,
  env.MYSQL_USERNAME,
  env.MYSQL_PASSWORD,
  {
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    dialect: env.MYSQL_DIALECT,
    logging: env.NODE_ENV === env.ENV_TYPE.development,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+08:00' // 設定時區為台灣時間
  }
);

export { sequelize, Sequelize };
export default sequelize;