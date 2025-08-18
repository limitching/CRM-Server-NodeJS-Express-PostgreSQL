'use strict';

import _ from 'lodash';
import * as env from '../env.js';

import { HTTP_CODE } from '../core/index.js';

const HTTP_CODES = HTTP_CODE;

const ERROR_CODES = [
  HTTP_CODES.BAD_REQUEST,
  HTTP_CODES.CONFLICT,
  HTTP_CODES.UNAUTHORIZED,
  HTTP_CODES.FORBIDDEN
];

export const addHeaders = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', env.FRONTEND_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  /**
   * use this to suprress the error of:
   * Error: Can't set headers after they are sent.
   */
  if (req.method === 'OPTIONS') {
    res.sendStatus(HTTP_CODES.OK);
  } else {
    next();
  }
};

export const errorHandler = function(err, req, res, next) {
  if(err.status && _.indexOf(ERROR_CODES, err.status) >= 0){
    res.status(err.status).send(err.message);
  } else {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send('Internal server error');
  }
};