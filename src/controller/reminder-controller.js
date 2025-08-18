import * as model from '../model/index.js';
const reminderModel = model.reminderModel;
import { controllerUtils, HTTP_CODE } from '../core/index.js';
const HTTP_CODES = HTTP_CODE;
import _ from 'lodash';

const saveReminder = async function (reminder) {
  return await reminderModel.save(reminder);
};

export const loadAll = function (req, res, next) {
  reminderModel
    .loadAll()
    .then(reminders => res.json(reminders))
    .catch(next);
};

export const save = function (req, res, next) {
  let reminder = controllerUtils.extractObjectFromRequest(req);
  if (reminder) {
    saveReminder(reminder)
      .then(reminder => res.status(HTTP_CODES.OK).send(reminder))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
}

export const remove = function (req, res, next) {
  let id = controllerUtils.extractIdFromRequest(req);
  if (id) {
    reminderModel
      .removeById(id)
      .then(() => res.status(HTTP_CODES.OK).send())
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
};