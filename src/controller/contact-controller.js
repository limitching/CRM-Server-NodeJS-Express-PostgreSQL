import * as model from '../model/index.js';
const contactModel = model.contactModel;
import { controllerUtils, HTTP_CODE } from '../core/index.js';
const HTTP_CODES = HTTP_CODE;
import _ from 'lodash';

const saveContact = async function (contact) {
  return await contactModel.save(contact);
};

export const loadAll = function (req, res, next) {
  contactModel
    .loadAll()
    .then(contacts => res.json(contacts))
    .catch(next);
};

export const save = function (req, res, next) {
  let contact = controllerUtils.extractObjectFromRequest(req); 
  if (contact) {
    contact.accounts = !contact.accounts ? [] : contact.accounts;
    saveContact(contact)
      .then(contact => res.status(HTTP_CODES.OK).send(contact))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
}

export const remove = function (req, res, next) {
  let id = controllerUtils.extractIdFromRequest(req);
  if (id) {
    contactModel
      .removeById(id)
      .then(() => res.status(HTTP_CODES.OK).send())
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
};