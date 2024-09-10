'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfileHasVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProfileHasVideo.init({
    profile_id: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProfileHasVideo',
  });
  return ProfileHasVideo;
};