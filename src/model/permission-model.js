'use strict';

import database from '../database.js';
const Sequelize = database.Sequelize;

import { Model } from '../core/index.js';

const MODEL_ATTRIBUTES = {
  type: {type: Sequelize.STRING, unique: true, allowNull: false},
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      len: 1,
    }
  }
};

class PermissionModel extends Model {
  constructor() {
    super('permissions');
    this.buildModel(MODEL_ATTRIBUTES);
  }
}

export default new PermissionModel();
