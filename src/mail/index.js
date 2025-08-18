'use strict';

import _ from 'lodash';
import * as messageFactory from './message-factory.js';
import { sendMail as mailerSendMail } from './mailer.js';
import * as env from '../env.js';
import { mailModel, userModel } from '../model/index.js';

const createLetterObject = function (recipients, subject, textBody, htmlBody) {
  return {
    from: `"${env.POST_SENDER_TITLE}" <${env.POST_ADDRESS}>`,
    to: recipients,
    subject: subject,
    text: textBody,
    html: htmlBody
  }
};

const sendMessage = function (recipients, subject, textBody, htmlBody) {
  return mailModel
    .saveLetters([createLetterObject(recipients, subject, textBody, htmlBody)])
    .then(() => mailerSendMail());
};

export const sendActivationMessage = function (user, key) {
  if (user.email) {
    sendMessage([user.email], 'Account activation', null, messageFactory.buildActivationMessage(user, key));
  }
};

export const sendResetPasswordMessage = function (user, key) {
  if (user.email) {
    sendMessage([user.email], 'Password Reset', null, messageFactory.buildResetPasswordMessage(user, key));
  }
};

export const createAccountExpiredMessages = function (users, transaction) {
  let messages = [];
  _.forEach(users, (user => {
    if (user.email) {
      let message = createLetterObject([user.email], 'Trial period has expired',
        null, messageFactory.buildAccountExpiredMessage(user));
      messages.push(message);
    }
  }));
  return mailModel.saveLetters(messages, transaction);
};

export const sendNotifyMessages = function (users, opportunityName) {
   userModel
    .find({id: { $in: users }})
    .then(users => {
      _.forEach(users, (user => {
        if(user.dataValues.email !== '') {
          sendMessage([user.dataValues.email], 'Notify Email', null, '<span>The "'+opportunityName+'" opportunity has been updated.</span>');
        }
      }))
    }).catch(error => console.log(error));
};

export const sendReminderMessage = function (user, opportunityName) {
  if (user.email) {
    sendMessage([user.email], 'Reminder Email', null, '<span>Reminder for the "'+opportunityName+'" opportunity.</span>');
  }
};

export const sendMail = function () {
  mailerSendMail();
};
