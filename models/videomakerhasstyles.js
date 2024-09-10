'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VideoMakerHasStyles extends Model {

    static associate(models) {
      this.belongsTo(models.Profile, { foreignKey: 'profile_id' });
    }
  }
  VideoMakerHasStyles.init({
    profile_id: DataTypes.INTEGER,
    style: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VideoMakerHasStyles',
  });
  return VideoMakerHasStyles;
};