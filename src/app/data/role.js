import _ from 'lodash';

import * as model from '../../model/index.js';
const permissionModel = model.permissionModel;
const roleModel = model.roleModel;

import * as core from '../../core/index.js';
const constants = core.constants;

const createPermissions = function (transaction) {
  const PERMISSIONS = [
    {type: constants.PERMISSION_TYPE.administration, title: 'Administration'},
  ];
  return permissionModel.sequelizeModel.bulkCreate(PERMISSIONS, {transaction: transaction});
};

export const init = async function (transaction) {
  let superAdminRole = {title: "Super Administrator", default: false};
  let userRole = {title: "User", default: true};

  let permissions = await createPermissions(transaction);
  let administrationPermission = _.find(permissions, {type: constants.PERMISSION_TYPE.administration});
  superAdminRole.permissions = [administrationPermission];
  await Promise.all([
    roleModel.save(superAdminRole, transaction),
    roleModel.save(userRole, transaction)
  ]);
};
