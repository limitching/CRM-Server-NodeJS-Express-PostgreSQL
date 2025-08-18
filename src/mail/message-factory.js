'use strict';

import pug from 'pug';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as env from '../env.js';
import { userModel } from '../model/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compileTemplate = function (name) {
  return pug.compileFile(`${__dirname}/templates/${name}.html`);
};

const activationMessageTemplate = compileTemplate('account-activation');
const accountExpiredMessageTemplate = compileTemplate('trial-period-expired');
const resetPasswordMessageTemplate = compileTemplate('reset-password-template');

export const buildActivationMessage = function (user, key) {
  return activationMessageTemplate({
    recipientTitle: userModel.getDisplayName(user),
    company: env.POST_SENDER_TITLE,
    frontendUrl: env.FRONTEND_URL,
    activationKey: key.value
  });
};

export const buildResetPasswordMessage = function (user, key) {
  return resetPasswordMessageTemplate({
    recipientTitle: userModel.getDisplayName(user),
    username: user.email,
    company: env.POST_SENDER_TITLE,
    frontendUrl: env.FRONTEND_URL,
    activationKey: key.value
  });
};

export const buildAccountExpiredMessage = function (user) {
  return accountExpiredMessageTemplate({
    recipientTitle: userModel.getDisplayName(user),
    company: env.POST_SENDER_TITLE,
    frontendUrl: env.FRONTEND_URL
  });
};
