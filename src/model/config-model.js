'use strict';

import database from '../database.js';
const Sequelize = database.Sequelize;

import { Model } from '../core/index.js';

const MODEL_ATTRIBUTES = {
  key: {type: Sequelize.STRING, unique: true, allowNull: false},
  value: {type: Sequelize.TEXT}
};

class ConfigModel extends Model {

  constructor() {
    super('config');
    this.buildModel(MODEL_ATTRIBUTES);
  }

  findByKey(key, transaction) {
    return this.findOne({key: key}, transaction);
  }
}

export default new ConfigModel();