'use strict';

export const extractObjectFromRequest = function (req) {
  return req.body ? req.body.object : null;
};

export const extractIdFromRequest = function (req) {
  return req.body ? req.body.id : null;
};

export const responseHandler = function (res, success, message, data) {
  res.json({
      success: success,
      message: message,
      data: data
  });
};

export const formatDate = function (date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}