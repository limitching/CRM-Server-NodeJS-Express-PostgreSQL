'use strict';

import _ from 'lodash';
import accessTokenModel from './access-token-model.js';
import userModel from './user-model.js';
import configModel from './config-model.js';
import mailModel from './mail-model.js';
import confirmationKeyModel from './confirmation-key-model.js';
import permissionModel from './permission-model.js';
import roleModel from './role-model.js';
import departmentModel from './department-model.js';
import opportunityModel from './opportunity-model.js';
import statusModel from './status-model.js';
import reminderModel from './reminder-model.js';
import contactModel from './contact-model.js';
import accountModel from './account-model.js';
import socialNetworkModel from './social-network-model.js';
import contactAccountsModel from './contact-accounts-model.js';
import addressModel from './address-model.js';

import { sequelize } from '../database.js';

import { Model } from '../core/index.js';

const models = {
  configModel,
  accessTokenModel,
  userModel,
  mailModel,
  confirmationKeyModel,
  permissionModel,
  roleModel,
  departmentModel,
  opportunityModel,
  statusModel,
  reminderModel,
  contactModel,
  accountModel,
  socialNetworkModel,
  contactAccountsModel,
  addressModel
};

const init = function () {
  let promises = [];
  _.forEach(models, (moduleMember) => {
    if (moduleMember instanceof Model) {
      let res = moduleMember.init();
      res instanceof Promise && promises.push(res);
    }
  });
  return Promise.all(promises).then(() => sequelize.sync({force: false}));
};

export {
  init,
  configModel,
  accessTokenModel,
  userModel,
  mailModel,
  confirmationKeyModel,
  permissionModel,
  roleModel,
  departmentModel,
  opportunityModel,
  statusModel,
  reminderModel,
  contactModel,
  accountModel,
  socialNetworkModel,
  contactAccountsModel,
  addressModel
};