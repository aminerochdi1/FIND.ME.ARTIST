'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {

    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'id' });
    }
  }
  Session.init({
    user_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    expiration: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};