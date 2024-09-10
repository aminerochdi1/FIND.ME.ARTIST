'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photos extends Model {

    static associate(models) {
      Photos.belongsTo(models.Profile, { foreignKey: 'profile_id' });
      Photos.belongsTo(models.Medias, { foreignKey: 'media_id', as: "media" });
    }
  }
  Photos.init({
    profile_id: DataTypes.INTEGER,
    media_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Photos',
  });
  return Photos;
};