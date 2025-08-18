import * as model from '../model/index.js';
const statusModel = model.statusModel;
const opportunityModel = model.opportunityModel;
import { controllerUtils, HTTP_CODE } from '../core/index.js';
const HTTP_CODES = HTTP_CODE;
import _ from 'lodash';

const saveStatus = async function (status) {
  return await statusModel.save(status);
};

const reorderStatuses = async function(data) {
  await Promise.all(data.map(async(status, i) => {
    await statusModel
      .findById(status.id)
      .then(async (status) => {
        await status
              .update({
                order: i+1 || status.order
              })
              .then()
              .catch(error => res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'}))
      })
      .catch(error => res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Status not found'}));
  }))
};

const removeStatus = async function(opportunities) {
  await Promise.all(opportunities.map(async(opportunity) => {
      // Delete active opportunities
      if (opportunity.is_active) {
        await opportunityModel
          .findById(opportunity.id)
          .then(async (opportunity) => {
            await opportunity
              .destroy()
              .then()
              .catch(error => res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'}))
          })
          .catch(error => res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'}))
      }else {
        // Update status_id for archived opportunities
        let archivedStatus = await statusModel.findOne({name: 'Archived'});

        await opportunityModel
          .findById(opportunity.id)
          .then(async (opportunity) => {
            await opportunity
              .update({ status_id: archivedStatus.dataValues.id })
              .then()
              .catch(error => res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'}))
          })
          .catch(error => res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'}))
      }
  }));
}

export const loadAll = function (req, res, next) {
  statusModel
    .loadAll()
    .then(statuses => {
      statuses = _.orderBy(statuses, ['order'], ['asc']);
      res.json(statuses)
    })
    .catch(next);
};

export const save = function (req, res, next) {
  let status = controllerUtils.extractObjectFromRequest(req);
  if (status) {
    saveStatus(status)
      .then(status => res.status(HTTP_CODES.OK).send(status))
      .catch(error => {
        res.status(HTTP_CODES.BAD_REQUEST).send(error.errors[0]);
      });
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
};

export const remove = function (req, res, next) {
  if (req.body.id) {
    let opportunities = req.body.opportunities;
    removeStatus(opportunities)
      .then(() => {
        statusModel
          .removeById(req.body.id)
          .then(() => {
            return res.status(HTTP_CODES.OK).send({message: 'Successfully removed'});
          })
          .catch(next);
      })
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
};

export const reorder = function (req, res, next) {
  let data = req.body;
  reorderStatuses(data).then(() => {
    return res.status(HTTP_CODES.OK).send({message: 'Status reordered successfully.'});
  });
}