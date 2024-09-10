'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {

    static associate(models) {
      Availability.belongsTo(models.Profile, { foreignKey: 'profile_id' });
    }
  }
  Availability.init({
    profile_id: DataTypes.INTEGER,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Availability',
  });
  return Availability;
};