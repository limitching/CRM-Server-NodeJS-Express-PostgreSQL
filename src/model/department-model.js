'use strict';

import database from '../database.js';
const Sequelize = database.Sequelize;

import { Model } from '../core/index.js';

const MODEL_ATTRIBUTES = {
  type: {type: Sequelize.STRING, unique: true, allowNull: false}
};

class DepartmentModel extends Model {
  constructor() {
    super('departments');
    this.buildModel(MODEL_ATTRIBUTES);
  }
}

export default new DepartmentModel();
