'use strict';

import * as authController from './auth-controller.js';
import * as mainController from './main-controller.js';
import * as userController from './user-controller.js';
import * as accessController from './access-controller.js';
import * as dashboardController from './dashboard-controller.js';
import * as opportunityController from './opportunity-controller.js';
import * as statusController from './status-controller.js';
import * as reminderController from './reminder-controller.js';
import * as contactController from './contact-controller.js';
import * as accountController from './account-controller.js';
import * as addressController from './address-controller.js';
import * as roleController from './role-controller.js';
import * as socialNetworkController from './social-network-controller.js';
import * as departmentController from './department-controller.js';

const init = function () {
  return accessController.init();
};

export {
  init,
  authController,
  mainController,
  userController,
  accessController,
  dashboardController,
  opportunityController,
  statusController,
  reminderController,
  contactController,
  accountController,
  addressController,
  roleController,
  socialNetworkController,
  departmentController
};
