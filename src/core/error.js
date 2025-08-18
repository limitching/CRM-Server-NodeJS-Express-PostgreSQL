'use strict';

import { HTTP_CODE } from './constants.js';

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class BadRequestError extends RequestError {
  constructor(message) {
    super(HTTP_CODE.BAD_REQUEST, message);
  }
}

class ValidationError extends BadRequestError {
  constructor(message) {
    super(message);
  }
}

export {
  ValidationError,
  BadRequestError
};
