'use strict';

import database from '../database.js';
const Sequelize = database.Sequelize;

import { Model } from '../core/index.js';

const MODEL_ATTRIBUTES = {
  street1: {type: Sequelize.TEXT},
  street2: {type: Sequelize.TEXT},
  city: {type: Sequelize.TEXT},
  state: {type: Sequelize.TEXT},
  country: {type: Sequelize.TEXT},
  zip: {type: Sequelize.TEXT},
  zip2: {type: Sequelize.TEXT},
  notes: {type: Sequelize.TEXT},
  attn: {type: Sequelize.TEXT},
  phone_no: {type: Sequelize.TEXT}
};

class AddressModel extends Model {
  constructor() {
    super('addresses');
    this.buildModel(MODEL_ATTRIBUTES);
  }
}

export default new AddressModel();

