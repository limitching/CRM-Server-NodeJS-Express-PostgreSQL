'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import https from 'https';
import passport from 'passport';
import session from 'express-session';
import { morganMiddleware, morganDev, morganSimple } from './morgan-config.js';
import { requestLogger } from './request-logger.js';
import errorhandler from 'errorhandler';
import { init as roleDataInit } from './data/role.js';
import { init as userDataInit } from './data/user.js';

import * as env from '../env.js';
import * as mail from '../mail/index.js';
import { start as schedulerStart } from './scheduler.js';
import routes from "./routes.js";

import * as controller from '../controller/index.js';
const authController = controller.authController;
const mainController = controller.mainController;

import * as model from '../model/index.js';
const configModel = model.configModel;

import { sequelize } from '../database.js';

class Server {
  constructor() {
    this._started = false;
    this._errorHandler = null;

    console.info(`Environment: ${env.NODE_ENV}`); 
    passport.use(authController.localStrategy);
  }

  _initApp() {
    this._app = express();
    let rootRouter = express.Router();
    
    // 先設置 body-parser，這樣 morgan 才能讀取到 req.body
    this._app.use(bodyParser.json());
    
    // 根據環境選擇不同的 morgan 配置
    if (env.NODE_ENV === env.ENV_TYPE.development) {
      this._app.use(morganDev);
    } else {
      this._app.use(morganSimple);
    }
    
    // 啟用詳細日誌記錄（包含請求體和響應詳情）
    this._app.use(morganMiddleware);
    
    // 使用自定義請求日誌中間件（更可靠的請求體記錄）
    this._app.use(requestLogger);

    this._app.use(mainController.addHeaders);
    this._app.use(session({
      secret: 'crm-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }
    }));
    this._app.use(passport.initialize());
    this._app.use(passport.session());

    routes(rootRouter);
    this._app.use('/', rootRouter);

    this._initErrorHandler();
  }

  _initErrorHandler() {
    if (this._errorHandler) {
      this._app.use(this._errorHandler);
    } else if (env.NODE_ENV === env.ENV_TYPE.development) {
      this._app.use(errorhandler({log: err => console.error(err)}));
    } else {
      this._app.use(mainController.errorHandler);
    }
  }

  async _loadData(initializationKey, initializationHandler) {
    initializationKey = `${Server.APPLICATION_INITIALIZATION_KEY}.data.${initializationKey}`;
    return sequelize.transaction(async (transaction) => {
      let key = await configModel.findByKey(initializationKey, transaction);
      if (!key || !key.value) {
        await initializationHandler(transaction);
        await configModel.save({key: initializationKey, value: 1}, transaction);
      }
    });
  }

  _initializeApp() {
    return Promise.all([
      this._loadData('role', roleDataInit)
    ]);
  }

  _loadInitialData() {
    return Promise.all([
      this._loadData('user', userDataInit)
    ]);
  }

  _startServices() {
    mail.sendMail();
    schedulerStart();

    let httpsOptions = null;

    /* Load https certificates */
    if (!env.HTTPS_DISABLED) {
      let key = fs.readFileSync(env.PRIVATE_KEY, 'utf8');
      let cert = fs.readFileSync(env.PUBLIC_KEY, 'utf8');
      httpsOptions = {key: key, cert: cert};
    }

    return new Promise((resolve) => {
      if (httpsOptions) {
        https
          .createServer(httpsOptions, this._app)
          .listen(env.PORT, () => {
            console.log("Https server is running on port", env.PORT);
            resolve();
          });
      } else {
        this._app.listen(env.PORT, () => {
          console.log("Http server is running on port", env.PORT);
          resolve();
        });
      }
    });
  }

  async start() {
    if (!this._started) {
      this._started = true;
    } else {
      return;
    }
    this._initApp();
    await model.init();
    await this._initializeApp();
    await controller.init();
    await this._loadInitialData();
    await this._startServices();
  }
}

Server.APPLICATION_INITIALIZATION_KEY = "app.initialized";

export default new Server();
