import * as model from '../model/index.js';
const roleModel = model.roleModel;
import { controllerUtils, HTTP_CODE } from '../core/index.js';
const HTTP_CODES = HTTP_CODE;
import _ from 'lodash';

const saveRole = async function (role) {
  return await roleModel.save(role);
};

export const loadAll = function (req, res, next) {
  roleModel
    .loadAll()
    .then(roles => res.json(roles))
    .catch(next);
};

export const save = function (req, res, next) {
  let role = controllerUtils.extractObjectFromRequest(req);
  if (role) {
    saveRole(role)
      .then(role => res.status(HTTP_CODES.OK).send(role))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
}

export const remove = function (req, res, next) {
  let id = controllerUtils.extractIdFromRequest(req);
  if (id) {
    roleModel
      .removeById(id)
      .then(() => res.status(HTTP_CODES.OK).send())
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
};
