import * as model from '../model/index.js';
const socialNetworkModel = model.socialNetworkModel;
import { controllerUtils, HTTP_CODE } from '../core/index.js';
const HTTP_CODES = HTTP_CODE;
import _ from 'lodash';

const saveSocialNetwork = async function (socialNetwork) {
  return await socialNetworkModel.save(socialNetwork);
};

export const loadAll = function (req, res, next) {
  socialNetworkModel
    .loadAll()
    .then(socialNetworks => res.json(socialNetworks))
    .catch(next);
};

export const save = function (req, res, next) {
  let socialNetwork = controllerUtils.extractObjectFromRequest(req);
  if (socialNetwork) {
    saveSocialNetwork(socialNetwork)
      .then(socialNetwork => res.status(HTTP_CODES.OK).send(socialNetwork))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
}

export const remove = function (req, res, next) {
  let id = controllerUtils.extractIdFromRequest(req);
  if (id) {
    socialNetworkModel
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
    socialNetworkModel
      .findById(id)
      .then(socialNetwork => res.status(HTTP_CODES.OK).send(socialNetwork))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
};