import * as model from '../model/index.js';
const accountModel = model.accountModel;
import { controllerUtils, HTTP_CODE } from '../core/index.js';
const HTTP_CODES = HTTP_CODE;
import _ from 'lodash';
import * as env from '../env.js';

import fs from 'graceful-fs';
const aws = {
  accessKeyId: env.AWS.ACCESS_KEY_ID,
  secretAccessKey: env.AWS.SECRET_ACCESS_KEY
}
const BUCKET_NAME = env.AWS.BUCKET_NAME;
import s3 from 's3';
var s3Client = s3.createClient({
  s3Options: aws
});

const saveAccount = async function (account) {
  return await accountModel.save(account);
};


export const loadAll = function (req, res, next) {
  accountModel
    .loadAll()
    .then(accounts => res.json(accounts))
    .catch(next);
};

export const save = function (req, res, next) {
  let account = controllerUtils.extractObjectFromRequest(req);
  if (account) {
    account.contacts = !account.contacts ? [] : account.contacts;
    saveAccount(account)
      .then(account => res.status(HTTP_CODES.OK).send(account))
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
}

export const remove = function (req, res, next) {
  let id = controllerUtils.extractIdFromRequest(req);
  if (id) {
    accountModel
      .removeById(id)
      .then(() => res.status(HTTP_CODES.OK).send())
      .catch(next);
  } else {
    res.status(HTTP_CODES.BAD_REQUEST).send({message: 'Incorrect request'});
  }
};

export const upload = function(req, res, next) {
  const data = req.body.base64;
  const tempLocation = '/document/' + Date.now() + '.txt';
  uploadToS3(data, tempLocation, (documentUrl) => {
    res.status(200).json({
      url: documentUrl
    });
  });
};

const uploadToS3 = (data, filepath, cb) => {
  data = data.replace(/^data:image\/jpeg;base64,/, "");
  data = data.replace(/^data:image\/png;base64,/, "");

  // Save base64 string as image file on server ...
  var documentBuffer = new Buffer(data, 'base64'); //console = <Buffer 75 ab 5a 8a ...
  fs.writeFileSync('public' + filepath, documentBuffer);

  // Upload saved image to s3, then delete it after successful upload
  const uploadKey = Date.now() + '.txt';
  var params = {
    localFile: "public" + filepath,

    s3Params: {
      Bucket: BUCKET_NAME,
      Key: uploadKey,
      ACL: 'public-read'
    },
  };
  var uploader = s3Client.uploadFile(params);
  uploader.on('error', function (err) {
    console.error("unable to upload:", err.stack);
    cb(null);
  });
  uploader.on('end', function () {
    console.log('upload end')
    fs.unlinkSync('public' + filepath);
    const documentUrl = s3.getPublicUrl(BUCKET_NAME, uploadKey);
    cb(documentUrl);
  });
}