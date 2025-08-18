'use strict';

import { sequelize, Sequelize } from '../database.js';


import { Model } from '../core/index.js';

const MODEL_ATTRIBUTES = {
	facebook: {type: Sequelize.STRING},
  twitter: {type: Sequelize.STRING},
  linked_in: {type: Sequelize.STRING},
  instagram: {type: Sequelize.STRING},
  pinterest: {type: Sequelize.STRING},
  youtube: {type: Sequelize.STRING},
  google_plus: {type: Sequelize.STRING}
};

class SocialNetworkModel extends Model {
  constructor() {
    super('social_networks');
    this.buildModel(MODEL_ATTRIBUTES);
  }
}

export default new SocialNetworkModel();

