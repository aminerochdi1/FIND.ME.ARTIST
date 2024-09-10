'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Videos extends Model {

    static associate(models) {
      Videos.belongsTo(models.Profile, { foreignKey: 'profile_id' });
      Videos.belongsTo(models.Medias, { foreignKey: 'media_id', as: "media" });
    }
  }
  Videos.init({
    profile_id: DataTypes.INTEGER,
    media_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Videos',
  });
  return Videos;
};