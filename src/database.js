'use strict';

const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const env = require('./env');
dotenv.config();

module.exports.sequelize = new Sequelize(
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
module.exports.Sequelize = Sequelize;