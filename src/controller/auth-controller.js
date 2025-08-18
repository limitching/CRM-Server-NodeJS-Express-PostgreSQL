'use strict';

import _ from 'lodash';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { expressjwt as expressJwt } from 'express-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import passwordHash from 'password-hash';
import * as accessController from './access-controller.js';

import * as model from '../model/index.js';
const userModel = model.userModel;
const accessTokenModel = model.accessTokenModel;

import { accessCache, HTTP_CODE } from '../core/index.js';

const AUTH_HEADER_PREFIX = 'Bearer ';

const sendInvalidAccessTokenError = function (res) {
  res.status(HTTP_CODE.UNAUTHORIZED).send('Invalid access token');
};

const extractAccessToken = function (req) {
  let authHeader = req.get('Authorization');
  if (authHeader) {
    authHeader = authHeader.startsWith(AUTH_HEADER_PREFIX) ? authHeader.substr(AUTH_HEADER_PREFIX.length - 1)
      : authHeader;
    authHeader = authHeader.trim();
  }
  return authHeader;
};


export const generateToken = function (req, res, next) {
  req.token = jwt.sign({
      id: req.user.id,
      permissions: req.user.permissions
    }, 'server secret', {expiresIn: '7d'});
  accessTokenModel.saveUserSession(req.user.id, req.token).then(() => next()).catch(next);
};

export const sendAuthData = function (req, res) {
  let roles = _.map(accessCache.getRoles(), (role) => {
    return {
      id: role.id,
      title: role.title,
      permissions: accessCache.getPermissionsByRoleId(role.id)
    };
  });
  
  userModel
    .findById(req.user.id)
    .then(user => {
        res.status(HTTP_CODE.OK).send({
          token: req.token,
          userId: req.user.id,
          permissions: req.user.permissions,
          config: {roles},
          userData: user
        });      
    })
};

export const checkAccessTokenValid = function (req, res, next) {
  if (req.user) {
    let accessToken = extractAccessToken(req);
    if (accessToken) {
      accessTokenModel.findByUserId(req.user.id)
        .then(validToken => !validToken || accessToken !== validToken.value ? sendInvalidAccessTokenError(res) : next())
        .catch(() => sendInvalidAccessTokenError(res));
    } else {
      sendInvalidAccessTokenError(res);
    }
  } else {
    sendInvalidAccessTokenError(res);
  }
};

export const serialize = function (req, res, next) {
  req.user = {
    id: req.user.id,
    permissions: accessController.getPermissionsForRoles(req.user.roles),
  };
  next();
};

export const localStrategy = new LocalStrategy({usernameField: 'username', passwordField: 'password'},
  (username, password, done) => {
    userModel.loadAuthDataByByUsernameOrEmail(username).then((authData) => {
      if (authData && authData.active) {
        const passwordValid = passwordHash.verify(password, authData.password);
        
        if (passwordValid) {
          done(null, authData);
        } else {
          done(null, false);
        }
      } else {
        done(null, false);
      }
    }).catch((error) => {
      done(error);
    });
  });

export const logout = function (req, res, next) {
  accessTokenModel.clearUserSession(req.user.id).then(() => {
    req.logout();
    res.sendStatus(HTTP_CODE.OK);
  }).catch(next);
};

export const checkAccessToken = expressJwt({secret: 'server secret', algorithms: ['HS256']});

export const authenticate = passport.authenticate('local', {session: false});

