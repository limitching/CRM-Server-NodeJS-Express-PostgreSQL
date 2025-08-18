import * as model from '../model/index.js';
const departmentModel = model.departmentModel;
import { controllerUtils, HTTP_CODE } from '../core/index.js';
const HTTP_CODES = HTTP_CODE;
import _ from 'lodash';

const saveDepartment = async function (department) {
  return await departmentModel.save(department);
};

export const loadAll = function (req, res, next) {
  departmentModel
    .loadAll()
    .then(departments => res.json(departments))
    .catch(next);
};

export const save = function (req, res, next) {
  let department = controllerUtils.extractObjectFromRequest(req); 
  if (department) {
    saveDepartment(department)
      .then(department => res.status(HTTP_CODES.OK).send(department))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
}

export const remove = function (req, res, next) {
  let id = controllerUtils.extractIdFromRequest(req);
  if (id) {
    departmentModel
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
    departmentModel
      .findById(id)
      .then(department => res.status(HTTP_CODES.OK).send(department))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
};