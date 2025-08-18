'use strict';

import permissionModel from './permission-model.js';

import { sequelize, Sequelize } from '../database.js';


import { ContainerModel } from '../core/index.js';

const MODEL_ATTRIBUTES = {
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      len: 1,
    }
  },
  default: {type: Sequelize.BOOLEAN, allowNull: false}
};

class RoleModel extends ContainerModel {

  constructor() {
    super('roles');
    this.buildModel(MODEL_ATTRIBUTES);
    
    this.createBelongsToManyAssociation('permissions', 'role_permissions', 'role_id',
      permissionModel.sequelizeModel, ['id']);
  }
}

export default new RoleModel();
