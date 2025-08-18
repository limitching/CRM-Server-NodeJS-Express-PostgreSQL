'use strict';

import { sequelize, Sequelize } from '../database.js';


import { Model } from '../core/index.js';

const MODEL_ATTRIBUTES = {
  status_id: {type: Sequelize.UUID, allowNull: false, unique: true},
  name: {type: Sequelize.STRING, allowNull: false},
  company_id: {type: Sequelize.UUID},
  contact_id: {type: Sequelize.UUID},
  value: {type: Sequelize.FLOAT},
  currency:  {type: Sequelize.STRING},
  rating: {type: Sequelize.INTEGER, defaultValue: 3},
  description: {type: Sequelize.TEXT},
  bgColor: {type: Sequelize.STRING, defaultValue: 'white'},
  order: {type: Sequelize.INTEGER, allowNull: false},
  is_active: {type: Sequelize.BOOLEAN, defaultValue: true},
  user_id: {type: Sequelize.UUID},
  notify_users: {type: Sequelize.TEXT},
  createdAt: {type: Sequelize.DATE, field: 'created_at'},
  updatedAt: {type: Sequelize.DATE, field: 'updated_at'}
};

class OpportunityModel extends Model {
  constructor() {
    super('opportunities');
    this.buildModel(MODEL_ATTRIBUTES);
  }
}

export default new OpportunityModel();