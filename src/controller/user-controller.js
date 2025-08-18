'use strict';

import _ from 'lodash';
import moment from 'moment';
import * as mail from '../mail/index.js';
import * as env from '../env.js';
import * as accessController from './access-controller.js';

import * as model from '../model/index.js';
const userModel = model.userModel;
const accessTokenModel = model.accessTokenModel;
const confirmationKeyModel = model.confirmationKeyModel;

import { sequelize, Sequelize } from '../database.js';


import { controllerUtils, accessCache, HTTP_CODE, constants, error } from '../core/index.js';
const HTTP_CODES = HTTP_CODE;
const PERMISSION_TYPE = constants.PERMISSION_TYPE;
const BadRequestError = error.BadRequestError;

import fs from 'graceful-fs';
const aws = {
  accessKeyId: env.AWS.ACCESS_KEY_ID,
  secretAccessKey: env.AWS.SECRET_ACCESS_KEY
}
const BUCKET_NAME = env.AWS.BUCKET_NAME;
import s3 from 's3';
var s3Client = s3.createClient({
  s3Options: aws
});

const getDefaultRoles = function () {
  let defaultRole = accessCache.getDefaultRole();
  return defaultRole ? [defaultRole] : [];
};

const throwSuperAdministratorCredentialsLostError = function () {
  throw new BadRequestError('Super administrator credentials will be lost');
};

const saveUser = async function (user, authData) {
  let permissions = accessCache.getPermissionsForRoles(user.roles);
  let isSuperAdministrator = _.indexOf(permissions, PERMISSION_TYPE.administration) >= 0;
  if (isSuperAdministrator) {
    user.active = true;
    user.expires = null;
    if (authData.id !== user.id) {
      return await sequelize.transaction(async (transaction) => {
        let removeActivationKey = !!user.id;
        user = await userModel.save(user, transaction);
        await userModel.setRoles(authData.id, getDefaultRoles(), transaction);
        await accessTokenModel.clearUserSession([authData.id], transaction);
        removeActivationKey && await confirmationKeyModel.removeAccountActivationKey(user.id, transaction);
        return user;
      });
    }
  } else if (authData.id === user.id) {
    throwSuperAdministratorCredentialsLostError();
  }
  return await userModel.save(user);
};

export const loadAll = function (req, res, next) {
  userModel
    .loadAll()
    .then(users => res.json(users))
    .catch(next);
};

export const save = function (req, res, next) {
  let user = controllerUtils.extractObjectFromRequest(req);
  if (user) {
    user.roles = !user.roles ? getDefaultRoles() : user.roles;
    saveUser(user, accessController.getAuthData(req))
      .then(user => res.status(HTTP_CODES.OK).send(user))
      .catch(error => {
        res.status(HTTP_CODES.BAD_REQUEST).send(error);
      });
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send('Incorrect request');
  }
};

export const remove = function (req, res, next) {
  let id = controllerUtils.extractIdFromRequest(req);
  if (id) {
    let authData = accessController.getAuthData(req);
    authData.id === id && throwSuperAdministratorCredentialsLostError();
    userModel
      .removeById(id)
      .then(() => res.status(HTTP_CODES.OK).send())
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send('Incorrect request');
  }
};

const activateUser = async function (userId, password, expires, transaction) {
  if (!transaction) {
    return sequelize.transaction(transaction => activateUser(userId, password, expires, transaction));
  }
  await userModel.activateUser(userId, password, expires, transaction);
};

const activateUserWithoutPassword = async function (userId, expires, transaction) {
  if (!transaction) {
    return sequelize.transaction(transaction => activateUserWithoutPassword(userId, expires, transaction));
  }
  await userModel.activateUserWithoutPassword(userId, expires, transaction);
};

const deactivateUser = async function (userId, transaction) {
  if (!transaction) {
    return sequelize.transaction(transaction => deactivateUser(userId, transaction));
  }
  await userModel.deactivateUser(userId, transaction);
  await accessTokenModel.clearUserSession(userId, transaction);
};

export const register = function (req, res, next) {
  let user = controllerUtils.extractObjectFromRequest(req);
  if (user && !user.id) {
    user.active = false;
    user.roles = getDefaultRoles();
    userModel
      .save(user)
      .then(user => confirmationKeyModel.createAccountActivationKey(user.id))
      .then((key) => {
        mail.sendActivationMessage(user, key);
        res.json({
          success: true,
          message: 'Registration successful. Please check your email to activate your account.',
          data: {
            message: 'Registration successful. Please check your email to activate your account.',
            supportEmail: env.MAIL_BROKER_ACCOUNT
          }
        });
      })
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message: 'Incorrect request',
      data: null
    });
  }
};

export const confirmResetPassword = function (req, res, next) {
  let user = req.body;
  if (user && user.email) {
    userModel
      .findByUsernameOrEmail(user.email)
      .then((user) => {
        if (user) {
                      confirmationKeyModel
              .createResetPasswordKey(user.id)
              .then((key) => {
                mail.sendResetPasswordMessage(user, key);
                res.json({
                  success: true,
                  message: 'Password reset email sent successfully.',
                  data: {
                    message: 'Password reset email sent successfully.',
                    supportEmail: env.MAIL_BROKER_ACCOUNT
                  }
                });
              })
            .catch(next);
        } else {
          res.status(HTTP_CODES.BAD_REQUEST).send("User not found");
        }
      })
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send('Incorrect request');
  }
};


export const activateAccount = function (req, res, next) {
  let activationKey = req.body.key;
  if (activationKey) {
    confirmationKeyModel
      .findAccountActivationKeyByValue(activationKey)
      .then((key) => {
        if (key) {
          return sequelize
            .transaction((transaction) => {
              let expires;
              if (env.TRIAL_PERIOD_INTERVAL_IN_MS) {
                expires = moment().add(env.TRIAL_PERIOD_INTERVAL_IN_MS, 'milliseconds');
              }
              return activateUserWithoutPassword(key.userId, expires.toDate(), transaction)
                .then(() => confirmationKeyModel.removeById(key.id, transaction))
                .then(() => userModel.findById(key.userId));
            })
            .then((user) => {
              user ? res.json({username: user.username || user.email}) : res.status(401).send('User no longer exist');
            })
            .catch(next);
        } else {
          res.status(HTTP_CODES.UNAUTHORIZED).send('Invalid activation key');
        }
      })
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send('Incorrect request');
  }
};

export const resetPassword = function (req, res, next) {
  let activationKey = req.body.key, password = req.body.password;
  if (activationKey && password) {
    confirmationKeyModel
      .findAccountActivationKeyByValue(activationKey)
      .then((key) => {
        if (key) {
          return sequelize
            .transaction((transaction) => {
              return userModel
                .resetPassword(key.userId, password, transaction)
                .then(() => confirmationKeyModel.removeById(key.id, transaction))
                .then(() => userModel.findById(key.userId));
            })
            .then((user) => {
              if (user) {
                user.active ? res.json({username: user.username || user.email}) :
                  res.status(HTTP_CODES.FORBIDDEN).send('User is not active, possible your trial period has expired');
              } else {
                res.status(HTTP_CODES.UNAUTHORIZED).send('User no longer exist');
              }
            })
            .catch(next);
        } else {
          res.status(HTTP_CODES.UNAUTHORIZED).send('Invalid activation key');
        }
      })
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send('Incorrect request');
  }
};

export const checkAlreadyExist = function (req, res, next) {
  let usernameOrEmail = req.body ? req.body.value : '';
  let id = req.body ? req.body.objectId : '';
  if (usernameOrEmail) {
    userModel
      .findByUsernameOrEmail(usernameOrEmail)
      .then(user => res.status(HTTP_CODES.OK).json({unique: !user || user.id === id}))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send('Incorrect request');
  }
};

export const update = function(req, res, next) {
  return userModel
    .findById(req.body.object.id)
    .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }

        return user
          .update(req.body.object)
          .then(() => res.status(200).send(user))
          .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
};

export const upload = function(req, res, next) {
  const data = req.body.base64;
  const tempLocation = '/image/' + Date.now() + '.jpg';
  uploadPhoto(data, tempLocation, (imageUrl) => {
    console.log(imageUrl, 'image uploaded succesfully...');
    res.status(200).json({
      url: imageUrl
    });
  });
};

const uploadPhoto = (data, filepath, cb) => {
  data = data.replace(/^data:image\/jpeg;base64,/, "");
  data = data.replace(/^data:image\/png;base64,/, "");

  // Save base64 string as image file on server ...
  var imageBuffer = new Buffer(data, 'base64'); //console = <Buffer 75 ab 5a 8a ...
  fs.writeFileSync('public' + filepath, imageBuffer);

  // Upload saved image to s3, then delete it after successful upload
  const uploadKey = Date.now() + '.jpg';
  var params = {
    localFile: "public" + filepath,

    s3Params: {
      Bucket: BUCKET_NAME,
      Key: uploadKey,
      ACL: 'public-read'
    },
  };
  var uploader = s3Client.uploadFile(params);
  uploader.on('error', function (err) {
    console.error("unable to upload:", err.stack);
    cb(null);
  });
  uploader.on('end', function () {
    console.log('upload end')
    fs.unlinkSync('public' + filepath);
    const imageUrl = s3.getPublicUrl(BUCKET_NAME, uploadKey);
    cb(imageUrl);
  });
}