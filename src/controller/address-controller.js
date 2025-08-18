import * as model from '../model/index.js';
const addressModel = model.addressModel;
import { controllerUtils, HTTP_CODE } from '../core/index.js';
const HTTP_CODES = HTTP_CODE;
import _ from 'lodash';

const saveAddress = async function (address) {
  return await addressModel.save(address);
};

export const loadAll = function (req, res, next) {
  addressModel
    .loadAll()
    .then(addresses => res.json(addresses))
    .catch(next);
};

export const save = function (req, res, next) {
  let address = controllerUtils.extractObjectFromRequest(req);
  if (address) {
    saveAddress(address)
      .then(address => res.status(HTTP_CODES.OK).send(address))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
}

export const remove = function (req, res, next) {
  let id = controllerUtils.extractIdFromRequest(req);
  if (id) {
    addressModel
      .removeById(id)
      .then(() => res.status(HTTP_CODES.OK).send())
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
};

export const getById = function (req, res, next) {
  let id = req.params.id;
  if (id) {
    addressModel
      .findById(id)
      .then(address => res.status(HTTP_CODES.OK).send(address))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
};