'use strict';

import userModel from './user-model.js';

import { sequelize, Sequelize } from '../database.js';



import { Model } from '../core/index.js';

const MODEL_ATTRIBUTES = {
  value: {type: Sequelize.TEXT, field: 'value', allowNull: false},
  userId: {
    type: Sequelize.UUID,
    field: 'user_id',
    onDelete: 'cascade',
    allowNull: false,
    unique: true,
    references: {
      model: userModel.sequelizeModel,
      key: 'id',
      unique: true,
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
};

class AccessTokenModel extends Model {
  constructor() {
    super('access_tokens');
    this.buildModel(MODEL_ATTRIBUTES);
  }

  findByUserId(userId, transaction) {
    return super.findOne({userId: userId}, transaction);
  }

  saveUserSession(userId, value, transaction) {
    if(!transaction) {
      return sequelize.transaction(transaction => this.saveUserSession(userId, value, transaction));
    }
    return this
      .sequelizeModel
      .findOrCreate({
        where: {userId: userId},
        defaults: {
          userId: userId,
          value: value,
        },
        transaction: transaction
      }).then((res) => {
        let token = res[0];
        token.value = value;
        return token.save({transaction: transaction});
      });
  }

  clearUserSession(userIds, transaction) {
    userIds = !Array.isArray(userIds) ? [userIds] : userIds;
    return super.remove({userId: {$in: userIds}}, transaction);
  }
}

export default new AccessTokenModel();