'use strict';

import * as env from '../../env.js';

import * as model from '../../model/index.js';
const userModel = model.userModel;

import * as core from '../../core/index.js';
const accessCache = core.accessCache;
const constants = core.constants;

export const init = function (transaction) {
  let superAdministratorRole = accessCache.getRole([constants.PERMISSION_TYPE.administration]);
  return userModel.save({
    username: env.DEFAULT_ADMINISTRATOR_NAME,
    firstName: "Eric",
    lastName: "Smith",
    active: true,
    password: env.DEFAULT_ADMINISTRATOR_PASSWORD,
    roles: [superAdministratorRole]
  }, transaction);
};
