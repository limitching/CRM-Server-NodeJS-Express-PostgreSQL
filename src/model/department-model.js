'use strict';

import { sequelize, Sequelize } from '../database.js';


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
