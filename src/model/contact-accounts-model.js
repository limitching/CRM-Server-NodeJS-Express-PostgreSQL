'use strict';

import { sequelize, Sequelize } from '../database.js';


import { ContainerModel } from '../core/index.js';
import contactModel from './contact-model.js';
import accountModel from './account-model.js';

const MODEL_ATTRIBUTES = {
  contact_id: {type: Sequelize.UUID, allowNull: false},
  account_id: {type: Sequelize.UUID, allowNull: false}
};

class ContactAccountsModel extends ContainerModel {
  constructor() {
    super('CA');
    this.buildModel(MODEL_ATTRIBUTES);
    accountModel.createBelongsToManyAssociationWithCircular('contacts', 'contact_accounts', 'account_id', contactModel.sequelizeModel, ['id']);
    contactModel.createBelongsToManyAssociation('accounts', 'contact_accounts', 'contact_id', accountModel.sequelizeModel, ['id']);
  }
}

export default new ContactAccountsModel();

