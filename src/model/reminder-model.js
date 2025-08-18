'use strict';

import database from '../database.js';
const Sequelize = database.Sequelize;

import { Model } from '../core/index.js';

const MODEL_ATTRIBUTES = {
  user_id: {type: Sequelize.UUID},
  opportunity_id: {type: Sequelize.UUID},
  reminder_id: {type: Sequelize.STRING(50)},
  reminder_date: {type: Sequelize.DATE}
};

class ReminderModel extends Model {
  constructor() {
    super('reminders');
    this.buildModel(MODEL_ATTRIBUTES);
  }
}

export default new ReminderModel();