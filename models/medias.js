'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medias extends Model {

    static associate(models) {
      Medias.belongsTo(models.Profile, { foreignKey: 'profile_id' });
    }
  }
  Medias.init({
    profile_id: DataTypes.INTEGER,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Medias',
  });
  return Medias;
};