'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Polas extends Model {

    static associate(models) {
      Polas.belongsTo(models.Profile, { foreignKey: 'profile_id' });
      Polas.belongsTo(models.Medias, { foreignKey: 'media_id', as: "media" });
    }
  }
  Polas.init({
    profile_id: DataTypes.INTEGER,
    media_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Polas',
  });
  return Polas;
};