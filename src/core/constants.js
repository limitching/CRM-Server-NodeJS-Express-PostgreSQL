'use strict';

export const REG_EXP = {
  email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

export const CONFIRMATION_TYPE = {
  account_activation: 'account_activation',
  reset_password: 'reset_password'
};

export const VALIDATOR_TYPE = {
  letters_and_numbers: 'letters_and_numbers',
  different_register: 'different_register',
  required: 'required',
  min_length: 'minlength',
  email_format: 'email_format',
  phone_number_format: 'phone_number_format'
};

export const HTTP_CODE = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

export const PERMISSION_TYPE = {
  administration: 'administration'
};
