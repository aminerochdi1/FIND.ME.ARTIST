'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhotographerHasStyles extends Model {

    static associate(models) {
      this.belongsTo(models.Profile, { foreignKey: 'profile_id' });
    }
  }
  PhotographerHasStyles.init({
    profile_id: DataTypes.INTEGER,
    style: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PhotographerHasStyles',
  });
  return PhotographerHasStyles;
};